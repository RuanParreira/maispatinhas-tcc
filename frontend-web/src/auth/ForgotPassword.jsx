import { useState } from "react";
import api from "@/api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setStatus("");

    try {
      const { data } = await api.post("/api/forgot-password", { email });
      setStatus(data.status);
    } catch (err) {
      setErrors(err.response?.data?.errors ?? { email: ["Erro ao enviar link."] });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p>{errors.email[0]}</p>}
      </div>

      {status && <p>{status}</p>}

      <button type="submit">Enviar link de redefinição</button>
    </form>
  );
}
