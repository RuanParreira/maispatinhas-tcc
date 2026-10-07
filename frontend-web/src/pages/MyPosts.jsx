import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PawPrint, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
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

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    api.get("/api/my-posts")
      .then((res) => {
        setPosts(res.data.data);
      })
      .catch(() => toast.error("Erro ao carregar seus anúncios."))
      .finally(() => setLoading(false));
  }, []);

  // Filtra por busca de texto e por status
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        post.animal?.name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Barra de Filtros e Ação (Mesmo card do topo de Adoptions) */}
      <div className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-xs sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Campo de Busca */}
            <InputGroup className="h-11 min-w-60 flex-1">
              <InputGroupInput
                type="search"
                aria-label="Buscar meus anúncios"
                placeholder="Busque por título, descrição ou nome do pet"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-4"
              />
              <InputGroupAddon className="pl-4">
                <Search className="size-4.5 text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            {/* Filtro por Status da Moderação */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 min-w-44 gap-2 rounded-xl border-transparent bg-secondary/50 px-4 text-sm">
                <span className="text-muted-foreground">Status:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo / Publicado</SelectItem>
                <SelectItem value="pending_approval">Aguardando Moderação</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão para Novo Anúncio */}
          <Button asChild className="h-11 gap-2 rounded-xl px-4">
            <Link to="/posts/create">
              <Plus className="size-4" />
              Criar Anúncio
            </Link>
          </Button>
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between text-[0.8125rem] text-muted-foreground">
          <p>
            Exibindo{" "}
            <span className="font-semibold text-foreground">
              {filteredPosts.length}
            </span>{" "}
            {filteredPosts.length === 1 ? "anúncio" : "anúncios"}
          </p>
        </div>
      </div>

      {/* Grid de Cards ou Empty State */}
      {loading ? (
        <div className="flex justify-center py-16 text-muted-foreground">
          Carregando seus anúncios...
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty State idêntico ao de Adoptions */
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-16 text-center shadow-xs">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-warning">
            <PawPrint className="size-5" />
          </span>
          <h3 className="text-2xl font-bold">Nenhum anúncio encontrado</h3>
          <p className="max-w-sm text-muted-foreground text-sm">
            {posts.length === 0
              ? "Você ainda não criou nenhum anúncio. Que tal cadastrar seu primeiro pet agora?"
              : "Nenhum anúncio corresponde aos filtros selecionados."}
          </p>
          {posts.length === 0 && (
            <Button asChild className="mt-2 h-10 px-4">
              <Link to="/posts/create">Criar meu primeiro anúncio</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}