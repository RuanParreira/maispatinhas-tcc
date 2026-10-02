import { ArrowUpRight, Heart, Mail, MapPin, PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const columns = [
  {
    title: "Explorar",
    links: [
      { label: "Quero adotar", to: "/adoptions" },
      { label: "Pets perdidos", to: "/lost" },
      { label: "Pets encontrados", to: "/found" },
      { label: "Como funciona", href: "#como-funciona" },
    ],
  },
  {
    title: "Sua conta",
    links: [
      { label: "Entrar", to: "/login" },
      { label: "Criar conta", to: "/register" },
      { label: "Publicar um anúncio", to: "/my-posts" },
      { label: "Mensagens", to: "/messages" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre nós", href: "#sobre" },
      { label: "Adoção responsável", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Privacidade", href: "#" },
    ],
  },
];

const linkClass =
  "text-background/70 transition-colors outline-none hover:text-background focus-visible:text-background focus-visible:underline";

export default function HomeFooter() {
  return (
    <footer
      id="sobre"
      className="relative overflow-hidden bg-foreground text-background"
    >
      <PawPrint
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-20 size-96 -rotate-12 text-background/4"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-16 pb-8 lg:px-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] lg:gap-20">
          <div className="max-w-md">
            <Link
              to="/home"
              onClick={() => window.scrollTo({ top: 0 })}
              className="inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-background">
                <img src={logo} alt="" className="size-8" />
              </span>
              <span className="font-heading text-2xl">Mais Patinhas</span>
            </Link>
            <p className="mt-5 font-heading text-3xl leading-tight">
              Feito para aproximar histórias que{" "}
              <em className="text-primary">precisam se encontrar.</em>
            </p>
            <p className="mt-4 text-background/70">
              Uma rede de afeto e compromisso com o bem-estar animal, conectando
              famílias a pets que esperam por um lar.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5 text-[0.8125rem] text-background/70">
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 text-primary" />
                Igarapava, SP · Brasil
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary" />
                contato@maispatinhas.com.br
              </li>
            </ul>
          </div>

          <nav
            aria-label="Rodapé"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-label font-semibold text-primary uppercase">
                  {column.title}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className={linkClass}>
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl bg-background/6 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-heading text-2xl leading-tight">
              Tem um pet precisando de um lar?
            </p>
            <p className="mt-1 text-[0.8125rem] text-background/70">
              Publique um anúncio gratuito e alcance famílias da sua região.
            </p>
          </div>
          <Link
            to="/my-posts"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-xs transition-colors outline-none hover:bg-primary/85 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Publicar anúncio
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-background/12 pt-6 text-xs text-background/60">
          <p>© 2026 Mais Patinhas. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Feito com
            <Heart className="size-3.5 fill-primary text-primary" />
            empatia e responsabilidade.
          </p>
        </div>
      </div>
    </footer>
  );
}
