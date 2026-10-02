import { useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailNotice() {
  const [sending, setSending] = useState(false);

  async function handleResend() {
    setSending(true);

    try {
      const { data } = await api.post("/api/email/verification-notification");
      toast.success(data.status);
    } catch {
      toast.error("Erro ao reenviar e-mail.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center shadow-xs sm:p-10">
      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-warning">
        <MailCheck className="size-6" />
      </span>
      <h1 className="text-2xl leading-8">Confirme seu e-mail</h1>
      <p className="text-muted-foreground">
        Enviamos um link de verificação. Confirme seu e-mail para continuar.
      </p>

      <Button
        type="button"
        onClick={handleResend}
        disabled={sending}
        size="field"
        className="w-full"
      >
        {sending ? "Reenviando" : "Reenviar e-mail de verificação"}
        {sending && <Spinner />}
      </Button>
    </div>
  );
}
