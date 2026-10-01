import { useMemo, useState } from "react";
import { ChevronRight, PawPrint, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import PetCard from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPets } from "@/data/mockPets";

const speciesOptions = [
  { value: "all", label: "Todos" },
  { value: "dog", label: "Cães" },
  { value: "cat", label: "Gatos" },
];

const otherSpeciesOptions = [
  { value: "bird", label: "Aves" },
  { value: "rodent", label: "Roedores" },
  { value: "rabbit", label: "Coelhos" },
  { value: "other", label: "Outros" },
];

const filters = [
  {
    key: "ageGroup",
    label: "Idade",
    options: [
      { value: "all", label: "Todas" },
      { value: "puppy", label: "Filhote" },
      { value: "adult", label: "Adulto" },
      { value: "senior", label: "Idoso" },
    ],
  },
  {
    key: "size",
    label: "Porte",
    options: [
      { value: "all", label: "Todos" },
      { value: "small", label: "Pequeno" },
      { value: "medium", label: "Médio" },
      { value: "large", label: "Grande" },
    ],
  },
  {
    key: "sex",
    label: "Sexo",
    options: [
      { value: "all", label: "Ambos" },
      { value: "female", label: "Fêmea" },
      { value: "male", label: "Macho" },
    ],
  },
];

const initialFilters = {
  search: "",
  species: "all",
  ageGroup: "all",
  size: "all",
  sex: "all",
};

const selectTriggerClass =
  "h-11 gap-2 rounded-xl border-transparent bg-secondary/50 px-4 text-sm data-[size=default]:h-11";

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function Adoptions() {
  const [values, setValues] = useState(initialFilters);
  const [sort, setSort] = useState("recent");

  const isOtherSpecies = otherSpeciesOptions.some(
    (option) => option.value === values.species,
  );

  function setFilter(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const pets = useMemo(() => {
    const term = normalize(values.search.trim());
    const filtered = mockPets.filter(
      (pet) =>
        (values.species === "all" || pet.species === values.species) &&
        (values.ageGroup === "all" || pet.ageGroup === values.ageGroup) &&
        (values.size === "all" || pet.size === values.size) &&
        (values.sex === "all" || pet.sex === values.sex) &&
        normalize(`${pet.name} ${pet.meta} ${pet.city}`).includes(term),
    );

    return sort === "name"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
      : filtered;
  }, [values, sort]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Buscar pets"
              placeholder="Busque por nome, raça ou cidade"
              value={values.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="h-11 rounded-xl border-transparent bg-secondary/50 pr-4 pl-11 text-body md:text-body"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1">
            {speciesOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={values.species === option.value}
                onClick={() => setFilter("species", option.value)}
                className={cn(
                  "h-9 cursor-pointer rounded-lg px-3.5 text-sm font-medium transition-colors",
                  values.species === option.value
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
            <Select
              value={isOtherSpecies ? values.species : ""}
              onValueChange={(value) => setFilter("species", value)}
            >
              <SelectTrigger
                aria-label="Outras espécies"
                className={cn(
                  "h-9 gap-1.5 rounded-lg border-transparent px-3.5 text-sm font-medium data-[size=default]:h-9 data-placeholder:text-muted-foreground",
                  isOtherSpecies
                    ? "bg-primary text-primary-foreground shadow-xs [&_svg]:text-primary-foreground"
                    : "hover:text-foreground",
                )}
              >
                <SelectValue placeholder="Outros" />
              </SelectTrigger>
              <SelectContent position="popper" align="end" className="min-w-40">
                {otherSpeciesOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={values[filter.key]}
              onValueChange={(value) => setFilter(filter.key, value)}
            >
              <SelectTrigger
                aria-label={filter.label}
                className={selectTriggerClass}
              >
                <span className="text-muted-foreground">{filter.label}:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="min-w-40">
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.8125rem] text-muted-foreground">
          <p>
            Exibindo{" "}
            <span className="font-semibold text-foreground">
              {pets.length} {pets.length === 1 ? "pet" : "pets"}
            </span>{" "}
            para adoção
          </p>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger
              aria-label="Ordenar por"
              className="h-9 gap-2 border-transparent px-2 text-[0.8125rem] data-[size=default]:h-9"
            >
              <span className="text-muted-foreground">Ordenar por:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-40">
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="name">Nome (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {pets.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-16 text-center shadow-xs">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-warning">
            <PawPrint className="size-5" />
          </span>
          <h3 className="text-2xl">Nenhum pet encontrado</h3>
          <p className="max-w-sm text-muted-foreground">
            Tente ajustar os filtros ou buscar por outro nome ou cidade.
          </p>
          <Button
            variant="secondary"
            className="mt-2 h-10 px-4"
            onClick={() => setValues(initialFilters)}
          >
            Limpar filtros
          </Button>
        </div>
      )}

      {pets.length > 0 && (
        <nav
          aria-label="Paginação"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <p className="text-[0.8125rem] text-muted-foreground">Página 1 de 4</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                aria-current={page === 1 ? "page" : undefined}
                className={cn(
                  "size-10 cursor-pointer rounded-xl text-sm font-semibold transition-colors",
                  page === 1
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card shadow-xs hover:bg-secondary",
                )}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Próxima página"
              className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-card shadow-xs transition-colors hover:bg-secondary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
