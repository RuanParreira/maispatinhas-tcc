import { useEffect, useState } from "react";
import api from "@/api/axios";
import { echo, userChannel } from "@/lib/echo";

export const UNREAD_CHANGED = "messages:unread-changed";

/**
 * Número de mensagens não lidas do menu. Recarrega ao chegar mensagem nova de
 * outra pessoa (Reverb) e quando a tela de mensagens dispara UNREAD_CHANGED,
 * depois de marcar uma conversa como lida.
 */
export function useUnreadMessages(userId) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const channelName = userChannel(userId);
    const channel = echo.private(channelName);

    function refresh() {
      api
        .get("/api/conversations/unread-count")
        .then(({ data }) => setCount(data.count))
        .catch(() => {});
    }

    function handleMessage({ message }) {
      if (message.sender_id !== userId) refresh();
    }

    refresh();
    channel.listen(".message.sent", handleMessage);
    window.addEventListener(UNREAD_CHANGED, refresh);

    return () => {
      channel.stopListening(".message.sent", handleMessage);
      window.removeEventListener(UNREAD_CHANGED, refresh);
      echo.leave(channelName);
    };
  }, [userId]);

  return count;
}
