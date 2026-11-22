import { useEffect, useRef, useSyncExternalStore } from "react";
import api from "@/api/axios";
import { UNREAD_CHANGED } from "@/hooks/useUnreadMessages";
import {
  accessOf,
  fetchConversation,
  toChatMessage,
  updateById,
  withNewMessage,
} from "@/lib/conversations";
import { echo, userChannel } from "@/lib/echo";

function subscribeToPageVisibility(onChange) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Mantém a lista em dia com o canal pessoal do usuário (Reverb):
 * - mensagem nova sobe a conversa para o topo; a que chega de outra aba de quem
 *   enviou não conta como não lida; conversa que ainda não está na lista (alguém
 *   escreveu pela primeira vez) é buscada na API;
 * - leitura da outra pessoa troca "Enviada" por "Lida" nas mensagens criadas até
 *   o momento da leitura (uma enviada logo depois continua "Enviada");
 * - bloqueio ou desbloqueio da outra pessoa atualiza se ainda dá para enviar.
 */
export function useChatEvents(userId, conversations, setConversations) {
  const conversationsRef = useRef(conversations);
  useEffect(() => {
    conversationsRef.current = conversations;
  });

  useEffect(() => {
    if (!userId) return;
    const channel = echo.private(userChannel(userId));

    async function handleMessage({ conversation_id, message: raw }) {
      const message = toChatMessage({
        ...raw,
        is_mine: raw.sender_id === userId,
      });
      let fallback = conversationsRef.current.find(
        (item) => item.id === conversation_id,
      );
      if (!fallback) {
        fallback = await fetchConversation(conversation_id).catch(() => null);
        if (!fallback) return;
      }

      setConversations((current) =>
        withNewMessage(current, conversation_id, message, fallback),
      );
    }

    function handleRead({ conversation_id, read_at }) {
      const readAt = Date.parse(read_at);
      setConversations((current) =>
        updateById(current, conversation_id, (item) => ({
          messages: item.messages.map((message) =>
            message.from === "me" && Date.parse(message.createdAt) <= readAt
              ? { ...message, read: true }
              : message,
          ),
        })),
      );
    }

    async function handleUpdated({ conversation_id }) {
      if (
        !conversationsRef.current.some((item) => item.id === conversation_id)
      ) {
        return;
      }
      const conversation = await fetchConversation(conversation_id).catch(
        () => null,
      );
      if (conversation) {
        setConversations((current) =>
          updateById(current, conversation_id, () => accessOf(conversation)),
        );
      }
    }

    channel.listen(".message.sent", handleMessage);
    channel.listen(".messages.read", handleRead);
    channel.listen(".conversation.updated", handleUpdated);

    return () => {
      channel.stopListening(".message.sent", handleMessage);
      channel.stopListening(".messages.read", handleRead);
      channel.stopListening(".conversation.updated", handleUpdated);
    };
  }, [userId, setConversations]);
}

/**
 * Marca como lida só quando a pessoa está olhando: chat à vista (no celular,
 * depois de abrir a conversa) e aba do navegador ativa. Vale para a conversa
 * recém-aberta e para mensagens que chegam nela. Desconta só o que foi lido: o
 * que chegar durante o PUT dispara outra leitura. O contador do menu recarrega
 * depois que a API confirma.
 */
export function useReadReceipts(active, chatVisible, setConversations) {
  const pageVisible = useSyncExternalStore(
    subscribeToPageVisibility,
    () => document.visibilityState === "visible",
  );
  const inView = active?.loaded && chatVisible && pageVisible;
  const unreadInView = inView ? active.unread : 0;
  const viewedId = inView ? active.id : null;

  useEffect(() => {
    if (!viewedId || unreadInView === 0) return;
    api
      .put(`/api/conversations/${viewedId}/read`)
      .then(() => {
        window.dispatchEvent(new Event(UNREAD_CHANGED));
        setConversations((current) =>
          updateById(current, viewedId, (item) => ({
            unread: Math.max(0, item.unread - unreadInView),
          })),
        );
      })
      .catch(() => {});
  }, [viewedId, unreadInView, setConversations]);
}
