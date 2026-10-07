import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { PasswordField } from "@/components/form/IconField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

const consequences = [
  "Nome, e-mail, telefone e bio são apagados.",
  "Anúncios abertos são cancelados.",
  "Adoções em andamento são canceladas.",
  "Conversas são arquivadas e favoritos removidos.",
];

export default function DeleteAccountDialog() {
  const { clearUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleOpenChange(next) {
    setOpen(next);
    if (!next) {
      setPassword("");
      setError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.delete("/api/user", { data: { current_password: password } });
      clearUser();
      toast.success("Sua conta foi excluída.");
      navigate("/home", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.errors?.current_password?.[0] ??
          "Erro ao excluir conta.",
      );
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="md">
          Excluir conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Excluir sua conta?</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <ul className="flex flex-col gap-1.5 rounded-xl bg-destructive/10 p-4 text-sm">
            {consequences.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-destructive">
                  •
                </span>
                {item}
              </li>
            ))}
          </ul>
          <PasswordField
            id="delete_current_password"
            label="Confirme sua senha"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitting || !password}
              size="md"
            >
              {submitting && <Spinner />}
              Excluir definitivamente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
