import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    try {
      await api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      navigate("/login");
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao redefinir senha."] });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">Nova senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p>{errors.password[0]}</p>}
      </div>

      <div>
        <label htmlFor="password_confirmation">Confirmar nova senha</label>
        <input
          id="password_confirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
      </div>

      {errors.email && <p>{errors.email[0]}</p>}

      <button type="submit">Redefinir senha</button>
    </form>
  );
}
