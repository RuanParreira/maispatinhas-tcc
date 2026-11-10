import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PawPrint, Search } from "lucide-react";
import api from "@/api/axios";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
      { value: "young", label: "Filhote" },
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
const searchDelay = 300;
const visiblePages = 5;

function pageNumbers(current, last) {
  const first = Math.max(
    1,
    Math.min(current - Math.floor(visiblePages / 2), last - visiblePages + 1),
  );
  const count = Math.min(visiblePages, last);
  return Array.from({ length: count }, (_, index) => first + index);
}

function toQueryParams(values, search, sort, page) {
  const params = { type: "adoption", sort, page, search: search.trim() };
  if (values.species !== "all") params.species = values.species;
  if (values.size !== "all") params.size = values.size;
  if (values.sex !== "all") params.sex = values.sex;
  if (values.ageGroup !== "all") params.age_group = values.ageGroup;
  if (!params.search) delete params.search;
  return params;
}

export default function Adoptions() {
  const [values, setValues] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, posts: [], meta: null });

  useEffect(() => {
    const timer = setTimeout(() => setSearch(values.search), searchDelay);
    return () => clearTimeout(timer);
  }, [values.search]);

  const params = useMemo(
    () => toQueryParams(values, search, sort, page),
    [values, search, sort, page],
  );
  const requestKey = `${JSON.stringify(params)}#${attempt}`;
  const loading = result.key !== requestKey;

  useEffect(() => {
    let ignore = false;

    api
      .get("/api/posts", { params })
      .then(
        ({ data }) =>
          !ignore &&
          setResult({ key: requestKey, posts: data.data, meta: data.meta }),
      )
      .catch(
        () =>
          !ignore &&
          setResult({ key: requestKey, posts: [], meta: null, error: true }),
      );

    return () => {
      ignore = true;
    };
  }, [params, requestKey]);

  const isOtherSpecies = otherSpeciesOptions.some(
    (option) => option.value === values.species,
  );

  function setFilter(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  function changeSort(value) {
    setSort(value);
    setPage(1);
  }

  function goToPage(event, target) {
    event.preventDefault();
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pets = result.posts;
  const total = result.meta?.total ?? 0;
  const lastPage = result.meta?.last_page ?? 1;

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
              <SelectContent
                position="popper"
                align="start"
                className="min-w-40"
              >
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
              {total} {total === 1 ? "pet" : "pets"}
            </span>{" "}
            para adoção
          </p>
          <Select value={sort} onValueChange={changeSort}>
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

      {loading && pets.length === 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-96 rounded-2xl" />
          ))}
        </div>
      ) : result.error ? (
        <Empty variant="card">
          <EmptyHeader>
            <EmptyMedia variant="brand">
              <PawPrint />
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
      ) : pets.length > 0 ? (
        <div
          aria-busy={loading}
          className={cn(
            "grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6 transition-opacity",
            loading && "opacity-60",
          )}
        >
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
              onClick={() => {
                setValues(initialFilters);
                setPage(1);
              }}
            >
              Limpar filtros
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {!result.error && lastPage > 1 && (
        <Pagination className="flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8125rem] text-muted-foreground">
            Página {page} de {lastPage}
          </p>
          <PaginationContent className="gap-2">
            {page > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Página anterior"
                  onClick={(e) => goToPage(e, page - 1)}
                  className={cn(pageLinkClass, "bg-card")}
                >
                  <ChevronLeft />
                </PaginationLink>
              </PaginationItem>
            )}
            {pageNumbers(page, lastPage).map((number) => (
              <PaginationItem key={number}>
                <PaginationLink
                  href="#"
                  isActive={number === page}
                  onClick={(e) => goToPage(e, number)}
                  className={cn(pageLinkClass, number !== page && "bg-card")}
                >
                  {number}
                </PaginationLink>
              </PaginationItem>
            ))}
            {page < lastPage && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label="Próxima página"
                  onClick={(e) => goToPage(e, page + 1)}
                  className={cn(pageLinkClass, "bg-card")}
                >
                  <ChevronRight />
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
