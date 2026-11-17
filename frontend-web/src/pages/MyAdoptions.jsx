import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import api from "@/api/axios";
import PendingAdoption from "@/components/adoptions/PendingAdoption";
import { PetCardSkeletonGrid } from "@/components/PetCardSkeleton";
import HappyEndingList from "@/components/profile/HappyEndingList";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function EmptyState({ title, children, action }) {
  return (
    <Empty variant="card">
      <EmptyHeader>
        <EmptyMedia variant="brand">
          <PawPrint />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{children}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}

export default function MyAdoptions() {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    api
      .get("/api/my-adoptions")
      .then(({ data }) => !ignore && setAdoptions(data.data))
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setError(false);
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  // Confirmada vira o primeiro card de adotados (a mais recente); negada some da página.
  function handleAnswered(answered, adopted) {
    setAdoptions((current) => {
      const others = current.filter((adoption) => adoption.id !== answered.id);

      return adopted
        ? [
            {
              ...answered,
              status: "completed",
              completed_at: new Date().toISOString(),
            },
            ...others,
          ]
        : others;
    });
  }

  if (loading) {
    return <PetCardSkeletonGrid label="Carregando adoções" />;
  }

  if (error) {
    return (
      <EmptyState
        title="Não foi possível carregar"
        action={
          <Button variant="secondary" size="md" onClick={retry}>
            Tentar de novo
          </Button>
        }
      >
        Verifique sua conexão e tente novamente.
      </EmptyState>
    );
  }

  const pending = adoptions.filter(
    (adoption) => adoption.status === "in_progress",
  );
  const completed = adoptions.filter(
    (adoption) => adoption.status === "completed",
  );

  return (
    <div className="flex w-full flex-col gap-8">
      {pending.length > 0 && (
        <section
          aria-labelledby="pending-title"
          className="flex flex-col gap-4"
        >
          <h2 id="pending-title" className="text-xl leading-7">
            Aguardando sua confirmação
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,24rem),1fr))] gap-6">
            {pending.map((adoption) => (
              <div
                key={adoption.id}
                className="rounded-2xl bg-card p-6 shadow-xs ring-1 ring-warning/30"
              >
                <PendingAdoption
                  adoption={adoption}
                  onAnswered={handleAnswered}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 ? (
        <section
          aria-labelledby="adopted-title"
          className="flex flex-col gap-4"
        >
          {pending.length > 0 && (
            <h2 id="adopted-title" className="text-xl leading-7">
              Adotados
            </h2>
          )}
          <HappyEndingList adoptions={completed} />
        </section>
      ) : (
        pending.length === 0 && (
          <EmptyState
            title="Nenhuma adoção ainda"
            action={
              <Button asChild size="md">
                <Link to="/adoptions">Conhecer pets para adotar</Link>
              </Button>
            }
          >
            Quando você adotar um pet pela plataforma, ele aparece aqui.
          </EmptyState>
        )
      )}
    </div>
  );
}
