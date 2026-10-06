import { HeartHandshake, PawPrint } from "lucide-react";

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function HappyEndingList({ adoptions }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {adoptions.map((adoption) => (
        <article
          key={adoption.id}
          className="overflow-hidden rounded-2xl bg-card shadow-xs"
        >
          {adoption.pet.cover_url ? (
            <img
              src={adoption.pet.cover_url}
              alt={adoption.pet.name ?? "Pet adotado"}
              className="h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-48 items-center justify-center bg-secondary text-warning">
              <PawPrint className="size-10" />
            </div>
          )}
          <div className="flex flex-col gap-1 p-5">
            <h3 className="text-xl">{adoption.pet.name ?? "Sem nome"}</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <HeartHandshake className="size-4 text-success" />
              {adoption.role === "donor"
                ? `Doado para ${adoption.adopter.name}`
                : `Adotado de ${adoption.donor.name}`}
            </p>
            {adoption.completed_at && (
              <p className="text-xs text-muted-foreground">
                {fullDate.format(new Date(adoption.completed_at))}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
