import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Pede confirmação antes de sair com o anúncio preenchido: pelo menu (dialog)
 * ou ao fechar/recarregar a aba (aviso do navegador).
 */
export default function LeaveGuard({ when, editing = false }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!when) return undefined;
    const warn = (event) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [when]);

  return (
    <Dialog
      open={blocker.state === "blocked"}
      onOpenChange={(open) => !open && blocker.reset?.()}
    >
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Sair sem salvar?" : "Sair sem publicar?"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "As alterações que você fez serão perdidas."
              : "O que você preencheu neste anúncio será perdido."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-0 mb-0 rounded-none border-t-0 bg-transparent p-0 pt-1">
          <Button variant="outline" size="md" onClick={() => blocker.reset?.()}>
            Continuar editando
          </Button>
          <Button
            variant="destructive"
            size="md"
            onClick={() => blocker.proceed?.()}
          >
            Sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
