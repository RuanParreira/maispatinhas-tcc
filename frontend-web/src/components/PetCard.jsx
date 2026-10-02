import { useState } from "react";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        <Badge
          variant="success"
          className="absolute top-4 left-4 h-6 px-3 shadow-xs"
        >
          Disponível para adoção
        </Badge>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label={`Favoritar ${pet.name}`}
          aria-pressed={favorite}
          onClick={() => setFavorite((current) => !current)}
          className="absolute top-4 right-4 rounded-full bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              favorite && "fill-destructive text-destructive",
            )}
          />
        </Button>
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
            <Badge variant="muted">{pet.tag}</Badge>
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
