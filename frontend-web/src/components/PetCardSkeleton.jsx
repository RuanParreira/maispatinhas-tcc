import { Skeleton } from "@/components/ui/skeleton";

/**
 * 12 é divisível por 1, 2, 3 e 4 colunas, então a última linha do grid sempre fecha.
 */
const placeholderCount = 12;

export function PetCardSkeletonGrid({ label }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6"
    >
      {Array.from({ length: placeholderCount }, (_, index) => (
        <PetCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Placeholder com o mesmo formato do PetCard, exibido enquanto a lista carrega.
 */
export default function PetCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs"
    >
      <div className="relative">
        <Skeleton className="h-70 w-full rounded-none" />
        <Skeleton className="absolute top-4 left-4 h-6 w-36 rounded-full bg-card/70" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="mt-3 h-3.5 w-40" />
        <div className="mt-5 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
