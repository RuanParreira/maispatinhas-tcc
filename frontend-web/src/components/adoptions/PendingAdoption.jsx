import { useState } from "react";
import { PawPrint } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import PersonLink from "@/components/profile/PersonLink";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * Indicação do "Doei" aguardando o adotante: confirmar conclui a adoção e
 * resolve o anúncio; negar devolve a escolha ao doador. Usado no modal e na página.
 */
export default function PendingAdoption({ adoption, onAnswered, children }) {
  const [answering, setAnswering] = useState(null);
  const petName = adoption.pet.name ?? "este pet";

  function answer(adopted) {
    const url = `/api/my-adoptions/${adoption.id}/confirmation`;
    setAnswering(adopted ? "yes" : "no");
    (adopted ? api.post(url) : api.delete(url))
      .then(() => {
        toast.success(
          adopted
            ? `Adoção confirmada! Boas-vindas, ${petName}.`
            : "Tudo certo. Avisamos o doador.",
        );
        onAnswered(adoption, adopted);
      })
      .catch((error) =>
        toast.error(
          error.response?.data?.message ??
            "Não foi possível enviar sua resposta. Tente novamente.",
        ),
      )
      .finally(() => setAnswering(null));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        {adoption.pet.cover_url ? (
          <img
            src={adoption.pet.cover_url}
            alt={adoption.pet.name ?? "Pet"}
            className="size-20 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground/40">
            <PawPrint aria-hidden="true" className="size-8" />
          </div>
        )}
        <div className="min-w-0 text-sm leading-5 text-muted-foreground">
          <p className="truncate text-lg leading-7 text-foreground">
            {adoption.pet.name ?? "Pet sem nome"}
          </p>
          <p>
            <PersonLink person={adoption.donor} /> indicou você como quem
            adotou. Confirme só se o pet já está com você.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {children}
        <Button
          variant="outline"
          size="md"
          disabled={answering !== null}
          onClick={() => answer(false)}
        >
          {answering === "no" && <Spinner />}
          Não adotei
        </Button>
        <Button
          size="md"
          disabled={answering !== null}
          onClick={() => answer(true)}
        >
          {answering === "yes" && <Spinner />}
          Sim, adotei
        </Button>
      </div>
    </div>
  );
}
