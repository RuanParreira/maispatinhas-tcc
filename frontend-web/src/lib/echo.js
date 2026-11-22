import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "@/api/axios";

window.Pusher = Pusher;

const env = import.meta.env;

/**
 * Autoriza o canal privado pelo axios da API, que já manda o cookie e o XSRF
 * do Sanctum; o authorizer padrão do Echo não mandaria.
 */
function authorizer(channel) {
  return {
    authorize: (socketId, callback) => {
      api
        .post("/api/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then(({ data }) => callback(null, data))
        .catch((error) => callback(error));
    },
  };
}

export const echo = new Echo({
  broadcaster: "reverb",
  key: env.VITE_REVERB_APP_KEY ?? "maispatinhas-key",
  wsHost: env.VITE_REVERB_HOST ?? "localhost",
  wsPort: Number(env.VITE_REVERB_PORT ?? 8090),
  wssPort: Number(env.VITE_REVERB_PORT ?? 8090),
  forceTLS: (env.VITE_REVERB_SCHEME ?? "http") === "https",
  enabledTransports: ["ws", "wss"],
  authorizer,
});

/**
 * Canal pessoal do usuário: mensagens novas, leituras e bloqueios de todas as
 * conversas dele chegam por aqui (routes/channels.php).
 */
export function userChannel(userId) {
  return `App.Models.User.${userId}`;
}
