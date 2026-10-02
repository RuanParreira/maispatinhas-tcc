import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import AuthShell from "@/components/auth/AuthShell";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import loginImage from "@/assets/auth/login.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const { data } = await api.post("/api/forgot-password", { email });
      toast.success(data.status);
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao enviar link."] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperar acesso"
      title="Esqueceu sua senha?"
      description="Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha."
      image={loginImage}
      testimonial={{
        quote:
          "Adotar transformou meu lar. Cada dia é repleto de afeto, calma e reciprocidade sincera.",
        author: "Família Silva & Caramelo",
        detail: "Adoção em 2023",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          id="email"
          label="E-mail"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email?.[0]}
        />

        <Button
          type="submit"
          disabled={submitting}
          size="field"
          className="mt-1 w-full"
        >
          {submitting ? "Enviando" : "Enviar link de redefinição"}
          {submitting ? (
            <Spinner />
          ) : (
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          )}
        </Button>
      </form>

      <p className="text-center text-muted-foreground">
        Lembrou a senha?{" "}
        <Link
          to="/login"
          className="text-sm font-semibold text-warning underline decoration-warning/30 underline-offset-2 hover:decoration-warning"
        >
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
