import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

function errorMessage(err, fallback) {
  if (err.response?.status === 429) {
    return "Muitas tentativas. Aguarde um minuto e tente de novo.";
  }
  return err.response?.data?.errors?.avatar?.[0] ?? fallback;
}

// A foto é salva assim que escolhida, sem depender do botão "Salvar" do formulário.
// As checagens aqui só poupam um envio inútil: quem valida de verdade é a API.
export default function AvatarField({ name, avatarUrl, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  async function handleFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setBusy(true);

    const form = new FormData();
    form.append("avatar", file);

    try {
      const { data } = await api.post("/api/user/avatar", form);
      onChange(data.avatar_url);
      toast.success("Foto atualizada.");
    } catch (err) {
      setError(errorMessage(err, "Não foi possível enviar a foto."));
    } finally {
      setPreview(null);
      setBusy(false);
    }
  }

  async function handleRemove() {
    setError(null);
    setBusy(true);

    try {
      await api.delete("/api/user/avatar");
      onChange(null);
      toast.success("Foto removida.");
    } catch (err) {
      setError(errorMessage(err, "Não foi possível remover a foto."));
    } finally {
      setBusy(false);
    }
  }

  const src = preview ?? avatarUrl;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-20">
          {src && <AvatarImage src={src} alt="Sua foto de perfil" />}
          <AvatarFallback className="bg-primary text-2xl font-semibold text-primary-foreground">
            {initialsOf(name)}
          </AvatarFallback>
        </Avatar>
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
            <Spinner />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3"
            disabled={busy}
            onClick={() => inputRef.current.click()}
          >
            <Camera />
            {avatarUrl ? "Trocar foto" : "Adicionar foto"}
          </Button>
          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              className="h-9 px-3"
              disabled={busy}
              onClick={handleRemove}
            >
              <Trash2 />
              Remover
            </Button>
          )}
        </div>
        <p
          className={
            error ? "text-xs text-destructive" : "text-xs text-muted-foreground"
          }
        >
          {error ?? "JPG, PNG ou WebP, até 5 MB."}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
