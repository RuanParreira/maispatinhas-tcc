import logo from "@/assets/logo.png";

const links = [
  "Sobre nós",
  "Como funciona",
  "Adoção responsável",
  "Termos",
  "Privacidade",
  "Contato",
  "Redes sociais",
];

export default function HomeFooter() {
  return (
    <footer id="sobre" className="border-t border-border/60 bg-card py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 lg:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="size-9" />
              <span className="font-heading text-xl">Mais Patinhas</span>
            </div>
            <p className="mt-4 text-muted-foreground">
              Feito para aproximar histórias que precisam se encontrar.
            </p>
          </div>

          <nav className="flex max-w-3xl flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link}
                href={link === "Como funciona" ? "#como-funciona" : "#"}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-8 text-xs font-semibold tracking-wide text-muted-foreground">
          <p>
            © 2026 Mais Patinhas. Plataforma dedicada ao bem-estar e resgate
            animal.
          </p>
          <p>Feito com empatia e responsabilidade.</p>
        </div>
      </div>
    </footer>
  );
}
