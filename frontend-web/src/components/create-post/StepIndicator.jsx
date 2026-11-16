import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Progresso do cadastro. Etapas já concluídas podem ser clicadas para voltar.
 */
export default function StepIndicator({ steps, current, onSelect }) {
  return (
    <nav
      aria-label="Etapas do anúncio"
      className="rounded-2xl bg-card p-4 shadow-xs sm:px-6 sm:py-5"
    >
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.title}
              className={cn("flex items-center", !isLast && "flex-1")}
            >
              <button
                type="button"
                disabled={!isDone}
                onClick={() => onSelect(index)}
                aria-current={isCurrent ? "step" : undefined}
                className="group flex shrink-0 items-center gap-3 rounded-xl text-left disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-all",
                    isDone &&
                      "bg-primary text-primary-foreground group-hover:bg-primary/80",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/25",
                    !isDone &&
                      !isCurrent &&
                      "border border-border bg-background text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden flex-col xl:flex">
                  <span className="text-[0.6875rem] font-medium tracking-wide text-muted-foreground">
                    Etapa {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      !isDone &&
                        !isCurrent &&
                        "font-medium text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </span>
                </span>
              </button>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-secondary"
                >
                  <span
                    className={cn(
                      "block h-full rounded-full bg-primary transition-all duration-500",
                      isDone ? "w-full" : "w-0",
                    )}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-[0.8125rem] text-muted-foreground xl:hidden">
        Etapa {current + 1} de {steps.length}:{" "}
        <span className="font-semibold text-foreground">
          {steps[current].title}
        </span>
      </p>
    </nav>
  );
}
