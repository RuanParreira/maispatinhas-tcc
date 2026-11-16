import { useId } from "react";
import { cn } from "@/lib/utils";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * Escolha única entre poucas opções, exibida como botões lado a lado.
 * Sem label visível, passe ariaLabel para leitores de tela.
 */
export function ChoiceField({
  label,
  ariaLabel,
  options,
  icons = {},
  hint,
  value,
  onChange,
  error,
}) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <FieldLabel id={labelId} className="text-xs tracking-wide">
          {label}
        </FieldLabel>
      )}
      <ToggleGroup
        type="single"
        spacing={2}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        value={value}
        onValueChange={(next) => next && onChange(next)}
        className="flex-wrap"
      >
        {Object.entries(options).map(([optionValue, optionLabel]) => {
          const Icon = icons[optionValue];

          return (
            <ToggleGroupItem
              key={optionValue}
              value={optionValue}
              className={cn(
                "h-10 gap-2 rounded-xl border border-border/80 bg-card px-4 text-muted-foreground shadow-xs hover:border-primary/60 hover:bg-card hover:text-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                error && "border-destructive/60",
              )}
            >
              {Icon && <Icon className="size-4.5" />}
              {optionLabel}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
      {error ? (
        <FieldError className="text-xs">{error}</FieldError>
      ) : (
        hint && <FieldDescription className="text-xs">{hint}</FieldDescription>
      )}
    </div>
  );
}
