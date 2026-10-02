import { ArrowRight, Heart, Home, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/home/hero.jpg";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-12 lg:px-12 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pr-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-label font-semibold text-muted-foreground uppercase shadow-xs">
            <span className="size-2 rounded-full bg-primary" />
            Rede nacional de adoção consciente
          </span>

          <h1 className="mt-6 max-w-xl text-5xl tracking-tight sm:text-hero">
            O lar que eles sempre esperaram.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Conectamos pets que precisam de um lar com pessoas dispostas a
            transformar uma vida.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="xl">
              <Link to="/adoptions">
                Encontrar um pet
                <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-transparent bg-card hover:bg-secondary"
            >
              <Link to="/my-posts">Quero anunciar um pet</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-border/60 pt-6">
            <div className="flex -space-x-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary shadow-xs">
                <Heart className="size-3.5 fill-current" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/70 shadow-xs">
                <PawPrint className="size-3.5 fill-current" />
              </span>
              <span className="flex size-8 items-center justify-center rounded-full bg-secondary shadow-xs">
                <Home className="size-3.5" />
              </span>
            </div>
            <p className="text-[0.8125rem] text-muted-foreground">
              Mais de{" "}
              <span className="text-foreground">1.400 encontros felizes</span>{" "}
              já realizados em todo o Brasil.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-secondary shadow-xl lg:col-span-5">
          <img
            src={heroImage}
            alt="Mulher abraçando o cachorro adotado"
            className="h-[420px] w-full object-cover object-[center_80%] lg:h-[593px]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-foreground/40 via-transparent to-transparent" />
          <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-xl bg-background/90 p-4 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="size-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-base leading-5 font-semibold">
                  Clara &amp; Pipoca
                </p>
                <p className="text-[0.6875rem] leading-4 font-semibold tracking-wide text-muted-foreground">
                  Adotado há 8 meses em SP
                </p>
              </div>
            </div>
            <Badge variant="warning">História Real</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
