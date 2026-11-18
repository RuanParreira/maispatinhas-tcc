import { useState } from "react";
import { toast } from "sonner";
import api from "@/api/axios";

// Marca na hora e desfaz se a API falhar, para o coração não esperar a rede.
export function useFavorite(postId, initial, onChange) {
  const [favorite, setFavorite] = useState(Boolean(initial));
  const [pending, setPending] = useState(false);

  function toggle() {
    const next = !favorite;
    setFavorite(next);
    setPending(true);
    const request = next
      ? api.put(`/api/posts/${postId}/favorite`)
      : api.delete(`/api/posts/${postId}/favorite`);
    request
      .then(() => {
        toast.success(
          next ? "Adicionado aos favoritos." : "Removido dos favoritos.",
        );
        onChange?.(next);
      })
      .catch(() => {
        setFavorite(!next);
        toast.error("Não foi possível atualizar os favoritos.");
      })
      .finally(() => setPending(false));
  }

  return { favorite, pending, toggle };
}
