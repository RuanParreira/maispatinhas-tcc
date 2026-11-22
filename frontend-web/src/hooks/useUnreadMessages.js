import { useEffect, useState } from "react";
import api from "@/api/axios";
import { echo } from "@/lib/echo";

// Disparado pela tela de mensagens depois de marcar uma conversa como lida.
export const UNREAD_CHANGED = "messages:unread-changed";

/**
 * Número de mensagens não lidas do menu. Recarrega ao chegar mensagem nova
 * (Reverb) e quando a tela de mensagens marca algo como lido.
 */
export function useUnreadMessages(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    function refresh() {
      api
        .get("/api/conversations/unread-count")
        .then(({ data }) => setCount(data.count))
        .catch(() => {});
    }

    refresh();
    channel.listen(".message.sent", refresh);
    window.addEventListener(UNREAD_CHANGED, refresh);

    return () => {
      channel.stopListening(".message.sent", refresh);
      window.removeEventListener(UNREAD_CHANGED, refresh);
      echo.leave(channelName);
    };
  }, [userId]);

  return count;
}
