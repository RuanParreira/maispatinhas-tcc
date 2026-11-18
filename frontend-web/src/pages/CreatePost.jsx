import { useMemo } from "react";
import { toast } from "sonner";
import api from "@/api/axios";
import { useAuth } from "@/auth/useAuth";
import { emptyPostForm, postFormData } from "@/lib/postForm";
import PostWizard from "@/components/create-post/PostWizard";

// A cidade já vem com a do cadastro: o pet costuma estar na cidade de quem anuncia, e dá para trocar.
export default function CreatePost() {
  const { user } = useAuth();
  const initialForm = useMemo(
    () => ({ ...emptyPostForm, municipality_id: user?.municipality_id ?? "" }),
    [user?.municipality_id],
  );

  async function create(form) {
    await api.post("/api/my-posts", postFormData(form));
    toast.success("Anúncio enviado! Ele aparece para todos após a moderação.");
  }

  return <PostWizard initialForm={initialForm} onSubmit={create} />;
}
