import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const [status, setStatus] = useState("Verificando...");
  const [needsLogin, setNeedsLogin] = useState(false);
  const requested = useRef(false);

  useEffect(() => {
    if (!url || requested.current) {
      return;
    }
    requested.current = true;

    api
      .get(decodeURIComponent(url))
      .then(({ data }) => setStatus(data.status))
      .catch((err) => {
        if (err.response?.status === 401) {
          setNeedsLogin(true);
          setStatus("Você precisa estar logado para confirmar o e-mail.");
        } else {
          setStatus("Não foi possível confirmar o e-mail. O link pode ter expirado.");
        }
      });
  }, [url]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-card p-6 text-center shadow-xs sm:p-10">
        <h1 className="text-2xl leading-8">Verificação de e-mail</h1>
        <p role="status" className="text-muted-foreground">
          {url ? status : "Link de verificação inválido."}
        </p>
        {needsLogin && (
          <>
            <p className="text-[0.8125rem] text-muted-foreground">
              Depois de entrar, clique de novo no link do e-mail.
            </p>
            <Button
              asChild
              size="field"
              className="w-full"
            >
              <Link to="/login">Fazer login</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
