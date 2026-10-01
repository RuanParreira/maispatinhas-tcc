import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthField } from "@/components/auth/AuthField";

const MAX_RESULTS = 8;
const MIN_QUERY = 2;

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

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
  const [activeIndex, setActiveIndex] = useState(0);

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

  const listId = `${id}-list`;
  const showList = open && !value;

  function select(option) {
    onChange(option.code);
    setQuery(option.label);
    setOpen(false);
  }

  function handleChange(e) {
    setQuery(e.target.value);
    setActiveIndex(0);
    setOpen(true);
    if (value) onChange("");
  }

  function handleKeyDown(e) {
    if (!showList || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleBlur() {
    setOpen(false);
    if (!value) setQuery("");
  }

  return (
    <AuthField
      id={id}
      label={label}
      icon={MapPin}
      error={error}
      type="text"
      role="combobox"
      aria-expanded={showList}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={
        showList && results.length > 0 ? `${id}-option-${activeIndex}` : undefined
      }
      autoComplete="off"
      placeholder="Digite o nome da sua cidade"
      className="pr-12"
      value={query}
      onChange={handleChange}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      trailing={
        <>
          <Search className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
          {showList && (
            <ul
              id={listId}
              role="listbox"
              className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-xl border border-border/60 bg-popover p-1.5 shadow-lg"
            >
              {results.map((option, index) => (
                <li
                  key={option.code}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-body",
                    index === activeIndex && "bg-secondary/70",
                  )}
                >
                  <span className="truncate">{option.name}</span>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-semibold text-muted-foreground">
                    {option.state}
                  </span>
                </li>
              ))}
              {results.length === 0 && (
                <li className="px-3 py-2.5 text-[0.8125rem] text-muted-foreground">
                  {term.length < MIN_QUERY
                    ? "Digite ao menos 2 letras para buscar."
                    : "Nenhuma cidade encontrada."}
                </li>
              )}
            </ul>
          )}
        </>
      }
    />
  );
}
