import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { toChatConversation, toChatMessage } from "@/lib/conversations";
import { cn } from "@/lib/utils";
import ChatPanel from "@/components/messages/ChatPanel";
import ConversationList from "@/components/messages/ConversationList";
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

// A mensagem só chega à outra pessoa quando ela recarrega ou troca de conversa;
// o tempo real (Reverb) entra na etapa seguinte.
export default function Messages() {
  const [searchParams] = useSearchParams();
  const requestedId = Number(searchParams.get("conversation")) || null;

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(requestedId);
  const [chatOpen, setChatOpen] = useState(Boolean(requestedId));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const active = conversations.find((item) => item.id === activeId);

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
          messages: data.data.map(toChatMessage).reverse(),
          nextCursor: data.meta.next_cursor,
        }));
        return api.put(`/api/conversations/${activeId}/read`);
      })
      .then(
        () => !ignore && updateConversation(activeId, () => ({ unread: 0 })),
      )
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

  function handleSelect(id) {
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
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Carregando conversas...
      </p>
    );
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
        className={cn("flex-1 md:flex", chatOpen ? "flex" : "hidden")}
      />
    </div>
  );
}
