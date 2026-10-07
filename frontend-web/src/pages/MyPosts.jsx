import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint, Plus, Search } from "lucide-react";
import api from "@/api/axios";
import { postStatuses } from "@/lib/posts";
import { normalize } from "@/lib/text";
import PostCard from "@/components/PostCard";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const statusOptions = [
  { value: "all", label: "Todos" },
  ...Object.entries(postStatuses).map(([value, { label }]) => ({
    value,
    label,
  })),
];

const initialFilters = { search: "", status: "all" };

function EmptyState({ title, children, action }) {
  return (
    <Empty variant="card">
      <EmptyHeader>
        <EmptyMedia variant="brand">
          <PawPrint />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{children}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{action}</EmptyContent>
    </Empty>
  );
}

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [values, setValues] = useState(initialFilters);

  useEffect(() => {
    let ignore = false;

    api
      .get("/api/my-posts")
      .then(({ data }) => !ignore && setPosts(data.data))
      .catch(() => !ignore && setError(true))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function setFilter(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function retry() {
    setError(false);
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  const filteredPosts = useMemo(() => {
    const term = normalize(values.search);

    return posts.filter(
      (post) =>
        (values.status === "all" || post.status === values.status) &&
        normalize(
          `${post.title} ${post.description} ${post.animal?.name ?? ""}`,
        ).includes(term),
    );
  }, [posts, values]);

  function renderContent() {
    if (loading) {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-96 rounded-2xl" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState
          title="Não foi possível carregar"
          action={
            <Button variant="secondary" size="md" onClick={retry}>
              Tentar de novo
            </Button>
          }
        >
          Verifique sua conexão e tente novamente.
        </EmptyState>
      );
    }

    if (posts.length === 0) {
      return (
        <EmptyState
          title="Nenhum anúncio ainda"
          action={
            <Button asChild size="md">
              <Link to="/posts/create">Criar meu primeiro anúncio</Link>
            </Button>
          }
        >
          Você ainda não criou nenhum anúncio. Que tal cadastrar seu primeiro
          pet agora?
        </EmptyState>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <EmptyState
          title="Nenhum anúncio encontrado"
          action={
            <Button
              variant="secondary"
              size="md"
              onClick={() => setValues(initialFilters)}
            >
              Limpar filtros
            </Button>
          }
        >
          Nenhum anúncio corresponde aos filtros selecionados.
        </EmptyState>
      );
    }

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <InputGroup className="h-11 min-w-60 flex-1">
              <InputGroupInput
                type="search"
                aria-label="Buscar meus anúncios"
                placeholder="Busque por título, descrição ou nome do pet"
                value={values.search}
                onChange={(e) => setFilter("search", e.target.value)}
                className="pr-4 text-body md:text-body"
              />
              <InputGroupAddon className="pl-4">
                <Search className="size-4.5" />
              </InputGroupAddon>
            </InputGroup>

            <Select
              value={values.status}
              onValueChange={(value) => setFilter("status", value)}
            >
              <SelectTrigger
                aria-label="Status"
                size="lg"
                variant="filled"
              >
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start" className="min-w-40">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button asChild size="toolbar">
            <Link to="/posts/create">
              <Plus className="size-4" />
              Criar anúncio
            </Link>
          </Button>
        </div>

        {!loading && !error && (
          <p className="text-[0.8125rem] text-muted-foreground">
            Exibindo{" "}
            <span className="font-semibold text-foreground">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "anúncio" : "anúncios"}
            </span>
          </p>
        )}
      </div>

      {renderContent()}
    </div>
  );
}
