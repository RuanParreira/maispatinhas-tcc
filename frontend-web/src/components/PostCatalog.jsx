import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Navigation,
  PawPrint,
  SlidersHorizontal,
  X,
} from "lucide-react";
import api from "@/api/axios";
import { fetchMunicipalities } from "@/lib/municipalities";
import { useAuth } from "@/auth/useAuth";
import { cn } from "@/lib/utils";
import CityCombobox from "@/components/auth/CityCombobox";
import PetCard from "@/components/PetCard";
import { PetCardSkeletonGrid } from "@/components/PetCardSkeleton";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const radiusOptions = [
  { value: "0", label: "Só a cidade" },
  { value: "50", label: "Até 50 km" },
  { value: "100", label: "Até 100 km" },
  { value: "200", label: "Até 200 km" },
  { value: "all", label: "Sem limite" },
];

const initialFilters = {
  radius: "all",
  species: "all",
  ageGroup: "all",
  size: "all",
  sex: "all",
};

// Constante: um array novo a cada render refaria a busca em loop.
const adoptionTypes = ["adoption"];

const pageLinkClass = "size-10 rounded-xl font-semibold shadow-xs";
const visiblePages = 5;

function pageNumbers(current, last) {
  const first = Math.max(
    1,
    Math.min(current - Math.floor(visiblePages / 2), last - visiblePages + 1),
  );
  const count = Math.min(visiblePages, last);
  return Array.from({ length: count }, (_, index) => first + index);
}

// Idade, porte e sexo ficam num painel: são menos usados que a espécie e assim o filtro cabe numa linha.
function PetFilters({ values, onChange, onClear }) {
  const activeCount = filters.filter(({ key }) => values[key] !== "all").length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className={cn(
            "h-11 gap-2 rounded-xl px-4 font-medium",
            activeCount > 0 && "bg-primary/15 text-warning hover:bg-primary/20",
          )}
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-4">
        <div className="flex flex-col gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {filter.label}
              </p>
              <ToggleGroup
                type="single"
                variant="solid"
                spacing={1}
                aria-label={filter.label}
                value={values[filter.key]}
                onValueChange={(value) => value && onChange(filter.key, value)}
                className="w-fit rounded-xl bg-secondary/50 p-1"
              >
                {filter.options.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="h-8 px-3 text-muted-foreground hover:bg-transparent"
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          ))}
          <div className="flex justify-end border-t border-border/50 pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={activeCount === 0}
              onClick={onClear}
            >
              <X />
              Limpar filtros
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const urlKeys = {
  radius: "radius",
  species: "species",
  ageGroup: "age",
  size: "size",
  sex: "sex",
};

const allowedValues = {
  radius: radiusOptions.map(({ value }) => value),
  species: [...speciesOptions, ...otherSpeciesOptions].map(
    ({ value }) => value,
  ),
  ...Object.fromEntries(
    filters.map(({ key, options }) => [key, options.map(({ value }) => value)]),
  ),
};

const sortOptions = ["distance", "recent"];

/**
 * Os filtros moram na URL: voltar de um anúncio, recarregar ou compartilhar o link mantém a busca.
 * Sem `city`, vale a cidade padrão da tela; `city=all` é o Brasil inteiro. Valor desconhecido vira o padrão.
 */
function readUrl(searchParams, defaultCity, defaults) {
  const cityParam = searchParams.get("city");
  const cityCode = Number(cityParam);
  const sort = searchParams.get("sort");

  return {
    city:
      cityParam === "all"
        ? ""
        : Number.isInteger(cityCode) && cityCode > 0
          ? cityCode
          : defaultCity,
    values: Object.fromEntries(
      Object.entries(urlKeys).map(([key, param]) => {
        const value = searchParams.get(param);
        return [
          key,
          allowedValues[key].includes(value) ? value : defaults[key],
        ];
      }),
    ),
    sort: sortOptions.includes(sort) ? sort : "distance",
    page: Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1),
  };
}

function toQueryParams(types, status, values, city, sort, page) {
  const params = { type: types, sort, page };
  if (city) params.near = city;
  if (city && values.radius !== "all") params.radius = values.radius;
  if (status) params.status = status;
  if (values.species !== "all") params.species = values.species;
  if (values.size !== "all") params.size = values.size;
  if (values.sex !== "all") params.sex = values.sex;
  if (values.ageGroup !== "all") params.age_group = values.ageGroup;
  return params;
}

/**
 * Catálogo público por região, com filtros e paginação. `types` e `status` definem o recorte
 * (adoção, pets perdidos, reencontros); `header` entra antes da cidade, na linha da região.
 * Começa na cidade do usuário, sem limite de distância e com os mais perto primeiro (`defaultRadius` muda o raio inicial; `nationwide` começa sem cidade). `cityOnly` deixa só a cidade (sem distância),
 * para telas em que porte, idade e ordem não ajudam.
 * Cidade inexistente na URL (link editado à mão) vale como a cidade padrão, em vez de virar erro.
 * Sem cidade, ou só na cidade, todos estão à mesma distância: a ordem vira "Mais recentes".
 */
export default function PostCatalog({
  types = adoptionTypes,
  status,
  label = "para adoção",
  header,
  cityOnly = false,
  nationwide = false,
  defaultRadius = initialFilters.radius,
}) {
  const { user } = useAuth();
  const defaultCity = nationwide ? "" : (user?.municipality_id ?? "");
  const defaults = useMemo(
    () => ({ ...initialFilters, radius: defaultRadius }),
    [defaultRadius],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [municipalities, setMunicipalities] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: null, posts: [], meta: null });

  const {
    city: urlCity,
    values,
    sort,
    page,
  } = useMemo(() => {
    const filters = readUrl(searchParams, defaultCity, defaults);
    return cityOnly
      ? { ...filters, values: { ...filters.values, radius: "0" } }
      : filters;
  }, [searchParams, defaultCity, defaults, cityOnly]);

  const isUnknownCity =
    Boolean(urlCity) &&
    municipalities?.length > 0 &&
    !municipalities.some((municipality) => municipality.ibge_code === urlCity);
  const city = isUnknownCity ? defaultCity : urlCity;

  // Valor igual ao padrão sai da URL; qualquer mudança que não seja de página volta para a 1.
  function updateUrl(changes) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([param, value]) =>
          value === null ? next.delete(param) : next.set(param, value),
        );
        if (!("page" in changes)) next.delete("page");
        return next;
      },
      { replace: true },
    );
  }

  function changeCity(value) {
    updateUrl({
      city: value === defaultCity ? null : value === "" ? "all" : String(value),
    });
  }

  useEffect(() => {
    fetchMunicipalities()
      .then(setMunicipalities)
      .catch(() => setMunicipalities([]));
  }, []);

  const cityName = municipalities?.find(
    (municipality) => municipality.ibge_code === city,
  );
  const isLimitedByDistance =
    Boolean(city && cityName) && values.radius !== "all";
  const distanceText =
    values.radius === "0"
      ? `em ${cityName?.name}`
      : `até ${values.radius} km de ${cityName?.name}`;
  const emptyMessage = isLimitedByDistance
    ? cityOnly
      ? `Nenhum reencontro ${distanceText} ainda. Tente outra cidade.`
      : `Nenhum pet ${distanceText}. Aumente a distância ou ajuste os filtros.`
    : cityOnly
      ? "Tente outra cidade."
      : "Tente ajustar os filtros ou escolher outra cidade.";

  const canSortByDistance = Boolean(city) && values.radius !== "0";
  const effectiveSort = canSortByDistance ? sort : "recent";
  const regionText = isLimitedByDistance
    ? distanceText
    : cityName && effectiveSort === "distance"
      ? `mais perto de ${cityName.name} primeiro`
      : "";

  const params = useMemo(
    () => toQueryParams(types, status, values, city, effectiveSort, page),
    [types, status, values, city, effectiveSort, page],
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
    updateUrl({ [urlKeys[key]]: value === defaults[key] ? null : value });
  }

  function clearFilters(keys) {
    updateUrl(Object.fromEntries(keys.map((key) => [urlKeys[key], null])));
  }

  // Volta ao padrão da tela: cidade, distância e nenhum filtro.
  function resetSearch() {
    updateUrl({
      city: null,
      sort: null,
      ...Object.fromEntries(
        Object.values(urlKeys).map((param) => [param, null]),
      ),
    });
  }

  function changeSort(value) {
    updateUrl({ sort: value === "distance" ? null : value });
  }

  function goToPage(event, target) {
    event.preventDefault();
    updateUrl({ page: target === 1 ? null : String(target) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pets = result.posts;
  const total = result.meta?.total ?? 0;
  const lastPage = result.meta?.last_page ?? 1;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card p-3 shadow-xs sm:p-4">
        {header}
        <div className="min-w-56 flex-1 [&_[data-slot=input-group]]:h-11">
          {municipalities ? (
            <CityCombobox
              key={city}
              id="catalog-city"
              ariaLabel="Cidade"
              placeholder={
                nationwide
                  ? "Todo o Brasil. Digite uma cidade para filtrar"
                  : "Digite uma cidade para ver os pets por perto"
              }
              municipalities={municipalities}
              value={city}
              initialLabel={
                cityName ? `${cityName.name} - ${cityName.state}` : ""
              }
              clearOnEdit={false}
              onChange={changeCity}
            />
          ) : (
            <Skeleton className="h-11 w-full rounded-xl" />
          )}
        </div>

        {!cityOnly && (
          <Select
            value={values.radius}
            onValueChange={(value) => setFilter("radius", value)}
            disabled={!city}
          >
            <SelectTrigger
              aria-label="Distância"
              size="lg"
              variant="filled"
              className="w-44 font-medium *:data-[slot=select-value]:flex-1"
            >
              <Navigation className="size-4 text-warning" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-44">
              {radiusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!cityOnly && (
          <>
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
                <SelectContent
                  position="popper"
                  align="end"
                  className="min-w-40"
                >
                  {otherSpeciesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <PetFilters
              values={values}
              onChange={setFilter}
              onClear={() => clearFilters(filters.map(({ key }) => key))}
            />
          </>
        )}
      </div>

      <div className="-mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[0.8125rem] text-muted-foreground">
        {result.meta ? (
          <p>
            <span className="font-semibold text-foreground">
              {total} {total === 1 ? "pet" : "pets"}
            </span>{" "}
            {label}
            {regionText && ` · ${regionText}`}
          </p>
        ) : (
          <Skeleton className={cn("h-4 w-40", result.error && "invisible")} />
        )}
        {!cityOnly && (
          <Select
            value={effectiveSort}
            onValueChange={changeSort}
            disabled={!canSortByDistance}
          >
            <SelectTrigger
              aria-label="Ordenar por"
              className="h-8 gap-2 border-transparent px-2 text-[0.8125rem]"
            >
              <span className="text-muted-foreground">Ordenar:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-40">
              <SelectItem value="distance">Mais próximos</SelectItem>
              <SelectItem value="recent">Mais recentes</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {loading && pets.length === 0 ? (
        <PetCardSkeletonGrid label="Carregando pets" />
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
            <EmptyDescription>{emptyMessage}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {isLimitedByDistance && !cityOnly && (
              <Button
                variant="default"
                size="md"
                onClick={() => setFilter("radius", "all")}
              >
                Ver mais longe
              </Button>
            )}
            <Button variant="secondary" size="md" onClick={resetSearch}>
              {cityOnly ? "Ver todo o Brasil" : "Limpar filtros"}
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
