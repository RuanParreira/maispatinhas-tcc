import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { catalogPathOf, homeIntents } from "@/lib/homeIntents";
import CityCombobox from "@/components/auth/CityCombobox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// A cidade e a intenção daqui também mudam a vitrine logo abaixo. "Buscar" leva ao catálogo;
// visitante passa pelo login e volta para a mesma busca.
export default function HomeSearch({
  intent,
  onIntentChange,
  city,
  onCityChange,
  municipalities,
}) {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 mx-auto mt-4 w-full max-w-7xl px-6 lg:px-12">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          navigate(catalogPathOf(intent, city));
        }}
        className="mx-auto flex max-w-232 flex-col gap-3 rounded-2xl bg-card px-5 py-4 shadow-md"
      >
        <h2 className="text-xl leading-7">Encontre um pet perto de você</h2>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="lg:min-w-0 lg:flex-1 [&_[data-slot=input-group]]:h-10 [&_input]:text-[0.8125rem]">
            {municipalities ? (
              <CityCombobox
                id="home-city"
                ariaLabel="Cidade"
                placeholder="Digite sua cidade"
                municipalities={municipalities}
                value={city}
                onChange={onCityChange}
              />
            ) : (
              <Skeleton className="h-10 w-full rounded-xl" />
            )}
          </div>
          <ToggleGroup
            type="single"
            variant="solid"
            aria-label="Intenção"
            value={intent.label}
            onValueChange={(value) =>
              value &&
              onIntentChange(homeIntents.find(({ label }) => label === value))
            }
            className="flex-wrap"
          >
            {homeIntents.map(({ label }) => (
              <ToggleGroupItem
                key={label}
                value={label}
                className="h-10 rounded-xl bg-secondary/50 px-4 text-[0.8125rem]"
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button type="submit" className="h-10 px-5">
            <Search />
            Buscar
          </Button>
        </div>
      </form>
    </section>
  );
}
