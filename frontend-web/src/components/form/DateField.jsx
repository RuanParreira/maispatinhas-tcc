import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { ptBR } from "react-day-picker/locale";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/lib/date";
import { IconField } from "@/components/form/IconField";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Campo de data com o calendário do sistema. Recebe e devolve AAAA-MM-DD,
 * o mesmo formato do input nativo.
 */
export function DateField({
  id,
  label,
  value,
  onChange,
  max,
  placeholder = "Selecione a data",
  error,
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00`) : undefined;

  function select(date) {
    onChange(date ? toDateInputValue(date) : "");
    setOpen(false);
  }

  return (
    <IconField id={id} label={label} icon={CalendarDays} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            data-slot="input-group-control"
            aria-invalid={Boolean(error)}
            className={cn(
              "absolute inset-0 cursor-pointer rounded-xl pr-4 pl-11 text-left text-body outline-none",
              !selected && "text-muted-foreground",
            )}
          >
            {selected ? selected.toLocaleDateString("pt-BR") : placeholder}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={ptBR}
            selected={selected}
            defaultMonth={selected}
            onSelect={select}
            disabled={max ? { after: max } : undefined}
            endMonth={max}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </IconField>
  );
}
