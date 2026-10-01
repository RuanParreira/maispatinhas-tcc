import { useState } from "react";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PetCard({ pet, to = "/adoptions" }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative bg-secondary">
        <img
          src={pet.image}
          alt={`${pet.name} para adoção`}
          className="h-70 w-full object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-success-subtle px-3 py-1 text-[0.6875rem] leading-4 font-medium tracking-wide text-success shadow-xs">
          Disponível para adoção
        </span>
        <button
          type="button"
          aria-label={`Favoritar ${pet.name}`}
          aria-pressed={favorite}
          onClick={() => setFavorite((current) => !current)}
          className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/80 shadow-xs backdrop-blur-xs transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              favorite && "fill-destructive text-destructive",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl leading-7">{pet.name}</h3>
          <span className="text-xs font-medium tracking-wide text-warning">
            {pet.meta}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
          <MapPin className="size-3.5" />
          {pet.city}
        </p>
        <p className="mt-4 text-[0.8125rem] leading-5 text-muted-foreground">
          {pet.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] leading-4 font-semibold tracking-wide text-muted-foreground">
              {pet.tag}
            </span>
            <Link
              to={to}
              className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
            >
              Conhecer
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
