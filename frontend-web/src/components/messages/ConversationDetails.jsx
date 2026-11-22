import { useState } from "react";
import {
  Ban,
  CalendarDays,
  ExternalLink,
  Flag,
  MapPin,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { initialsOf } from "@/lib/initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { conversationKinds } from "@/lib/conversations";

const actionClass = "h-10 w-full justify-start gap-3 px-3 font-medium";
const sectionLabelClass =
  "text-label font-semibold text-muted-foreground uppercase";

// Bloquear pede confirmação; desbloquear é imediato. Denunciar depende da moderação.
export default function ConversationDetails({
  conversation,
  onBlockChange,
  children,
}) {
  const [confirmingBlock, setConfirmingBlock] = useState(false);
  const [pending, setPending] = useState(false);
  const { person, pet } = conversation;
  const firstName = person.split(" ")[0];
  const kind = conversationKinds[conversation.kind];
  const canBlock = conversation.status === "active";

  function comingSoon() {
    toast.info("Disponível em breve.");
  }

  async function changeBlock(blocked) {
    setPending(true);
    const done = await onBlockChange(blocked);
    setPending(false);
    if (done) setConfirmingBlock(false);
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
              {pet.image ? (
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center text-muted-foreground/40">
                  <PawPrint className="size-12" />
                </div>
              )}
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
              </div>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link to={`/posts/${conversation.postId}`}>
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
                <AvatarImage src={conversation.personAvatar} alt="" />
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
              onClick={comingSoon}
            >
              <Flag />
              Denunciar
            </Button>
            {conversation.blockedByMe ? (
              <Button
                type="button"
                variant="ghost"
                className={actionClass}
                disabled={pending}
                onClick={() => changeBlock(false)}
              >
                <Ban />
                Desbloquear {firstName}
              </Button>
            ) : (
              canBlock && (
                <Button
                  type="button"
                  variant="ghost"
                  className={`${actionClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
                  onClick={() => setConfirmingBlock(true)}
                >
                  <Ban />
                  Bloquear {firstName}
                </Button>
              )
            )}
          </section>
        </div>
      </SheetContent>

      <Dialog open={confirmingBlock} onOpenChange={setConfirmingBlock}>
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bloquear {firstName}?</DialogTitle>
            <DialogDescription>
              Nenhum de vocês poderá enviar mensagens nesta conversa. O
              histórico continua visível, e você pode desbloquear depois.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mx-0 mb-0 rounded-none border-t-0 bg-transparent p-0 pt-1">
            <Button
              variant="outline"
              size="md"
              onClick={() => setConfirmingBlock(false)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              size="md"
              disabled={pending}
              onClick={() => changeBlock(true)}
            >
              {pending && <Spinner />}
              Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
