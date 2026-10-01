import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const links = [
  { label: "Adote", to: "/adoptions" },
  { label: "Perdidos", to: "/lost" },
  { label: "Encontrados", to: "/found" },
  { label: "Como funciona", to: "#como-funciona" },
  { label: "Sobre nós", to: "#sobre" },
];

export default function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 shadow-[0_1px_8px_rgb(0_0_0/0.04)] backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-12">
        <Link
          to="/home"
          onClick={() => window.scrollTo({ top: 0 })}
          className="flex items-center gap-3"
        >
          <img src={logo} alt="" className="size-9" />
          <span className="font-heading text-xl whitespace-nowrap">
            Mais Patinhas
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) =>
            link.to.startsWith("#") ? (
              <a
                key={link.label}
                href={link.to}
                className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
          <Button
            asChild
            className="h-11 rounded-xl px-5 text-base font-semibold shadow-xs"
          >
            <Link to="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
