import {
  ArrowRight,
  Heart,
  Home,
  LocateFixed,
  MapPin,
  NotebookPen,
  PawPrint,
} from "lucide-react";
import { Link } from "react-router-dom";
import thorImage from "@/assets/pets/thor.jpg";
import HomeFooter from "@/components/home/HomeFooter";
import HomeHeader from "@/components/home/HomeHeader";
import { Button } from "@/components/ui/button";
import { mockPets } from "@/data/mockPets";

const destinations = [
  {
    title: "Quero adotar",
    description:
      "Conheça cães, gatos e outros pets que aguardam uma família amorosa.",
    action: "Explorar pets",
    to: "/adoptions",
    icon: Heart,
  },
  {
    title: "Pets perdidos",
    description:
      "Veja os alertas da sua região e ajude um tutor a reencontrar seu companheiro.",
    action: "Ver perdidos",
    to: "/lost",
    icon: MapPin,
  },
  {
    title: "Pets encontrados",
    description:
      "Animais encontrados na rua, cuidados por alguém até o tutor aparecer.",
    action: "Ver encontrados",
    to: "/found",
    icon: LocateFixed,
  },
  {
    title: "Divulgar um pet",
    description:
      "Cadastre um animal para adoção responsável ou registre um pet avistado.",
    action: "Meus anúncios",
    to: "/my-posts",
    icon: NotebookPen,
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <HomeHeader />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-7xl px-6 pt-10 pb-16 lg:px-12 lg:pt-12 lg:pb-20">
          <p className="flex items-center justify-center gap-2 text-label font-semibold text-warning uppercase">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-foreground">Mais Patinhas</span>
            <span className="text-muted-foreground/60">/</span>
            Página não encontrada
          </p>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
            <div>
              <div className="flex items-center gap-4">
                <span className="font-heading text-7xl leading-none text-warning italic">
                  404
                </span>
                <div className="border-l border-border pl-4">
                  <p className="text-label font-semibold text-warning uppercase">
                    Trilha inexplorada
                  </p>
                  <p className="text-[0.8125rem] text-muted-foreground">
                    Parece que escapou de fininho...
                  </p>
                </div>
              </div>

              <h1 className="mt-6 max-w-2xl text-section tracking-tight lg:text-5xl lg:leading-[1.15]">
                Essa página deu uma voltinha pelo jardim e não voltou.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Assim como um pet curioso farejando novos cantos, o endereço que
                você tentou acessar não foi encontrado ou mudou de quintal. Não
                se preocupe: toda caminhada tem seu retorno.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="field">
                  <Link to="/home">
                    <Home data-icon="inline-start" />
                    Voltar para o início
                  </Link>
                </Button>
                <Button asChild size="field" variant="secondary">
                  <Link to="/adoptions">
                    <PawPrint data-icon="inline-start" />
                    Ver pets para adoção
                  </Link>
                </Button>
                <Link
                  to="/lost"
                  className="px-2 text-base font-semibold text-warning underline decoration-warning/40 underline-offset-4 transition-colors hover:decoration-warning"
                >
                  Perdidos e encontrados
                </Link>
              </div>
            </div>

            <figure className="relative rounded-3xl bg-card p-2 shadow-lg">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={thorImage}
                  alt="Cão de pelagem dourada passeando por uma trilha coberta de folhas"
                  className="aspect-4/5 w-full object-cover"
                />
                <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-label font-semibold uppercase backdrop-blur-xs">
                  <Heart className="size-3.5 text-warning" />
                  Thor passeando
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-5 pt-16 pb-5 text-white">
                  <p className="font-heading text-2xl leading-snug">
                    “Todo reencontro começa quando decidimos procurar com
                    calma.”
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-white/80">
                    Comunidade Mais Patinhas
                  </p>
                </figcaption>
              </div>
              <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-1 text-[0.8125rem]">
                <p>{mockPets.length} pets esperam um lar hoje</p>
                <p className="text-label font-semibold text-warning uppercase">
                  Ref: E404-PAW
                </p>
              </div>
              <span
                aria-hidden="true"
                className="absolute -bottom-5 -left-5 hidden size-14 items-center justify-center rounded-2xl bg-secondary text-warning shadow-xs sm:flex"
              >
                <PawPrint className="size-6" />
              </span>
            </figure>
          </div>
        </section>

        <section className="bg-secondary/40 py-16">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-label font-semibold text-warning uppercase">
                  Recalculando a rota
                </p>
                <h2 className="mt-2 text-section tracking-tight">
                  Talvez você estivesse procurando por:
                </h2>
              </div>
              <p className="max-w-sm text-muted-foreground">
                Escolha um destino abaixo ou navegue pelas áreas mais acessadas.
              </p>
            </div>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group flex h-full flex-col rounded-2xl bg-card p-6 shadow-xs transition-shadow outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-warning">
                      <item.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 text-2xl leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] leading-[1.625] text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-warning">
                      {item.action}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
