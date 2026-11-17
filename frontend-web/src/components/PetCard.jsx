import { useState } from "react";
import { ArrowRight, Heart, MapPin, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { postTypes } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function PetCard({
  pet,
  to = `/posts/${pet.id}`,
  onFavoriteChange,
}) {
  const type = postTypes[pet.type] ? pet.type : "adoption";
  const status = postTypes[type];
  const statusLabel =
    type === "adoption" ? "Disponível para adoção" : status.label;
  const [favorite, setFavorite] = useState(Boolean(pet.is_favorite));
  const [favoritePending, setFavoritePending] = useState(false);
  const isFavoriteKnown = pet.is_favorite !== undefined;
  const canFavorite = type === "adoption" && isFavoriteKnown;

  function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    setFavoritePending(true);
    const request = next
      ? api.put(`/api/posts/${pet.id}/favorite`)
      : api.delete(`/api/posts/${pet.id}/favorite`);
    request
      .then(() => {
        toast.success(
          next ? "Adicionado aos favoritos." : "Removido dos favoritos.",
        );
        onFavoriteChange?.(next);
      })
      .catch(() => {
        setFavorite(!next);
        toast.error("Não foi possível atualizar os favoritos.");
      })
      .finally(() => setFavoritePending(false));
  }
  const animal = pet.animal || {};
  const city = pet.municipality
    ? [
        pet.location_reference,
        `${pet.municipality.name} - ${pet.municipality.state}`,
      ]
        .filter(Boolean)
        .join(", ")
    : "";
  const name = animal.name || pet.title;
  const description = pet.description;
  const meta = animal.breed || "SRD";
  const tag =
    animal.size === "small"
      ? "Porte pequeno"
      : animal.size === "medium"
        ? "Porte médio"
        : animal.size === "large"
          ? "Porte grande"
          : "Porte indefinido";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md">
      <div className="relative bg-secondary">
        {pet.cover_url ? (
          <img
            src={pet.cover_url}
            alt={name}
            className="h-70 w-full object-cover"
          />
        ) : (
          <div className="flex h-70 w-full items-center justify-center text-muted-foreground/40">
            <PawPrint className="size-16" />
          </div>
        )}
        <Badge
          variant={status.variant}
          className="absolute top-4 left-4 h-6 px-3 shadow-xs"
        >
          {statusLabel}
        </Badge>
        {canFavorite && (
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={`Favoritar ${name}`}
            aria-pressed={favorite}
            onClick={toggleFavorite}
            disabled={favoritePending}
            className="absolute top-4 right-4 rounded-full bg-background/80 shadow-xs backdrop-blur-xs hover:bg-background"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                favorite && "fill-destructive text-destructive",
              )}
            />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl leading-7">{name}</h3>
          <span className="text-xs font-medium tracking-wide text-warning">
            {meta}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
          <MapPin className="size-3.5" />
          {city}
        </p>
        <p className="mt-4 text-[0.8125rem] leading-5 text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <Badge variant="muted">{tag}</Badge>
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
