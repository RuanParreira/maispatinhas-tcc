import { useEffect, useState } from "react";
import api from "@/api/axios";
import PostCard from "@/components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/posts")
      .then((res) => {
        // res.data.data pois é paginado pelo Laravel
        setPosts(res.data.data || []);
      })
      .catch((err) => console.error("Erro ao carregar anúncios:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Encontre um amigo ou ajude um pet 🐾
      </h1>

      {loading ? (
        <p className="text-gray-500">Carregando anúncios...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Nenhum anúncio disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}