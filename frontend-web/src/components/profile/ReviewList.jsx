import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
            step <= rating ? "fill-primary text-primary" : "text-border",
          )}
        />
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
          <p className="flex-1 leading-relaxed text-foreground/90 italic">
            “{review.comment}”
          </p>
          <div className="flex items-center gap-3 border-t border-border/50 pt-4">
            <Avatar className="size-10">
              <AvatarFallback className="bg-secondary text-sm font-semibold text-warning">
                {initialsOf(review.reviewer)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium">{review.reviewer}</p>
              <p className="text-xs text-muted-foreground">
                Adotou {review.petName} ·{" "}
                {monthYear.format(new Date(review.createdAt))}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
