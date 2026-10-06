import { useState } from "react";
import { HeartHandshake, MessageSquareQuote, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import PetCard from "@/components/PetCard";
import HappyEndingList from "@/components/profile/HappyEndingList";
import ReviewList from "@/components/profile/ReviewList";

function EmptyState({ icon: Icon, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-warning">
        <Icon className="size-5" />
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export default function ProfileTabs({ profile, isOwner }) {
  const [active, setActive] = useState("pets");

  const tabs = [
    {
      key: "pets",
      label: "Animais",
      icon: PawPrint,
      count: profile.pets.length,
      empty: isOwner
        ? "Você não tem anúncios de adoção ativos."
        : "Nenhum animal disponível para adoção no momento.",
      content: (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {profile.pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ),
    },
    {
      key: "happy",
      label: "Finais felizes",
      icon: HeartHandshake,
      count: profile.happyEndings.length,
      empty: "Nenhuma adoção concluída ainda.",
      content: <HappyEndingList adoptions={profile.happyEndings} />,
    },
    {
      key: "reviews",
      label: "Avaliações",
      icon: MessageSquareQuote,
      count: profile.reviews.length,
      empty: "Nenhuma avaliação recebida ainda.",
      content: <ReviewList reviews={profile.reviews} />,
    },
  ];

  const current = tabs.find((tab) => tab.key === active);

  return (
    <section className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Seções do perfil"
        className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-2xl bg-card p-1.5 shadow-xs"
      >
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={active === key}
            aria-controls={`panel-${key}`}
            onClick={() => setActive(key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
              active === key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
            <span className="text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.key}`}
        aria-labelledby={`tab-${current.key}`}
      >
        {current.count > 0 ? (
          current.content
        ) : (
          <EmptyState icon={current.icon}>{current.empty}</EmptyState>
        )}
      </div>
    </section>
  );
}
