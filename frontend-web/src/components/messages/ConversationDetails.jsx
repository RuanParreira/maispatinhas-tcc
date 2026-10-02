import { useState } from "react";
import {
  Ban,
  BellOff,
  BellRing,
  CalendarDays,
  ExternalLink,
  Flag,
  MapPin,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { conversationKinds } from "@/data/mockConversations";

const actionClass = "h-10 w-full justify-start gap-3 px-3 font-medium";
const sectionLabelClass =
  "text-label font-semibold text-muted-foreground uppercase";

export default function ConversationDetails({ conversation, children }) {
  const [muted, setMuted] = useState(false);
  const { person, pet } = conversation;
  const kind = conversationKinds[conversation.kind];

  function comingSoon() {
    toast.info("Disponível em breve.");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="gap-0 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Detalhes da conversa</SheetTitle>
          <SheetDescription className="sr-only">
            Informações do anúncio, da pessoa e ações da conversa.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 pb-6">
          <section className="flex flex-col gap-3">
            <p className={sectionLabelClass}>Anúncio</p>
            <div className="overflow-hidden rounded-xl bg-secondary/40">
              <img
                src={pet.image}
                alt={pet.name}
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-heading text-2xl leading-tight">
                    {pet.name}
                  </p>
                  <Badge variant={kind.badge}>{kind.label}</Badge>
                </div>
                <p className="flex flex-wrap items-center gap-x-2 text-[0.8125rem] text-muted-foreground">
                  <span>{pet.meta}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {pet.city}
                  </span>
                </p>
                <p className="text-[0.8125rem] leading-5 text-muted-foreground">
                  {pet.description}
                </p>
                <Badge variant="muted">{pet.tag}</Badge>
              </div>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link to={kind.route}>
                Ver anúncio
                <ExternalLink data-icon="inline-end" />
              </Link>
            </Button>
          </section>

          <Separator />

          <section className="flex flex-col gap-3">
            <p className={sectionLabelClass}>Você está conversando com</p>
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground">
                  {initialsOf(person)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{person}</p>
                <p className="flex items-center gap-1 text-[0.8125rem] text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {conversation.personCity}
                </p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
              <CalendarDays className="size-4" />
              No Mais Patinhas desde {conversation.memberSince}
            </p>
          </section>

          <div className="flex gap-3 rounded-xl bg-warning-subtle p-3 text-[0.8125rem] leading-5">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-warning" />
            <p>
              Adoção responsável não envolve pagamento. Desconfie de pedidos de
              dinheiro e prefira encontros em locais públicos.
            </p>
          </div>

          <Separator />

          <section className="flex flex-col gap-1">
            <p className={sectionLabelClass}>Ações</p>
            <Button
              type="button"
              variant="ghost"
              className={actionClass}
              aria-pressed={muted}
              onClick={() => setMuted((current) => !current)}
            >
              {muted ? <BellRing /> : <BellOff />}
              {muted ? "Reativar notificações" : "Silenciar conversa"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={actionClass}
              onClick={comingSoon}
            >
              <Flag />
              Denunciar
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={actionClass}
              onClick={comingSoon}
            >
              <Ban />
              Bloquear {person.split(" ")[0]}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`${actionClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
              onClick={comingSoon}
            >
              <Trash2 />
              Apagar conversa
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
