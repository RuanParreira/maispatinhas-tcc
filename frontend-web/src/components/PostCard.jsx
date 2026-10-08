import { ArrowRight, Calendar, Clock, MapPin, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { animalSpecies, postStatuses, postTypes } from "@/lib/posts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const fallbackBadge = (label) => ({ label, variant: "muted" });

export default function PostCard({ post }) {
  const type = postTypes[post.type] ?? fallbackBadge(post.type);
  // A listagem pública não traz status: lá todo anúncio está publicado.
  const status = post.status
    ? (postStatuses[post.status] ?? fallbackBadge(post.status))
    : null;
  const imageUrl = post.cover_url ?? post.cover?.[0]?.url;
  const isPending = post.status === "pending_approval";
  const meta = [animalSpecies[post.animal?.species], post.animal?.name]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md",
        isPending && "border border-dashed border-warning/40",
      )}
    >
      <div className="relative bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.animal?.name ?? post.title}
            className={cn(
              "h-70 w-full object-cover",
              isPending && "opacity-80 saturate-50",
            )}
          />
        ) : (
          <div className="flex h-70 w-full items-center justify-center text-muted-foreground/40">
            <PawPrint className="size-16" />
          </div>
        )}
        <Badge
          variant={type.variant}
          className="absolute top-4 left-4 h-6 px-3 shadow-xs"
        >
          {type.label}
        </Badge>
        {status && (
          <Badge
            variant={status.variant}
            className="absolute top-4 right-4 h-6 px-3 shadow-xs"
          >
            {isPending && (
              <span className="size-1.5 rounded-full bg-warning motion-safe:animate-pulse" />
            )}
            {status.label}
          </Badge>
        )}
        {isPending && (
          <p className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl bg-background/85 px-3.5 py-2.5 text-xs leading-4 text-warning shadow-xs backdrop-blur-xs">
            <Clock className="size-4 shrink-0" />
            Em análise. Fica visível para todos após a aprovação.
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-1 text-xl leading-7">{post.title}</h3>
          <span className="shrink-0 text-xs font-medium tracking-wide text-warning">
            {meta}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
          <MapPin className="size-3.5" />
          {post.municipality?.name}, {post.municipality?.state}
        </p>
        <p className="mt-4 line-clamp-2 text-[0.8125rem] leading-5 text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <Badge variant="muted">
              <Calendar />
              {new Date(post.published_at ?? post.created_at).toLocaleDateString(
                "pt-BR",
              )}
            </Badge>
            <Link
              to={`/posts/${post.id}`}
              className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
            >
              Ver detalhes
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
