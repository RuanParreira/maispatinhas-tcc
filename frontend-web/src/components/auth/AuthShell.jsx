import { ArrowLeft, HandHeart, Heart, PawPrint, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const pillars = [
  { label: "Adoção responsável", icon: Heart },
  { label: "Perdidos e encontrados", icon: Search },
  { label: "Comunidade ativa", icon: Users },
];

export default function AuthShell({
  eyebrow,
  title,
  description,
  image,
  testimonial,
  showImpact = false,
  children,
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="bg-background/85 shadow-[0_1px_8px_rgb(0_0_0/0.04)] backdrop-blur-sm">
        <div className="mx-auto grid h-20 w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-12">
          <Link
            to="/home"
            className="group inline-flex items-center gap-2 justify-self-start text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Voltar para o início</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
          <Link to="/home" className="flex items-center gap-3">
            <img src={logo} alt="" className="size-9" />
            <span className="font-heading text-xl whitespace-nowrap">
              Mais Patinhas
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-stretch gap-10 px-6 py-10 lg:grid-cols-12 lg:px-12">
        <aside className="hidden flex-col gap-6 lg:col-span-5 lg:flex">
          <figure className="relative min-h-140 flex-1 overflow-hidden rounded-2xl shadow-lg">
            <img
              src={image}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-1.5 text-label font-semibold text-foreground uppercase shadow-xs backdrop-blur-sm">
              <PawPrint className="size-3.5 fill-current text-warning" />
              História real
            </span>

            <figcaption className="absolute inset-x-6 bottom-6 text-white">
              <blockquote className="font-heading text-[1.375rem] leading-snug italic">
                “{testimonial.quote}”
              </blockquote>
              <p className="mt-3 text-xs font-medium tracking-wider text-white/80 uppercase">
                {testimonial.author} — {testimonial.detail}
              </p>
            </figcaption>
          </figure>

          {showImpact && (
            <div className="rounded-2xl bg-card p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning">
                  <HandHeart className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-2xl leading-8">
                    +1.400 encontros
                  </p>
                  <p className="mt-1 text-[0.8125rem] leading-5 text-muted-foreground">
                    Viabilizados com carinho e compromisso com o bem-estar
                    animal.
                  </p>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {pillars.map((pillar) => (
                  <li
                    key={pillar.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-label font-semibold uppercase"
                  >
                    <pillar.icon className="size-3.5 text-warning" />
                    {pillar.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <section className="flex flex-col justify-center rounded-2xl bg-card p-6 shadow-xs sm:p-10 lg:col-span-7">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
            <div>
              <p className="flex items-center gap-2 text-label font-semibold text-warning uppercase">
                <span className="size-2 rounded-full bg-warning" />
                {eyebrow}
              </p>
              <h1 className="mt-2 text-4xl leading-tight tracking-tight">
                {title}
              </h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 lg:px-12">
          <p className="text-[0.8125rem] text-muted-foreground">
            © 2026 Mais Patinhas. Todos os direitos reservados.
          </p>
          <nav className="flex items-center gap-6 text-[0.8125rem] text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Termos de Uso
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Ajuda
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
