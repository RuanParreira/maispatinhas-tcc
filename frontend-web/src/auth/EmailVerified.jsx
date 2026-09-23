import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "@/api/axios";

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
    <div>
      <p>{url ? status : "Link de verificação inválido."}</p>
      {needsLogin && (
        <p>
          <Link to="/login">Fazer login</Link> e clicar no link do e-mail de novo.
        </p>
      )}
    </div>
  );
}
