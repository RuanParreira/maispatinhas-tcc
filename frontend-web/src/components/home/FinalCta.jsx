import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-24 lg:px-12">
      <div className="mx-auto flex max-w-232 flex-col items-center gap-4 rounded-3xl bg-secondary px-6 py-14 text-center shadow-md sm:px-16">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary shadow-xs">
          <Heart className="size-5 fill-current" />
        </span>
        <h2 className="mt-2 text-section tracking-tight">
          Todo pet merece um lugar para chamar de lar.
        </h2>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
          A adoção responsável salva vidas e transforma lares. Cadastre-se na
          nossa rede de proteção e faça parte dessa corrente de afeto.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="xl">
            <Link to="/adoptions">Encontrar um pet</Link>
          </Button>
          <Button
            asChild
            size="xl"
            variant="outline"
            className="border-transparent bg-card hover:bg-background"
          >
            <Link to="/my-posts">Publicar um anúncio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
