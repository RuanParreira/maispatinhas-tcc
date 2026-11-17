import { toast } from "sonner";
import api from "@/api/axios";
import { emptyPostForm, postFormData } from "@/lib/postForm";
import PostWizard from "@/components/create-post/PostWizard";

export default function CreatePost() {
  async function create(form) {
    await api.post("/api/my-posts", postFormData(form));
    toast.success("Anúncio enviado! Ele aparece para todos após a moderação.");
  }

  return <PostWizard initialForm={emptyPostForm} onSubmit={create} />;
}
