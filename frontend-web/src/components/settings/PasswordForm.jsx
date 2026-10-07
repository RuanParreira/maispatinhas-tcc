import { useState } from "react";
import { toast } from "sonner";
import api from "@/api/axios";
import { PasswordField } from "@/components/form/IconField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  SettingsBody,
  SettingsFooter,
} from "@/components/settings/SettingsCard";

const emptyForm = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function PasswordForm() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) =>
      setForm((current) => ({ ...current, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await api.put("/api/user/password", form);
      setForm(emptyForm);
      toast.success("Senha alterada. Outros dispositivos foram desconectados.");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? {});
      if (!err.response?.data?.errors) toast.error("Erro ao alterar senha.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <SettingsBody>
        <PasswordField
          id="current_password"
          label="Senha atual"
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.current_password}
          onChange={update("current_password")}
          error={errors.current_password?.[0]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            id="password"
            label="Nova senha"
            autoComplete="new-password"
            placeholder="••••••••"
            showStrength
            value={form.password}
            onChange={update("password")}
            error={errors.password?.[0]}
          />
          <PasswordField
            id="password_confirmation"
            label="Confirmar nova senha"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={update("password_confirmation")}
          />
        </div>
      </SettingsBody>
      <SettingsFooter hint="Outros dispositivos serão desconectados.">
        <Button type="submit" disabled={submitting} size="md">
          {submitting && <Spinner />}
          {submitting ? "Salvando" : "Alterar senha"}
        </Button>
      </SettingsFooter>
    </form>
  );
}
