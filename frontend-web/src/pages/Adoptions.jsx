import { useMemo, useState } from "react";
import { ChevronRight, PawPrint, Search } from "lucide-react";
import { normalize } from "@/lib/text";
import { cn } from "@/lib/utils";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const pageLinkClass = "size-10 rounded-xl font-semibold shadow-xs";

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
    const term = normalize(values.search);
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
          <InputGroup className="h-11 min-w-60 flex-1">
            <InputGroupInput
              type="search"
              aria-label="Buscar pets"
              placeholder="Busque por nome, raça ou cidade"
              value={values.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="pr-4 text-body md:text-body"
            />
            <InputGroupAddon className="pl-4">
              <Search className="size-4.5" />
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1">
            <ToggleGroup
              type="single"
              variant="solid"
              size="lg"
              spacing={1}
              aria-label="Espécie"
              value={isOtherSpecies ? "" : values.species}
              onValueChange={(value) => value && setFilter("species", value)}
            >
              {speciesOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className="px-3.5 text-muted-foreground hover:bg-transparent"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
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
                size="lg"
                variant="filled"
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
        <Empty variant="card">
          <EmptyHeader>
            <EmptyMedia variant="brand">
              <PawPrint />
            </EmptyMedia>
            <EmptyTitle>Nenhum pet encontrado</EmptyTitle>
            <EmptyDescription>
              Tente ajustar os filtros ou buscar por outro nome ou cidade.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setValues(initialFilters)}
            >
              Limpar filtros
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {pets.length > 0 && (
        <Pagination className="flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8125rem] text-muted-foreground">Página 1 de 4</p>
          <PaginationContent className="gap-2">
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === 1}
                  onClick={(e) => e.preventDefault()}
                  className={cn(pageLinkClass, page !== 1 && "bg-card")}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink
                href="#"
                aria-label="Próxima página"
                onClick={(e) => e.preventDefault()}
                className={cn(pageLinkClass, "bg-card")}
              >
                <ChevronRight />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
