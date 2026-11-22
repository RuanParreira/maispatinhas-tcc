import Echo from "laravel-echo";
import Pusher from "pusher-js";
import api from "@/api/axios";

window.Pusher = Pusher;

const env = import.meta.env;

// O canal privado é autorizado pelo axios da API, que já manda o cookie e o
// XSRF do Sanctum; o authorizer padrão do Echo não mandaria.
export const echo = new Echo({
  broadcaster: "reverb",
  key: env.VITE_REVERB_APP_KEY ?? "maispatinhas-key",
  wsHost: env.VITE_REVERB_HOST ?? "localhost",
  wsPort: Number(env.VITE_REVERB_PORT ?? 8090),
  wssPort: Number(env.VITE_REVERB_PORT ?? 8090),
  forceTLS: (env.VITE_REVERB_SCHEME ?? "http") === "https",
  enabledTransports: ["ws", "wss"],
  authorizer: (channel) => ({
    authorize: (socketId, callback) => {
      api
        .post("/api/broadcasting/auth", {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then(({ data }) => callback(null, data))
        .catch((error) => callback(error));
    },
  }),
});
