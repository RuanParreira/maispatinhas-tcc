import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { useChatEvents, useReadReceipts } from "@/hooks/useChatEvents";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  accessOf,
  fetchConversation,
  toChatConversation,
  toChatMessage,
  updateById,
  withNewMessage,
} from "@/lib/conversations";
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

/**
 * Lista de conversas à esquerda e chat à direita; no celular aparece um de cada
 * vez, então a conversa ativa só está à vista depois que a pessoa abre o chat.
 * A conversa aberta pelo botão do anúncio ainda não tem mensagem e não vem na
 * lista: é buscada à parte e entra no topo. Link antigo ou de outra pessoa (404)
 * não derruba a lista. O tempo real (Reverb) fica em useChatEvents; sem ele a
 * tela continua funcionando e atualiza ao recarregar.
 */
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

  const isMobile = useIsMobile();
  const active = conversations.find((item) => item.id === activeId);

  useChatEvents(user?.id, conversations, setConversations);
  useReadReceipts(active, !isMobile || chatOpen, setConversations);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const { data } = await api.get("/api/conversations");
      let list = data.data.map(toChatConversation);

      if (requestedId && !list.some((item) => item.id === requestedId)) {
        const opened = await fetchConversation(requestedId).catch(() => null);
        if (opened) list = [opened, ...list];
      }

      if (ignore) return;
      setConversations(list);
      setActiveId((current) =>
        list.some((item) => item.id === current)
          ? current
          : (list[0]?.id ?? null),
      );
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
          messages: data.data.map(toChatMessage).reverse(),
          nextCursor: data.meta.next_cursor,
        }));
      })
      .catch(
        () => !ignore && toast.error("Não foi possível carregar as mensagens."),
      );

    return () => {
      ignore = true;
    };
  }, [activeId, loading, activeLoaded]);

  function updateConversation(id, change) {
    setConversations((current) => updateById(current, id, change));
  }

  function handleSelect(id) {
    setActiveId(id);
    setChatOpen(true);
  }

  async function handleLoadOlder() {
    const id = activeId;
    const response = await api
      .get(`/api/conversations/${id}/messages`, {
        params: { cursor: active.nextCursor },
      })
      .catch(() => null);
    if (!response) {
      toast.error("Não foi possível carregar as mensagens anteriores.");
      return;
    }
    const { data } = response;
    updateConversation(id, (item) => ({
      messages: [...data.data.map(toChatMessage).reverse(), ...item.messages],
      nextCursor: data.meta.next_cursor,
    }));
  }

  async function handleBlockChange(blocked) {
    const id = activeId;

    try {
      await api[blocked ? "post" : "delete"](`/api/conversations/${id}/block`);
      const conversation = await fetchConversation(id);
      updateConversation(id, () => accessOf(conversation));
      toast.success(blocked ? "Conversa bloqueada." : "Conversa desbloqueada.");
      return true;
    } catch (err) {
      toast.error(
        err.response?.data?.message ?? "Não foi possível concluir a ação.",
      );
      return false;
    }
  }

  async function handleSend(text) {
    const id = activeId;

    try {
      const { data } = await api.post(`/api/conversations/${id}/messages`, {
        body: text,
      });
      const message = toChatMessage(data.data);

      setConversations((current) => withNewMessage(current, id, message));
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
