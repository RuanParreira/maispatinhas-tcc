import { useState } from "react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import AuthShell from "@/components/auth/AuthShell";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import loginImage from "@/assets/auth/login.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await api.get("/sanctum/csrf-cookie");
      const { data } = await api.post("/api/login", {
        email,
        password,
        remember,
      });
      login(data);
      navigate("/adoptions");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao entrar."] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Bem-vindo de volta"
      title="Que bom ter você de volta."
      description="Acesse sua conta para gerenciar anúncios, acompanhar adoções ou reencontrar seu companheiro."
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

        <PasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password?.[0]}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Label className="cursor-pointer text-[0.8125rem] font-normal text-muted-foreground">
            <Checkbox
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className="cursor-pointer"
            />
            Manter conectado
          </Label>
          <Link
            to="/forgot-password"
            className="text-[0.8125rem] font-medium text-warning underline decoration-warning/30 underline-offset-2 hover:decoration-warning"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          size="field"
          className="mt-1 w-full"
        >
          {submitting ? "Entrando" : "Entrar na minha conta"}
          {submitting ? (
            <Spinner />
          ) : (
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-muted-foreground">
          Ainda não faz parte da rede?{" "}
          <Link
            to="/register"
            className="text-sm font-semibold text-warning underline decoration-warning/30 underline-offset-2 hover:decoration-warning"
          >
            Cadastre-se gratuitamente
          </Link>
        </p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
          <ShieldCheck className="size-3.5 shrink-0" />
          Seus dados e sua privacidade estão protegidos.
        </p>
      </div>
    </AuthShell>
  );
}
