import { useEffect, useState } from "react";
import { ArrowRight, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import { catalogPathOf } from "@/lib/homeIntents";
import PetCard from "@/components/PetCard";
import PetCardSkeleton from "@/components/PetCardSkeleton";

const featuredCount = 3;

// Os 3 anúncios mais recentes da intenção escolhida; com cidade, só os daquela cidade.
export default function FeaturedPets({ intent, city, cityName }) {
  const requestKey = `${intent.label}#${city}`;
  const [result, setResult] = useState({ key: null, pets: [] });
  const loading = result.key !== requestKey;

  useEffect(() => {
    let ignore = false;
    const params = { type: intent.types, sort: "recent" };
    if (city) Object.assign(params, { near: city, radius: 0 });

    api
      .get("/api/posts", { params })
      .then(
        ({ data }) =>
          !ignore &&
          setResult({
            key: requestKey,
            pets: data.data.slice(0, featuredCount),
          }),
      )
      .catch(() => !ignore && setResult({ key: requestKey, pets: [] }));
    return () => {
      ignore = true;
    };
  }, [intent, city, requestKey]);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-label font-semibold text-warning uppercase">
            {intent.eyebrow}
            {cityName && ` · ${cityName}`}
          </p>
          <h2 className="mt-2 text-section tracking-tight">{intent.title}</h2>
          <p className="mt-3 text-muted-foreground">{intent.description}</p>
        </div>
        <Link
          to={catalogPathOf(intent, city)}
          className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
        >
          {intent.action}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: featuredCount }, (_, index) => (
            <PetCardSkeleton key={index} />
          ))}
        </div>
      ) : result.pets.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {result.pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-12 text-center shadow-xs">
          <PawPrint className="size-8 text-warning" />
          <p className="text-muted-foreground">
            {cityName
              ? `Ainda não há pets ${intent.empty} em ${cityName}.`
              : `Ainda não há pets ${intent.empty} publicados.`}
          </p>
        </div>
      )}
    </section>
  );
}
