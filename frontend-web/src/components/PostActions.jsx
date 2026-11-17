import { useState } from "react";
import {
  Ban,
  Ellipsis,
  HeartHandshake,
  Pause,
  Pencil,
  Play,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

/**
 * Ações de status do anúncio. As que não têm volta (resolver e cancelar)
 * pedem confirmação; pausar e retomar são imediatas.
 */
function actionsFor(post) {
  const url = `/api/my-posts/${post.id}`;
  const isLost = post.type === "lost";

  return {
    pause: {
      label: "Pausar anúncio",
      icon: Pause,
      available: post.status === "active",
      request: () => api.post(`${url}/pause`),
      status: "paused",
      success: "Anúncio pausado. Ele saiu do catálogo até você retomar.",
    },
    resume: {
      label: "Retomar anúncio",
      icon: Play,
      available: post.status === "paused",
      request: () => api.delete(`${url}/pause`),
      status: "active",
      success: "Anúncio retomado. Ele voltou ao catálogo.",
    },
    renew: {
      label: "Renovar anúncio",
      icon: RefreshCw,
      available: post.status === "expired",
      request: () => api.post(`${url}/renewal`),
      status: "active",
      success: "Anúncio renovado. Ele voltou ao catálogo.",
    },
    resolve: {
      label: isLost ? "Reencontrei meu pet" : "Devolvi ao tutor",
      icon: HeartHandshake,
      available:
        post.type !== "adoption" && ["active", "paused"].includes(post.status),
      request: () => api.post(`${url}/resolution`),
      status: "resolved",
      success: isLost
        ? "Que bom que ele voltou para casa!"
        : "Que bom que ele voltou para o tutor!",
      confirm: {
        title: isLost
          ? "Seu pet voltou para casa?"
          : "Ele voltou para o tutor?",
        description:
          "O anúncio sai do catálogo e fica em Meus anúncios como resolvido. Não dá para desfazer.",
        button: "Marcar como resolvido",
        variant: "default",
      },
    },
    cancel: {
      request: () => api.delete(url),
      status: "canceled",
      success: "Anúncio cancelado.",
      confirm: {
        title: "Cancelar este anúncio?",
        description: `"${post.title}" sai do catálogo e não pode ser reaberto. Ele continua em Meus anúncios como histórico.`,
        button: "Cancelar anúncio",
        variant: "destructive",
      },
    },
  };
}

/**
 * Menu do dono no card de Meus anúncios. Nada é apagado: cada ação muda o
 * status, e o card é atualizado com o novo status.
 */
export default function PostActions({ post, onStatusChange }) {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(null);
  const [pending, setPending] = useState(false);
  const actions = actionsFor(post);
  const confirmation = confirming && actions[confirming].confirm;

  function run(key) {
    const action = actions[key];
    setPending(true);
    action
      .request()
      .then(() => {
        toast.success(action.success);
        setConfirming(null);
        onStatusChange(post.id, action.status);
      })
      .catch((error) =>
        toast.error(
          error.response?.data?.message ??
            "Não foi possível atualizar o anúncio. Tente novamente.",
        ),
      )
      .finally(() => setPending(false));
  }

  function select(key) {
    if (actions[key].confirm) {
      setConfirming(key);
      return;
    }
    run(key);
  }

  const statusActions = ["pause", "resume", "renew", "resolve"].filter(
    (key) => actions[key].available,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={`Ações do anúncio ${post.title}`}
            disabled={pending}
            className="rounded-full bg-background/90 shadow-xs backdrop-blur-xs hover:bg-background"
          >
            {pending ? <Spinner /> : <Ellipsis />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => navigate(`/posts/${post.id}/edit`)}
          >
            <Pencil />
            Editar
          </DropdownMenuItem>
          {statusActions.map((key) => {
            const { label, icon: Icon } = actions[key];
            return (
              <DropdownMenuItem
                key={key}
                className="cursor-pointer"
                onSelect={() => select(key)}
              >
                <Icon />
                {label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => select("cancel")}
          >
            <Ban />
            Cancelar anúncio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={Boolean(confirmation)}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        {confirmation && (
          <DialogContent className="gap-5 p-6 sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{confirmation.title}</DialogTitle>
              <DialogDescription>{confirmation.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="mx-0 mb-0 rounded-none border-t-0 bg-transparent p-0 pt-1">
              <Button
                variant="outline"
                size="md"
                onClick={() => setConfirming(null)}
              >
                Voltar
              </Button>
              <Button
                variant={confirmation.variant}
                size="md"
                disabled={pending}
                onClick={() => run(confirming)}
              >
                {pending && <Spinner />}
                {confirmation.button}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
