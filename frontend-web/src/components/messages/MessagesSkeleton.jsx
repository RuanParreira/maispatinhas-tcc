import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const bubbles = [
  { mine: false, width: "w-52" },
  { mine: true, width: "w-64" },
  { mine: false, width: "w-40" },
  { mine: true, width: "w-48" },
];

/**
 * Balões alternados no lugar das mensagens enquanto a conversa carrega.
 */
export function MessageBubblesSkeleton() {
  return (
    <div aria-hidden="true" className="flex w-full flex-col gap-4">
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className={cn(
            "flex items-end gap-2",
            bubble.mine && "flex-row-reverse",
          )}
        >
          {!bubble.mine && <Skeleton className="size-8 rounded-full" />}
          <Skeleton className={cn("h-10 rounded-2xl", bubble.width)} />
        </div>
      ))}
    </div>
  );
}

/**
 * Mesmo desenho da tela de mensagens (lista à esquerda, chat à direita), para a
 * página não pular quando os dados chegam. No celular só a lista aparece.
 */
export default function MessagesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Carregando conversas"
      className="flex h-[calc(100svh-9.5rem)] min-h-112 w-full overflow-hidden rounded-2xl bg-card shadow-xs"
    >
      <div className="flex w-full flex-col gap-3 p-4 md:w-80 md:shrink-0 md:border-r md:border-border/60 lg:w-96">
        <Skeleton className="h-10 w-full rounded-full" />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-2.5">
            <Skeleton className="size-13 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex justify-between gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden flex-1 flex-col md:flex">
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-end px-6 py-6">
          <MessageBubblesSkeleton />
        </div>
        <div className="border-t border-border/60 px-3 py-3">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
