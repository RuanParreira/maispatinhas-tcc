import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import api from "@/api/axios";
import PetCard from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PetCardSkeletonGrid } from "@/components/PetCardSkeleton";

export default function Favorites() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ attempt: null, posts: [] });
  const loading = result.attempt !== attempt;

  useEffect(() => {
    let ignore = false;

    api
      .get("/api/favorites")
      .then(({ data }) => !ignore && setResult({ attempt, posts: data.data }))
      .catch(
        () => !ignore && setResult({ attempt, posts: [], error: true }),
      );

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function removePost(id) {
    setResult((current) => ({
      ...current,
      posts: current.posts.filter((post) => post.id !== id),
    }));
  }

  if (loading) {
    return <PetCardSkeletonGrid label="Carregando favoritos" />;
  }

  if (result.error) {
    return (
      <Empty variant="card">
        <EmptyHeader>
          <EmptyMedia variant="brand">
            <Heart />
          </EmptyMedia>
          <EmptyTitle>Não foi possível carregar</EmptyTitle>
          <EmptyDescription>
            Verifique sua conexão e tente novamente.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setAttempt((current) => current + 1)}
          >
            Tentar de novo
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (result.posts.length === 0) {
    return (
      <Empty variant="card">
        <EmptyHeader>
          <EmptyMedia variant="brand">
            <Heart />
          </EmptyMedia>
          <EmptyTitle>Nenhum favorito ainda</EmptyTitle>
          <EmptyDescription>
            Toque no coração de um pet para guardá-lo aqui.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="secondary" size="md">
            <Link to="/adoptions">Ver pets para adoção</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
      {result.posts.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          onFavoriteChange={(favorite) => !favorite && removePost(pet.id)}
        />
      ))}
    </div>
  );
}
