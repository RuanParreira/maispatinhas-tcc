import { MapPin, Calendar, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post, showStatus = false }) {
    // cores e rotulos
    const typeBadges = {
    adoption: { label: "Adoção", variant: "success" },
    lost: { label: "Perdido", variant: "destructive" },
    found: { label: "Encontrado", variant: "info" },
  };

  // Rótulos para o status de moderação
  const statusLabels = {
    draft: "Rascunho",
    pending_approval: "Aguardando Aprovação",
    active: "Ativo / Publicado",
    rejected: "Rejeitado",
    paused: "Pausado",
  };

  const badge = typeBadges[post.type] || { label: post.type, variant: "muted" };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:shadow-md">
      <div>
        {/* Cabeçalho do Card: Tipo do anúncio e Status (se aplicável) */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          {showStatus && (
            <Badge variant="warning">
              {statusLabels[post.status] || post.status}
            </Badge>
          )}
        </div>
        {/* Título e Descrição */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{post.title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.description}</p>
        {/* Informações do Animal */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <PawPrint className="size-3.5 text-gray-400" />
            {post.animal?.name || "Sem nome"} ({post.animal?.breed})
          </span>
          <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            Porte {post.animal?.size}
          </span>
          <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {post.animal?.sex === "male" ? "Macho" : "Fêmea"}
          </span>
        </div>
      </div>
      {/* Rodapé: Cidade e Data */}
      <div className="mt-5 border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1 text-gray-600 font-medium">
          <MapPin className="size-3.5 text-amber-500" />
          {post.municipality?.name} - {post.municipality?.state}
        </span>
        {post.occurred_at && (
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {new Date(post.occurred_at).toLocaleDateString("pt-BR")}
          </span>
        )}
      </div>
    </div>
  );
}