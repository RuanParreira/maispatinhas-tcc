import { ArrowRight, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import lunaImage from "@/assets/home/luna.jpg";
import pipocaImage from "@/assets/home/pipoca.jpg";
import bentoImage from "@/assets/home/bento.jpg";

const pets = [
  {
    name: "Luna",
    meta: "Gata · 2 anos",
    city: "Franca, SP",
    description:
      "Dócil, adora passar a tarde na janela e convive harmoniosamente em apartamentos silenciosos.",
    tag: "Castrada & Vacinada",
    image: lunaImage,
  },
  {
    name: "Pipoca",
    meta: "Cão SRD · 3 anos",
    city: "São Paulo, SP",
    description:
      "Calmo, obediente e parceiro para longas caminhadas matinais. Muito sociável com pessoas.",
    tag: "Sociável com cães",
    image: pipocaImage,
  },
  {
    name: "Bento",
    meta: "Filhote · 4 meses",
    city: "Campinas, SP",
    description:
      "Curioso, brincalhão e cheio de energia para alegrar qualquer família com quintal ou tempo livre.",
    tag: "Primeira dose V10",
    image: bentoImage,
  },
];

export default function FeaturedPets() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-label font-semibold text-warning uppercase">
            Adoção responsável
          </p>
          <h2 className="mt-2 text-section tracking-tight">
            Talvez o próximo membro da sua família esteja aqui.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Animais resgatados e prontos para encher sua casa de afeto.
          </p>
        </div>
        <Link
          to="/adoptions"
          className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
        >
          Ver todos os pets
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <article
            key={pet.name}
            className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="relative bg-secondary">
              <img
                src={pet.image}
                alt={`${pet.name} para adoção`}
                className="h-70 w-full object-cover"
              />
              <span className="absolute top-4 left-4 rounded-full bg-success-subtle px-3 py-1 text-[0.6875rem] leading-4 font-medium tracking-wide text-success shadow-xs">
                Disponível para adoção
              </span>
              <button
                type="button"
                aria-label={`Favoritar ${pet.name}`}
                className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background/80 shadow-xs backdrop-blur-xs transition-colors hover:bg-background"
              >
                <Heart className="size-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl leading-7">{pet.name}</h3>
                <span className="text-xs font-medium tracking-wide text-warning">
                  {pet.meta}
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
                <MapPin className="size-3.5" />
                {pet.city}
              </p>
              <p className="mt-4 text-[0.8125rem] leading-5 text-muted-foreground">
                {pet.description}
              </p>

              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.6875rem] leading-4 font-semibold tracking-wide text-muted-foreground">
                    {pet.tag}
                  </span>
                  <Link
                    to="/adoptions"
                    className="group inline-flex items-center gap-1 text-base font-semibold text-warning"
                  >
                    Conhecer
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
