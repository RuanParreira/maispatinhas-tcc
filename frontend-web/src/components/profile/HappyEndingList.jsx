import { CalendarCheck, Heart, HeartHandshake, PawPrint } from "lucide-react";
import { animalSpecies } from "@/lib/posts";
import { initialsOf } from "@/lib/initials";
import PersonLink from "@/components/profile/PersonLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const fullDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function Person({ person, label }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar size="lg">
        {person.avatar_url && <AvatarImage src={person.avatar_url} alt="" />}
        <AvatarFallback className="bg-secondary text-xs font-semibold text-warning">
          {initialsOf(person.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 text-sm leading-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate">
          <PersonLink person={person} />
        </p>
      </div>
    </div>
  );
}

// Mesma estrutura do PostCard (foto, título, linha de apoio, bloco e rodapé),
// para as abas do perfil terem cards da mesma altura.
export default function HappyEndingList({ adoptions }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
      {adoptions.map((adoption) => (
        <article
          key={adoption.id}
          className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md"
        >
          <div className="relative bg-secondary">
            {adoption.pet.cover_url ? (
              <img
                src={adoption.pet.cover_url}
                alt={adoption.pet.name ?? "Pet adotado"}
                className="h-70 w-full object-cover"
              />
            ) : (
              <div className="flex h-70 w-full items-center justify-center text-muted-foreground/40">
                <PawPrint className="size-16" />
              </div>
            )}
            <Badge
              variant="success"
              className="absolute top-4 left-4 h-6 px-3 shadow-xs"
            >
              <Heart />
              Final feliz
            </Badge>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="line-clamp-1 text-xl leading-7">
                {adoption.pet.name ?? "Sem nome"}
              </h3>
              <span className="shrink-0 text-xs font-medium tracking-wide text-warning">
                {animalSpecies[adoption.pet.species]}
              </span>
            </div>
            {adoption.completed_at && (
              <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
                <CalendarCheck className="size-3.5" />
                Concluída em {fullDate.format(new Date(adoption.completed_at))}
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Person person={adoption.donor} label="Doou" />
              <Person person={adoption.adopter} label="Adotou" />
            </div>

            <div className="mt-auto pt-4">
              <div className="flex min-h-6 items-center border-t border-border/50 pt-4">
                <Badge variant="success">
                  <HeartHandshake />
                  {adoption.role === "donor"
                    ? "Doou este pet"
                    : "Adotou este pet"}
                </Badge>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
