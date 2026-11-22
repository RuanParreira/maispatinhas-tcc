import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { UNREAD_CHANGED } from "@/hooks/useUnreadMessages";
import { echo } from "@/lib/echo";
import { toChatConversation, toChatMessage } from "@/lib/conversations";
import { cn } from "@/lib/utils";
import ChatPanel from "@/components/messages/ChatPanel";
import ConversationList from "@/components/messages/ConversationList";
import MessagesSkeleton from "@/components/messages/MessagesSkeleton";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

// O contador do menu só recarrega depois que a API confirmou a leitura.
function sendReadReceipt(conversationId) {
  api
    .put(`/api/conversations/${conversationId}/read`)
    .then(() => window.dispatchEvent(new Event(UNREAD_CHANGED)))
    .catch(() => {});
}

function EmptyState({ title, children, action }) {
  return (
    <Empty variant="card">
      <EmptyHeader>
        <EmptyMedia variant="brand">
          <MessageCircle />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{children}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}

// Mensagens novas chegam em tempo real pelo canal pessoal do usuário (Reverb).
// Sem o Reverb no ar, a tela continua funcionando e atualiza ao recarregar.
export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedId = Number(searchParams.get("conversation")) || null;

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(requestedId);
  const [chatOpen, setChatOpen] = useState(Boolean(requestedId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const active = conversations.find((item) => item.id === activeId);

  const conversationsRef = useRef(conversations);
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    conversationsRef.current = conversations;
    activeIdRef.current = activeId;
  });

  // Conversa que ainda não está na lista (alguém acabou de escrever pela
  // primeira vez) é buscada na API antes de entrar no topo.
  useEffect(() => {
    if (!user) return;
    const channelName = `App.Models.User.${user.id}`;

    const channel = echo.private(channelName);
    // A mensagem também chega para quem enviou (outras abas abertas): essa não
    // conta como não lida nem gera aviso de leitura.
    const handleMessage = async ({ conversation_id, message: raw }) => {
      const message = toChatMessage({
        ...raw,
        is_mine: raw.sender_id === user.id,
      });
      const fromOther = message.from !== "me";
      const isActive = conversation_id === activeIdRef.current;
      let fallback = conversationsRef.current.find(
        (item) => item.id === conversation_id,
      );

      if (!fallback) {
        const { data } = await api.get(`/api/conversations/${conversation_id}`);
        fallback = toChatConversation(data.data);
      }
      if (isActive && fromOther) sendReadReceipt(conversation_id);

      setConversations((current) => {
        const target =
          current.find((item) => item.id === conversation_id) ?? fallback;
        if (target.messages.some((item) => item.id === message.id)) {
          return current;
        }

        return [
          {
            ...target,
            time: message.time,
            lastMessage: message,
            messages: target.loaded
              ? [...target.messages, message]
              : target.messages,
            unread: isActive || !fromOther ? target.unread : target.unread + 1,
          },
          ...current.filter((item) => item.id !== conversation_id),
        ];
      });
    };

    // A outra pessoa leu: minhas mensagens passam de "Enviada" para "Lida".
    const handleRead = ({ conversation_id }) => {
      setConversations((current) =>
        current.map((item) =>
          item.id === conversation_id
            ? {
                ...item,
                messages: item.messages.map((message) =>
                  message.from === "me" ? { ...message, read: true } : message,
                ),
              }
            : item,
        ),
      );
    };

    // A outra pessoa bloqueou ou desbloqueou: a API diz se ainda dá para enviar.
    const handleUpdated = async ({ conversation_id }) => {
      if (
        !conversationsRef.current.some((item) => item.id === conversation_id)
      ) {
        return;
      }
      const { data } = await api.get(`/api/conversations/${conversation_id}`);
      const { canSend, status, blockedByMe } = toChatConversation(data.data);
      setConversations((current) =>
        current.map((item) =>
          item.id === conversation_id
            ? { ...item, canSend, status, blockedByMe }
            : item,
        ),
      );
    };

    channel.listen(".message.sent", handleMessage);
    channel.listen(".messages.read", handleRead);
    channel.listen(".conversation.updated", handleUpdated);

    return () => {
      channel.stopListening(".message.sent", handleMessage);
      channel.stopListening(".messages.read", handleRead);
      channel.stopListening(".conversation.updated", handleUpdated);
    };
  }, [user]);

  // A conversa recém-aberta pelo anúncio ainda não tem mensagem, então não vem
  // na lista: busca ela à parte e coloca no topo.
  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data } = await api.get("/api/conversations");
      let list = data.data.map(toChatConversation);

      if (requestedId && !list.some((item) => item.id === requestedId)) {
        const { data: opened } = await api.get(
          `/api/conversations/${requestedId}`,
        );
        list = [toChatConversation(opened.data), ...list];
      }

      if (ignore) return;
      setConversations(list);
      setActiveId((current) => current ?? list[0]?.id ?? null);
    }

    load()
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [requestedId, attempt]);

  const activeLoaded = active?.loaded;

  useEffect(() => {
    if (!activeId || loading || activeLoaded) return;
    let ignore = false;

    api
      .get(`/api/conversations/${activeId}/messages`)
      .then(({ data }) => {
        if (ignore) return;
        updateConversation(activeId, () => ({
          loaded: true,
          unread: 0,
          messages: data.data.map(toChatMessage).reverse(),
          nextCursor: data.meta.next_cursor,
        }));
        sendReadReceipt(activeId);
      })
      .catch(
        () => !ignore && toast.error("Não foi possível carregar as mensagens."),
      );

    return () => {
      ignore = true;
    };
  }, [activeId, loading, activeLoaded]);

  function updateConversation(id, change) {
    setConversations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...change(item) } : item,
      ),
    );
  }

  function markAsRead(id) {
    updateConversation(id, () => ({ unread: 0 }));
    sendReadReceipt(id);
  }

  // Conversa já carregada não passa de novo pelo efeito de carga, então as
  // mensagens que chegaram enquanto ela estava fechada são marcadas aqui.
  function handleSelect(id) {
    const selected = conversations.find((item) => item.id === id);
    if (selected?.loaded && selected.unread > 0) markAsRead(id);
    setActiveId(id);
    setChatOpen(true);
  }

  async function handleLoadOlder() {
    const id = activeId;
    const { data } = await api.get(`/api/conversations/${id}/messages`, {
      params: { cursor: active.nextCursor },
    });
    updateConversation(id, (item) => ({
      messages: [...data.data.map(toChatMessage).reverse(), ...item.messages],
      nextCursor: data.meta.next_cursor,
    }));
  }

  // Depois de bloquear ou desbloquear, can_send vem da API: um anúncio
  // cancelado continua só para leitura mesmo sem bloqueio.
  async function handleBlockChange(blocked) {
    const id = activeId;

    try {
      await api[blocked ? "post" : "delete"](`/api/conversations/${id}/block`);
      const { data } = await api.get(`/api/conversations/${id}`);
      const { canSend, status, blockedByMe } = toChatConversation(data.data);
      updateConversation(id, () => ({ canSend, status, blockedByMe }));
      toast.success(blocked ? "Conversa bloqueada." : "Conversa desbloqueada.");
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message ?? "Não foi possível concluir a ação.",
      );
      return false;
    }
  }

  // Quem enviou por último sobe para o topo da lista.
  async function handleSend(text) {
    const id = activeId;

    try {
      const { data } = await api.post(`/api/conversations/${id}/messages`, {
        body: text,
      });
      const message = toChatMessage(data.data);

      setConversations((current) => {
        const sent = current.find((item) => item.id === id);
        if (sent.messages.some((item) => item.id === message.id)) {
          return current;
        }
        const others = current.filter((item) => item.id !== id);
        return [
          {
            ...sent,
            time: message.time,
            lastMessage: message,
            messages: [...sent.messages, message],
          },
          ...others,
        ];
      });
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message ?? "Não foi possível enviar a mensagem.",
      );
      return false;
    }
  }

  if (loading) {
    return <MessagesSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        title="Não foi possível carregar as conversas"
        action={
          <Button
            onClick={() => {
              setError(false);
              setLoading(true);
              setAttempt((current) => current + 1);
            }}
          >
            Tentar novamente
          </Button>
        }
      >
        Verifique sua conexão e tente de novo.
      </EmptyState>
    );
  }

  if (!active) {
    return (
      <EmptyState
        title="Nenhuma conversa ainda"
        action={
          <Button asChild>
            <Link to="/adoptions">Ver pets para adoção</Link>
          </Button>
        }
      >
        Quando você falar com alguém sobre um anúncio, a conversa aparece aqui.
      </EmptyState>
    );
  }

  return (
    <div className="flex h-[calc(100svh-9.5rem)] min-h-112 w-full overflow-hidden rounded-2xl bg-card shadow-xs">
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelect}
        className={cn(
          "w-full md:flex md:w-80 md:shrink-0 md:border-r md:border-border/60 lg:w-96",
          chatOpen ? "hidden" : "flex",
        )}
      />
      <ChatPanel
        key={active.id}
        conversation={active}
        onBack={() => setChatOpen(false)}
        onSend={handleSend}
        onLoadOlder={active.nextCursor ? handleLoadOlder : null}
        onBlockChange={handleBlockChange}
        className={cn("flex-1 md:flex", chatOpen ? "flex" : "hidden")}
      />
    </div>
  );
}
