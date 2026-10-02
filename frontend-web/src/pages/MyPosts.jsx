import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/api/axios";
import PostCard from "@/components/PostCard";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/my-posts")
      .then((res) => {
        // res.data é direto um array
        setPosts(res.data || []);
      })
      .catch(() => toast.error("Erro ao carregar seus anúncios."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Anúncios</h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando seus anúncios...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Você ainda não criou nenhum anúncio.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            // Ativamos a flag showStatus para exibir se está aprovado, pendente, etc.
            <PostCard key={post.id} post={post} showStatus={true} />
          ))}
        </div>
      )}
    </div>
  );
}