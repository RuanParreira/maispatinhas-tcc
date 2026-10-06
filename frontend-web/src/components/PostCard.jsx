import { ArrowRight, Calendar, MapPin, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post }) {
  // Configuração dos Badges de Tipo
  const typeConfig = {
    adoption: { label: "Adoção", variant: "success" },
    lost: { label: "Perdido", variant: "destructive" },
    found: { label: "Encontrado", variant: "info" },
  };

  // Configuração dos Badges de Status da Moderação
    const statusConfig = {
    draft: { label: "Rascunho", variant: "muted" },
    pending_approval: { label: "Aguardando Moderação", variant: "warning" },
    active: { label: "Ativo / Publicado", variant: "success" },
    rejected: { label: "Rejeitado", variant: "destructive" },
    paused: { label: "Pausado", variant: "secondary" },
    // Adicione a linha abaixo:
    resolved: { label: "Resolvido", variant: "muted" },
  };

    const speciesConfig = {
    dog: "Cachorro",
    cat: "Gato"
  };

  const type = typeConfig[post.type] || { label: post.type, variant: "muted" };
  const status = statusConfig[post.status] || { label: post.status, variant: "muted" };

  // Imagem enviada pelo backend (ou pega a primeira foto dos arquivos)
  const imageUrl = post.image_url || post.files?.[0]?.url;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-xs transition-shadow hover:shadow-md">
      {/* Imagem de Capa com Badges Flutuantes */}
      <div className="relative h-70 w-full overflow-hidden bg-secondary/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          // Placeholder elegante com patinha quando não houver foto enviada
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <PawPrint className="size-16" />
          </div>
        )}

        {/* Badge do Tipo (Canto Superior Esquerdo) */}
        <Badge
          variant={type.variant}
          className="absolute top-4 left-4 h-6 px-3 shadow-xs"
        >
          {type.label}
        </Badge>

        {/* Badge do Status da Moderação (Canto Superior Direito) */}
        <Badge
          variant={status.variant}
          className="absolute top-4 right-4 h-6 px-3 shadow-xs"
        >
          {status.label}
        </Badge>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl leading-7 font-bold text-foreground line-clamp-1">
            {post.title}
          </h3>
          <span className="text-xs font-medium tracking-wide text-warning shrink-0">
            {speciesConfig[post.animal?.species] || post.animal?.species || "Pet"}
          </span>
        </div>

        <p className="mt-2 flex items-center gap-1 text-[0.8125rem] leading-5 text-muted-foreground">
          <MapPin className="size-3.5" />
          {post.municipality?.name} - {post.municipality?.state}
        </p>

        <p className="mt-4 text-[0.8125rem] leading-5 text-muted-foreground line-clamp-2">
          {post.description}
        </p>

        {/* Rodapé com detalhes e link */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {new Date(post.created_at).toLocaleDateString("pt-BR")}
            </span>

            <Link
              to={`/posts/${post.id}`}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-warning hover:underline"
            >
              Ver detalhes
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}