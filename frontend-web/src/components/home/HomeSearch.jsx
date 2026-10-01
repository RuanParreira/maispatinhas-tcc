import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const intents = ["Quero adotar", "Pet perdido", "Pet encontrado"];

export default function HomeSearch() {
  const [intent, setIntent] = useState(intents[0]);

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:-mt-10 lg:px-12">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex max-w-232 flex-col gap-6 rounded-2xl bg-card p-6 shadow-md sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl leading-7">Encontre um pet perto de você</h2>
            <p className="text-[0.8125rem] leading-5 text-muted-foreground">
              Filtre por intenção e descubra companheiros na sua vizinhança
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {intents.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={intent === option}
                onClick={() => setIntent(option)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-[0.8125rem] leading-5 transition-colors",
                  intent === option
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary/50 hover:bg-secondary",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-8">
            <MapPin className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              aria-label="Cidade ou região"
              placeholder="Digite sua cidade ou região (ex: São Paulo, SP)"
              className="h-14 rounded-xl border-transparent bg-secondary/50 pr-4 pl-12 text-body md:text-body"
            />
          </div>
          <Button type="submit" size="xl" className="sm:col-span-4">
            <Search />
            Buscar
          </Button>
        </div>
      </form>
    </section>
  );
}
