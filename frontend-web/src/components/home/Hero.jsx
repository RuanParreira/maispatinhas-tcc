import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/home/hero.jpg";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-12 pb-12 lg:px-12 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:pr-8">
          <h1 className="max-w-xl text-5xl tracking-tight sm:text-hero">
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
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-secondary shadow-xl lg:col-span-5">
          <img
            src={heroImage}
            alt="Mulher abraçando o cachorro adotado"
            className="h-[420px] w-full object-cover object-[center_80%] lg:h-[593px]"
          />
        </div>
      </div>
    </section>
  );
}
