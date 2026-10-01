import { useEffect, useState } from "react";
import { ArrowRight, Mail, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import AuthShell from "@/components/auth/AuthShell";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import CityCombobox from "@/components/auth/CityCombobox";
import { formatPhone } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import registerImage from "@/assets/auth/register.jpg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [municipalityId, setMunicipalityId] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    api.get("/api/municipalities").then((res) => setMunicipalities(res.data));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      await api.get("/sanctum/csrf-cookie");
      const { data } = await api.post("/api/register", {
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
        municipality_id: municipalityId,
      });
      login(data);
      navigate("/adoptions");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao registrar."] });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Faça parte da rede"
      title="Crie sua conta no Mais Patinhas."
      description="Cadastre-se para adotar, anunciar um pet ou ajudar alguém a reencontrar seu companheiro."
      image={registerImage}
      showImpact
      testimonial={{
        quote:
          "Encontrei a Mia por aqui em poucos dias. Hoje a casa não é a mesma sem ela.",
        author: "Marina & Mia",
        detail: "Juntas desde 2024",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          id="name"
          label="Nome completo"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="ex: Clara Mendes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField
            id="email"
            label="E-mail"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email?.[0]}
          />

          <AuthField
            id="phone"
            label="Telefone"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(16) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            error={errors.phone?.[0]}
          />
        </div>

        <CityCombobox
          id="municipality_id"
          label="Cidade / Estado"
          error={errors.municipality_id?.[0]}
          municipalities={municipalities}
          value={municipalityId}
          onChange={setMunicipalityId}
        />

        <PasswordField
          id="password"
          label="Senha"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password?.[0]}
          showStrength
        />

        <PasswordField
          id="password_confirmation"
          label="Confirmar senha"
          autoComplete="new-password"
          placeholder="Repita a senha"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <Button
          type="submit"
          disabled={submitting}
          className="mt-1 h-12 w-full gap-2 rounded-xl text-base font-semibold shadow-xs"
        >
          {submitting ? "Criando conta..." : "Criar minha conta"}
          <ArrowRight />
        </Button>
      </form>

      <p className="text-center text-muted-foreground">
        Já faz parte da rede?{" "}
        <Link
          to="/login"
          className="text-sm font-semibold text-warning underline decoration-warning/30 underline-offset-2 hover:decoration-warning"
        >
          Entrar na minha conta
        </Link>
      </p>
    </AuthShell>
  );
}
