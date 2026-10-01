import { BookOpen, Home, MessagesSquare, Search } from "lucide-react";

const steps = [
  {
    title: "Encontre",
    description:
      "Encontre pets disponíveis para adoção perto de você com filtros específicos de porte, idade e espécie.",
    label: "Filtros geográficos",
    icon: Search,
  },
  {
    title: "Conheça",
    description:
      "Veja a história, temperamento, saúde e compatibilidade do animal antes de tomar uma decisão.",
    label: "Transparência clínica",
    icon: BookOpen,
  },
  {
    title: "Conecte-se",
    description:
      "Entre em contato seguro diretamente com quem está responsável pelo anúncio ou abrigo.",
    label: "Chat protegido",
    icon: MessagesSquare,
  },
  {
    title: "Dê um lar",
    description:
      "Assine o termo de adoção responsável e comece uma nova história de amor e companheirismo mútuo.",
    label: "Adoção oficial",
    icon: Home,
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-secondary/40 py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-label font-semibold text-warning uppercase">
            Passo a passo
          </p>
          <h2 className="mt-2 text-section tracking-tight">
            Um encontro pode mudar duas vidas.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Um processo transparente, seguro e guiado pelo respeito aos animais.
          </p>
        </div>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col rounded-2xl bg-card p-6 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-2xl text-warning">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon className="size-5 text-muted-foreground/60" />
              </div>
              <h3 className="mt-6 font-sans text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-[1.625] text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-auto pt-6">
                <p className="border-t border-border/50 pt-6 text-[0.6875rem] leading-4 font-semibold tracking-wide text-warning">
                  {step.label}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
