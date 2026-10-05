import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { IconField, PasswordField } from "@/components/form/IconField";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  SettingsBody,
  SettingsFooter,
} from "@/components/settings/SettingsCard";

export default function EmailForm() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const { data } = await api.put("/api/user/email", {
        email,
        current_password: currentPassword,
      });
      updateUser(data);
      setEmail("");
      setCurrentPassword("");
      toast.success(
        "E-mail alterado. Confirme pelo link enviado ao novo endereço.",
      );
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {});
      if (!err.response?.data?.errors) toast.error("Erro ao alterar e-mail.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <SettingsBody>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">E-mail atual</p>
            <p className="truncate font-medium">{user?.email}</p>
          </div>
          {user?.email_verified_at ? (
            <Badge variant="success">Verificado</Badge>
          ) : (
            <Badge variant="warning">Não verificado</Badge>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <IconField
            id="email"
            label="Novo e-mail"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email?.[0]}
          />
          <PasswordField
            id="email_current_password"
            label="Senha atual"
            autoComplete="current-password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.current_password?.[0]}
          />
        </div>
      </SettingsBody>
      <SettingsFooter hint="Enviaremos um link de confirmação ao novo endereço.">
        <Button type="submit" disabled={submitting} className="h-10 px-4">
          {submitting && <Spinner />}
          {submitting ? "Salvando" : "Alterar e-mail"}
        </Button>
      </SettingsFooter>
    </form>
  );
}
