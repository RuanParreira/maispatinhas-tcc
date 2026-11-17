import { useState } from "react";
import { Check, Heart, MapPin, ScanSearch, Search } from "lucide-react";
import { FieldError } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const categoryOptions = [
  {
    value: "adoption",
    icon: Heart,
    title: "Doação para adoção",
    description: "Você cuida do pet e procura um novo lar para ele.",
  },
  {
    value: "missing",
    icon: MapPin,
    title: "Pet perdido ou achado",
    description: "Um pet sumiu ou você achou um animal que parece ter tutor.",
  },
];

// Quem acha o animal não sabe se ele tem dono: o texto descreve o que a pessoa viu, sem afirmar.
const missingOptions = [
  {
    value: "lost",
    icon: Search,
    title: "Meu pet sumiu",
    description: "Você é o tutor e quer ajuda para encontrá-lo.",
  },
  {
    value: "found",
    icon: ScanSearch,
    title: "Encontrei um animal que parece ter tutor",
    description:
      "Está de coleira, é manso ou parece bem cuidado? Publique para o tutor encontrar.",
  },
];

const cardClass =
  "group relative h-auto flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 text-left whitespace-normal hover:border-primary/50 hover:bg-card data-[state=on]:border-primary data-[state=on]:bg-primary/10";

function OptionCard({ value, icon: Icon, title, description, compact }) {
  return (
    <ToggleGroupItem
      value={value}
      className={cn(
        cardClass,
        compact && "flex-row items-center justify-start gap-4 p-4",
      )}
    >
      <span className="absolute top-4 right-4 flex size-6 scale-50 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-warning group-data-[state=on]:bg-primary group-data-[state=on]:text-primary-foreground">
        <Icon className="size-5" />
      </span>
      <span className={cn("flex flex-col gap-1", compact && "pr-8")}>
        <span className="text-base font-semibold">{title}</span>
        <span className="text-[0.8125rem] leading-5 font-normal text-muted-foreground">
          {description}
        </span>
      </span>
    </ToggleGroupItem>
  );
}

/**
 * Para o usuário são dois tipos: doação e pet perdido. Perdido e encontrado só se
 * separam na segunda pergunta, porque o formulário e a finalização de cada um mudam.
 */
export default function TypeStep({ form, update, errors }) {
  const [category, setCategory] = useState(
    form.type === "adoption" ? "adoption" : form.type ? "missing" : "",
  );

  function chooseCategory(value) {
    if (!value) return;
    setCategory(value);
    if (value === "adoption") {
      update("type", "adoption");
    } else if (form.type === "adoption") {
      update("type", "");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <ToggleGroup
        type="single"
        spacing={3}
        aria-label="Tipo do anúncio"
        value={category}
        onValueChange={chooseCategory}
        className="grid w-full gap-3 md:grid-cols-2"
      >
        {categoryOptions.map((option) => (
          <OptionCard key={option.value} {...option} />
        ))}
      </ToggleGroup>

      {category === "missing" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">
            Você é o tutor ou encontrou o animal?
          </p>
          <ToggleGroup
            type="single"
            spacing={3}
            aria-label="Situação do pet"
            value={form.type === "adoption" ? "" : form.type}
            onValueChange={(value) => value && update("type", value)}
            className="grid w-full gap-3 md:grid-cols-2"
          >
            {missingOptions.map((option) => (
              <OptionCard key={option.value} {...option} compact />
            ))}
          </ToggleGroup>
        </div>
      )}

      {errors.type && (
        <FieldError className="text-xs">{errors.type}</FieldError>
      )}
    </div>
  );
}
