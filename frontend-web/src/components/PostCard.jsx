import {
  ArrowRight,
  CircleAlert,
  Clock,
  MapPin,
  PauseCircle,
  PawPrint,
  TimerOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  animalSpecies,
  postStatuses,
  statusLabelOf,
  postTypes,
} from "@/lib/posts";
import { cn } from "@/lib/utils";

const statusDotColors = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  info: "bg-info",
  secondary: "bg-muted-foreground",
  muted: "bg-muted-foreground",
};

const statusNotes = {
  pending_approval: {
    icon: Clock,
    className: "bg-warning-subtle text-warning",
    text: "Em análise. Fica visível para todos após a aprovação.",
  },
  paused: {
    icon: PauseCircle,
    className: "bg-secondary text-secondary-foreground",
    text: "Pausado. Fora do catálogo até você retomar.",
  },
  expired: {
    icon: TimerOff,
    className: "bg-secondary text-secondary-foreground",
    text: "Expirado. Renove para voltar ao catálogo.",
  },
};

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function StatusNote({ icon: Icon, className, children }) {
  return (
    <p
      className={cn(
        "mt-4 flex gap-2 rounded-xl px-3.5 py-2.5 text-xs leading-4",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/**
 * Card de anúncio com status (Meus anúncios) ou sem (perfil público).
 * `actions` é o menu do dono, exibido sobre a foto.
 */
export default function PostCard({ post, actions }) {
  const status = post.status ? postStatuses[post.status] : null;
  const note = statusNotes[post.status];
  // Cancelado aparece apagado: terminou sem sucesso. Resolvido mantém as cores, é um final feliz.
  const isCanceled = post.status === "canceled";
  const imageUrl = post.cover_url ?? post.cover?.[0]?.url;
  const meta = [
    postTypes[post.type]?.label,
    animalSpecies[post.animal?.species],
    post.municipality &&
      `${post.municipality.name}, ${post.municipality.state}`,
  ]
    .filter(Boolean)
    .join(" · ");
  // O card público (PostCardResource) não traz created_at: sem data de publicação, o rodapé fica só com o link.
  const date = post.published_at
    ? `Publicado em ${dateFormat.format(new Date(post.published_at))}`
    : post.created_at &&
      `Criado em ${dateFormat.format(new Date(post.created_at))}`;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md",
        isCanceled && "opacity-80",
      )}
    >
      <div className="relative bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.animal?.name ?? post.title}
            loading="lazy"
            className={cn(
              "h-70 w-full object-cover object-[50%_25%]",
              isCanceled && "grayscale",
            )}
          />
        ) : (
          <div className="flex h-70 w-full items-center justify-center text-muted-foreground/40">
            <PawPrint aria-hidden="true" className="size-16" />
          </div>
        )}
        {status && (
          <span className="absolute top-4 left-4 inline-flex h-7 items-center gap-2 rounded-full bg-background/90 px-3 text-xs font-semibold shadow-xs backdrop-blur-xs">
            <span
              aria-hidden="true"
              className={cn(
                "size-2 rounded-full",
                statusDotColors[status.variant],
                post.status === "pending_approval" &&
                  "motion-safe:animate-pulse",
              )}
            />
            {statusLabelOf(post)}
          </span>
        )}
        {actions && <div className="absolute top-3 right-3">{actions}</div>}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-1 text-xl leading-7 text-pretty">
          {post.title}
        </h3>
        <p className="mt-1.5 flex min-w-0 items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{meta}</span>
        </p>
        <p className="mt-4 line-clamp-2 text-[0.8125rem] leading-5 text-muted-foreground">
          {post.description}
        </p>
        {note && <StatusNote {...note}>{note.text}</StatusNote>}
        {post.rejection_reason && (
          <StatusNote
            icon={CircleAlert}
            className="bg-destructive-subtle text-destructive"
          >
            <span className="font-semibold">Motivo da rejeição:</span>{" "}
            {post.rejection_reason}
          </StatusNote>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <span className="text-xs text-muted-foreground">{date}</span>
            <Link
              to={`/posts/${post.id}`}
              className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
            >
              Ver detalhes
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
