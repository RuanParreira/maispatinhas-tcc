import { useState } from "react";
import { HeartHandshake, MessageSquareQuote, PawPrint } from "lucide-react";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import PetCard from "@/components/PetCard";
import HappyEndingList from "@/components/profile/HappyEndingList";
import ReviewList from "@/components/profile/ReviewList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPets } from "@/data/mockPets";

// Anúncios ficam com dados de exemplo até a parte de posts ser integrada.
const examplePets = mockPets.slice(0, 3);

function EmptyState({ icon: Icon, action, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-warning">
        <Icon className="size-5" />
      </span>
      <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
      {action}
    </div>
  );
}

function RemoteList({ list, icon, empty, children }) {
  if (!list.loaded && list.loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (list.error && list.items.length === 0) {
    return (
      <EmptyState
        icon={icon}
        action={
          <Button type="button" variant="outline" onClick={list.retry}>
            Tentar de novo
          </Button>
        }
      >
        Não foi possível carregar.
      </EmptyState>
    );
  }

  if (list.items.length === 0) {
    return <EmptyState icon={icon}>{empty}</EmptyState>;
  }

  return (
    <div className="flex flex-col gap-6">
      {children(list.items)}
      {list.hasMore && (
        <Button
          type="button"
          variant="outline"
          className="h-10 self-center px-5"
          disabled={list.loading}
          onClick={list.loadMore}
        >
          {list.loading && <Spinner />}
          Carregar mais
        </Button>
      )}
    </div>
  );
}

export default function ProfileTabs({ profile, isOwner }) {
  const [active, setActive] = useState("pets");
  const happyEndings = usePaginatedList(
    `/api/users/${profile.id}/adoptions`,
    active === "happy",
  );
  const reviews = usePaginatedList(
    `/api/users/${profile.id}/reviews`,
    active === "reviews",
  );

  const tabs = [
    {
      key: "pets",
      label: "Animais",
      icon: PawPrint,
      count: examplePets.length,
    },
    {
      key: "happy",
      label: "Finais felizes",
      icon: HeartHandshake,
      count: profile.stats.adoptions_completed,
    },
    {
      key: "reviews",
      label: "Avaliações",
      icon: MessageSquareQuote,
      count: profile.stats.reviews_count,
    },
  ];

  return (
    <Tabs value={active} onValueChange={setActive}>
      <TabsList variant="pill" aria-label="Seções do perfil">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <TabsTrigger key={key} value={key}>
            <Icon />
            {label}
            <span className="text-xs opacity-70">({count})</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="pets" className="mt-3">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {examplePets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="happy" className="mt-3">
        <RemoteList
          list={happyEndings}
          icon={HeartHandshake}
          empty="Nenhuma adoção concluída ainda."
        >
          {(items) => <HappyEndingList adoptions={items} />}
        </RemoteList>
      </TabsContent>

      <TabsContent value="reviews" className="mt-3">
        <RemoteList
          list={reviews}
          icon={MessageSquareQuote}
          empty={
            isOwner
              ? "Você ainda não recebeu avaliações."
              : "Nenhuma avaliação recebida ainda."
          }
        >
          {(items) => <ReviewList reviews={items} />}
        </RemoteList>
      </TabsContent>
    </Tabs>
  );
}
