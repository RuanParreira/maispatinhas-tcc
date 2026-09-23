import { useState } from "react";
import api from "@/api/axios";

export default function VerifyEmailNotice() {
  const [status, setStatus] = useState("");

  async function handleResend() {
    setStatus("");

    try {
      const { data } = await api.post("/api/email/verification-notification");
      setStatus(data.status);
    } catch {
      setStatus("Erro ao reenviar e-mail.");
    }
  }

  return (
    <div>
      <p>Confirme seu e-mail para continuar. Enviamos um link de verificação.</p>

      <button type="button" onClick={handleResend}>
        Reenviar e-mail de verificação
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
