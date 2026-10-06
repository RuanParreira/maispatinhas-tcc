import {
  BadgeCheck,
  CalendarDays,
  MapPin,
  MessageCircle,
  PenLine,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link do perfil copiado.");
  } catch {
    toast.error("Não foi possível copiar o link.");
  }
}

export default function ProfileHeader({ profile, isOwner, onEdit }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-card shadow-xs">
      <div className="h-28 bg-linear-to-r from-primary/45 via-secondary to-primary/25 sm:h-36" />

      <div className="flex flex-col gap-5 px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4 sm:-mt-14">
          <Avatar className="size-24 ring-4 ring-card sm:size-28">
            <AvatarFallback className="bg-primary text-3xl font-semibold text-primary-foreground">
              {initialsOf(profile.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-wrap gap-2">
            {isOwner ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4"
                  onClick={copyLink}
                >
                  <Share2 />
                  Compartilhar
                </Button>
                <Button type="button" className="h-10 px-4" onClick={onEdit}>
                  <PenLine />
                  Editar perfil
                </Button>
              </>
            ) : (
              <Button type="button" className="h-10 px-4">
                <MessageCircle />
                Enviar mensagem
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-4xl leading-tight">
              {profile.name}
            </h2>
            {profile.verified && (
              <Badge variant="success" className="h-6 px-2.5">
                <BadgeCheck />
                E-mail verificado
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-warning" />
              {profile.city}
            </span>
            {profile.createdAt && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-warning" />
                Membro desde {monthYear.format(new Date(profile.createdAt))}
              </span>
            )}
          </div>
        </div>

        {profile.bio ? (
          <p className="rounded-xl bg-secondary/50 p-4 leading-relaxed text-foreground/90">
            {profile.bio}
          </p>
        ) : (
          isOwner && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl border border-dashed border-border p-4 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/40"
            >
              Conte um pouco sobre você: sua casa, sua rotina e sua experiência
              com animais. Isso ajuda quem vai doar ou adotar a confiar em você.
            </button>
          )
        )}
      </div>
    </section>
  );
}
