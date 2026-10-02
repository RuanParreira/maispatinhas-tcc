import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const intents = ["Quero adotar", "Pet perdido", "Pet encontrado"];

export default function HomeSearch() {
  const [intent, setIntent] = useState(intents[0]);

  return (
    <section className="relative z-10 mx-auto mt-4 w-full max-w-7xl px-6 lg:px-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex max-w-232 flex-col gap-3 rounded-2xl bg-card px-5 py-4 shadow-md"
      >
        <h2 className="text-lg leading-6">Encontre um pet perto de você</h2>

        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <InputGroup className="h-10 lg:min-w-0 lg:flex-1">
            <InputGroupInput
              type="text"
              aria-label="Cidade ou região"
              placeholder="Digite sua cidade ou região"
              className="pr-4 text-[0.8125rem] md:text-[0.8125rem]"
            />
            <InputGroupAddon className="pl-3.5">
              <MapPin />
            </InputGroupAddon>
          </InputGroup>
          <ToggleGroup
            type="single"
            variant="solid"
            aria-label="Intenção"
            value={intent}
            onValueChange={(value) => value && setIntent(value)}
            className="flex-wrap"
          >
            {intents.map((option) => (
              <ToggleGroupItem
                key={option}
                value={option}
                className="h-10 rounded-xl bg-secondary/50 px-4 text-[0.8125rem]"
              >
                {option}
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
