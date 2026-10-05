import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { normalize } from "@/lib/text";
import { IconField } from "@/components/form/IconField";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { InputGroupAddon } from "@/components/ui/input-group";

const MAX_RESULTS = 8;
const MIN_QUERY = 2;

// Campo de busca de município: filtra por nome (sem acento) e guarda o ibge_code.
export default function CityCombobox({
  id,
  label,
  error,
  municipalities,
  value,
  onChange,
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      municipalities.map((m) => ({
        code: m.ibge_code,
        name: m.name,
        state: m.state,
        label: `${m.name} - ${m.state}`,
        search: normalize(`${m.name} ${m.state}`),
      })),
    [municipalities],
  );

  const term = normalize(query.replace("-", " ").replace(/\s+/g, " "));
  const results = useMemo(() => {
    if (term.length < MIN_QUERY) return [];
    const startsWith = options.filter((o) => o.search.startsWith(term));
    const contains = options.filter(
      (o) => !o.search.startsWith(term) && o.search.includes(term),
    );
    return [...startsWith, ...contains].slice(0, MAX_RESULTS);
  }, [options, term]);

  const showList = open && !value;

  function select(option) {
    onChange(option.code);
    setQuery(option.label);
    setOpen(false);
  }

  function handleValueChange(text) {
    setQuery(text);
    setOpen(true);
    if (value) onChange("");
  }

  function handleBlur() {
    setOpen(false);
    if (!value) setQuery("");
  }

  return (
    <Command
      shouldFilter={false}
      loop
      className="h-auto overflow-visible bg-transparent p-0"
    >
      <IconField
        id={id}
        label={label}
        icon={MapPin}
        error={error}
        trailing={
          <>
            <InputGroupAddon align="inline-end" className="pr-4">
              <Search />
            </InputGroupAddon>
            {showList && (
              <CommandList
                onMouseDown={(e) => e.preventDefault()}
                className="absolute top-full left-0 z-20 mt-2 w-full rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg"
              >
                <CommandEmpty className="px-3 py-2.5 text-left text-[0.8125rem] text-muted-foreground">
                  {term.length < MIN_QUERY
                    ? "Digite ao menos 2 letras para buscar."
                    : "Nenhuma cidade encontrada."}
                </CommandEmpty>
                {results.length > 0 && (
                  <CommandGroup className="p-0">
                    {results.map((option) => (
                      <CommandItem
                        key={option.code}
                        value={String(option.code)}
                        onSelect={() => select(option)}
                        className="cursor-pointer justify-between gap-3 rounded-lg px-3 py-2.5 text-body data-selected:bg-secondary/70 [&>svg]:hidden"
                      >
                        <span className="truncate">{option.name}</span>
                        <Badge variant="muted">{option.state}</Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            )}
          </>
        }
      >
        <CommandPrimitive.Input
          id={id}
          data-slot="input-group-control"
          aria-invalid={Boolean(error)}
          autoComplete="off"
          placeholder="Digite o nome da sua cidade"
          value={query}
          onValueChange={handleValueChange}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          className="h-full min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted-foreground"
        />
      </IconField>
    </Command>
  );
}
