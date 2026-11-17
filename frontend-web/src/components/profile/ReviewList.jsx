import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/initials";
import PersonLink from "@/components/profile/PersonLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  year: "numeric",
});

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`Nota ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={cn(
            "size-4",
            step <= rating ? "fill-primary text-warning" : "text-border",
          )}
        />
      ))}
    </div>
  );
}

// Mesmo desenho do card de avaliação: estrelas, comentário e autor.
export function ReviewListSkeleton({ count = 2 }) {
  return (
    <div
      role="status"
      aria-label="Carregando avaliações"
      className="grid gap-4 lg:grid-cols-2"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-xs sm:p-6"
        >
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-3 border-t border-border/50 pt-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReviewList({ reviews }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-xs sm:p-6"
        >
          <Stars rating={review.rating} />
          <p className="flex-1 text-base leading-relaxed text-foreground/90 italic">
            “{review.comment}”
          </p>
          <div className="flex items-center gap-3 border-t border-border/50 pt-4">
            <Avatar className="size-10">
              {review.reviewer.avatar_url && (
                <AvatarImage src={review.reviewer.avatar_url} alt="" />
              )}
              <AvatarFallback className="bg-secondary text-sm font-semibold text-warning">
                {initialsOf(review.reviewer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">
                <PersonLink person={review.reviewer} />
              </p>
              <p className="text-xs text-muted-foreground">
                {review.pet_name && (
                  <>
                    {review.reviewer_role === "adopter" ? "Adotante" : "Doador"}{" "}
                    de {review.pet_name} ·{" "}
                  </>
                )}
                {monthYear.format(new Date(review.created_at))}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
