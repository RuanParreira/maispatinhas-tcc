import { HandHeart, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import simbaImage from "@/assets/home/simba.jpg";
import cachorrinhoImage from "@/assets/home/cachorrinho.jpg";

const blocks = [
  {
    badge: "Alerta",
    badgeVariant: "destructive",
    title: "Pets perdidos",
    description:
      "Ajude a procurar animais desaparecidos recentemente em sua região.",
    icon: ShieldAlert,
    accentClass: "text-destructive",
    to: "/lost",
    action: "Ver todos os perdidos",
    preview: {
      name: "Simba (Gato)",
      place: "Desaparecido na Cidade Nova • Franca, SP",
      time: "Visto há 1 dia",
      image: simbaImage,
    },
  },
  {
    badge: "Resgate",
    badgeVariant: "default",
    title: "Pets encontrados",
    description:
      "Encontrou um pet perdido? Cadastre aqui para que o tutor o encontre.",
    icon: HandHeart,
    accentClass: "text-warning",
    to: "/found",
    action: "Ver todos os encontrados",
    preview: {
      name: "Cachorrinho sem coleira",
      place: "Encontrado na Vila Santa Cruz • Franca, SP",
      time: "Resgatado há 3 dias",
      image: cachorrinhoImage,
    },
  },
];

export default function LostFound() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-14 px-6 py-20 lg:px-12">
      <div className="max-w-2xl text-center">
        <p className="text-label font-semibold text-warning uppercase">
          Solidariedade e reencontro
        </p>
        <h2 className="mt-2 text-section tracking-tight text-balance">
          Algumas histórias precisam encontrar o caminho de volta.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Uma central de busca colaborativa para reunir famílias e animais
          desaparecidos.
        </p>
      </div>

      <div className="grid w-full gap-8 lg:grid-cols-2">
        {blocks.map((block) => (
          <article
            key={block.title}
            className="flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-xs sm:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant={block.badgeVariant}>{block.badge}</Badge>
                <h3 className="mt-3 text-2xl">{block.title}</h3>
                <p className="mt-1 max-w-md text-muted-foreground">
                  {block.description}
                </p>
              </div>
              <block.icon
                className={cn("size-9 shrink-0", block.accentClass)}
                strokeWidth={1.75}
              />
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
              <img
                src={block.preview.image}
                alt=""
                className="size-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="text-base leading-6 font-bold">
                  {block.preview.name}
                </p>
                <p className="text-sm leading-5 text-muted-foreground">
                  {block.preview.place}
                </p>
                <p
                  className={cn(
                    "mt-1 text-xs leading-4 font-bold tracking-wide",
                    block.accentClass,
                  )}
                >
                  {block.preview.time}
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="secondary"
              className="mt-auto h-11 w-full text-sm font-bold"
            >
              <Link to={block.to}>{block.action}</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
