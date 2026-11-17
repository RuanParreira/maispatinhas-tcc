import { useState } from "react";
import { Ellipsis, Pencil, Ban } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

/**
 * Menu do dono no card de Meus anúncios: editar ou cancelar (com confirmação).
 * Cancelar não apaga: o anúncio sai do catálogo e fica como histórico.
 */
export default function PostActions({ post, onCanceled }) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

  function cancelPost() {
    setCanceling(true);
    api
      .delete(`/api/my-posts/${post.id}`)
      .then(() => {
        toast.success("Anúncio cancelado.");
        setConfirmOpen(false);
        onCanceled(post.id);
      })
      .catch((error) =>
        toast.error(
          error.response?.data?.message ??
            "Não foi possível cancelar. Tente novamente.",
        ),
      )
      .finally(() => setCanceling(false));
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Ações do anúncio ${post.title}`}
            className="rounded-full"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => navigate(`/posts/${post.id}/edit`)}
          >
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => setConfirmOpen(true)}
          >
            <Ban />
            Cancelar anúncio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar este anúncio?</DialogTitle>
            <DialogDescription>
              "{post.title}" sai do catálogo e não pode ser reaberto. Ele
              continua em Meus anúncios como histórico.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mx-0 mb-0 rounded-none border-t-0 bg-transparent p-0 pt-1">
            <Button
              variant="outline"
              size="md"
              onClick={() => setConfirmOpen(false)}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              size="md"
              disabled={canceling}
              onClick={cancelPost}
            >
              {canceling && <Spinner />}
              Cancelar anúncio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
