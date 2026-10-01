import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PetCard from "@/components/PetCard";
import { mockPets } from "@/data/mockPets";

const pets = mockPets.slice(0, 3);

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
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </section>
  );
}
