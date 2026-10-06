import { HeartHandshake } from "lucide-react";

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
          <img
            src={adoption.pet.image}
            alt={adoption.pet.name}
            className="h-48 w-full object-cover"
          />
          <div className="flex flex-col gap-1 p-5">
            <h3 className="text-xl">{adoption.pet.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <HeartHandshake className="size-4 text-success" />
              Adotado por {adoption.adopter}
            </p>
            <p className="text-xs text-muted-foreground">
              {fullDate.format(new Date(adoption.completedAt))}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
