import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import AuthShell from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import loginImage from "@/assets/auth/login.jpg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("Senha redefinida. Entre com a nova senha.");
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao redefinir senha."] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Nova senha"
      title="Crie uma nova senha."
      description="Escolha uma senha forte para proteger sua conta."
      image={loginImage}
      testimonial={{
        quote:
          "Adotar transformou meu lar. Cada dia é repleto de afeto, calma e reciprocidade sincera.",
        author: "Família Silva & Caramelo",
        detail: "Adoção em 2023",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordField
          id="password"
          label="Nova senha"
          autoComplete="new-password"
          placeholder="••••••••"
          showStrength
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password?.[0]}
        />

        <PasswordField
          id="password_confirmation"
          label="Confirmar nova senha"
          autoComplete="new-password"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        {errors.email && (
          <p role="alert" className="text-xs text-destructive">
            {errors.email[0]}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitting}
          size="field"
          className="mt-1 w-full"
        >
          {submitting ? "Salvando" : "Redefinir senha"}
          {submitting ? (
            <Spinner />
          ) : (
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
