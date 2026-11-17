import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { formFromPost, postFormData } from "@/lib/postForm";
import PostWizard from "@/components/create-post/PostWizard";
import { Spinner } from "@/components/ui/spinner";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    let ignore = false;
    api
      .get(`/api/posts/${id}`)
      .then(({ data: { data: post } }) => {
        if (ignore) return;
        if (post.user?.id !== user?.id) {
          toast.error("Você só pode editar os seus anúncios.");
          navigate("/my-posts", { replace: true });
          return;
        }
        if (["resolved", "closed", "canceled"].includes(post.status)) {
          toast.error("Este anúncio foi finalizado e não pode ser editado.");
          navigate("/my-posts", { replace: true });
          return;
        }
        setInitialForm(formFromPost(post));
      })
      .catch(() => {
        if (ignore) return;
        toast.error("Não foi possível carregar o anúncio.");
        navigate("/my-posts", { replace: true });
      });
    return () => {
      ignore = true;
    };
  }, [id, user?.id, navigate]);

  async function save(form) {
    await api.post(`/api/my-posts/${id}`, postFormData(form, initialForm));
    toast.success(
      "Alterações salvas! Se o anúncio estava publicado, ele volta para a moderação.",
    );
  }

  if (!initialForm) {
    return (
      <div
        role="status"
        aria-label="Carregando anúncio"
        className="flex justify-center py-24 text-muted-foreground"
      >
        <Spinner className="size-6" />
      </div>
    );
  }

  return <PostWizard initialForm={initialForm} editing onSubmit={save} />;
}
