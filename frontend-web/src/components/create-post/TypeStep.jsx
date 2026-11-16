import { Check, Heart, MapPin, ScanSearch } from "lucide-react";
import { FieldError } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const typeOptions = [
  {
    value: "adoption",
    icon: Heart,
    title: "Doação para adoção",
    description: "Você cuida do pet e procura um novo lar para ele.",
  },
  {
    value: "lost",
    icon: MapPin,
    title: "Perdi meu pet",
    description: "Seu companheiro sumiu e você quer ajuda para encontrá-lo.",
  },
  {
    value: "found",
    icon: ScanSearch,
    title: "Encontrei um pet",
    description: "Você achou um animal e procura o tutor dele.",
  },
];

export default function TypeStep({ form, update, errors }) {
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        type="single"
        spacing={3}
        aria-label="Tipo do anúncio"
        value={form.type}
        onValueChange={(value) => value && update("type", value)}
        className="grid w-full gap-3 md:grid-cols-3"
      >
        {typeOptions.map(({ value, icon: Icon, title, description }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="group relative h-auto flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 text-left whitespace-normal hover:border-primary/50 hover:bg-card data-[state=on]:border-primary data-[state=on]:bg-primary/10"
          >
            <span className="absolute top-4 right-4 flex size-6 scale-50 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-warning group-data-[state=on]:bg-primary group-data-[state=on]:text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <span className="text-base font-semibold">{title}</span>
            <span className="text-[0.8125rem] leading-5 font-normal text-muted-foreground">
              {description}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {errors.type && (
        <FieldError className="text-xs">{errors.type}</FieldError>
      )}
    </div>
  );
}
