import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/api/axios";
import PendingAdoption from "@/components/adoptions/PendingAdoption";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DISMISSED_KEY = "adoption-prompt-dismissed";

function readDismissed() {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY)) ?? [];
  } catch {
    return [];
  }
}

/**
 * Pergunta ao adotante, ao entrar no sistema, se ele adotou o pet indicado.
 * "Depois" só adia até a próxima sessão; a resposta continua disponível em Minhas adoções,
 * onde o modal não abre porque a própria página já mostra as pendentes.
 */
export default function AdoptionPrompt() {
  const { pathname } = useLocation();
  const [pending, setPending] = useState([]);
  const onMyAdoptions = pathname === "/my-adoptions";

  // Busca de novo ao sair de Minhas adoções: o que foi respondido lá não pode reaparecer aqui.
  useEffect(() => {
    if (onMyAdoptions) return undefined;
    let ignore = false;
    const dismissed = readDismissed();

    api
      .get("/api/my-adoptions")
      .then(
        ({ data }) =>
          !ignore &&
          setPending(
            data.data.filter(
              (adoption) =>
                adoption.status === "in_progress" &&
                !dismissed.includes(adoption.id),
            ),
          ),
      )
      .catch(() => {});

    return () => {
      ignore = true;
      setPending([]);
    };
  }, [onMyAdoptions]);

  const current = pending[0];

  function next() {
    setPending((list) => list.slice(1));
  }

  function postpone() {
    try {
      sessionStorage.setItem(
        DISMISSED_KEY,
        JSON.stringify([...readDismissed(), current.id]),
      );
    } catch {
      // Sem storage, o modal só volta a aparecer no próximo carregamento.
    }
    next();
  }

  return (
    <Dialog
      open={Boolean(current) && !onMyAdoptions}
      onOpenChange={(open) => !open && postpone()}
    >
      {current && (
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Você adotou {current.pet.name ?? "este pet"}?
            </DialogTitle>
            <DialogDescription>
              Sua confirmação conclui a adoção e libera a avaliação entre vocês.
            </DialogDescription>
          </DialogHeader>
          <PendingAdoption adoption={current} onAnswered={next}>
            <Button
              variant="ghost"
              size="md"
              className="mr-auto"
              onClick={postpone}
            >
              Depois
            </Button>
          </PendingAdoption>
        </DialogContent>
      )}
    </Dialog>
  );
}
