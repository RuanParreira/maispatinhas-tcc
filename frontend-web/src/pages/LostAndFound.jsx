import { useSearchParams } from "react-router-dom";
import PostCatalog from "@/components/PostCatalog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Quem perdeu o pet precisa ver os achados e vice-versa, por isso os dois tipos dividem a tela.
const views = {
  all: {
    label: "Todos",
    types: ["lost", "found"],
    count: "perdidos",
  },
  lost: {
    label: "Perdidos",
    types: ["lost"],
    count: "perdidos",
  },
  found: {
    label: "Achados",
    types: ["found"],
    count: "achados",
  },
};

export default function LostAndFound() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = views[searchParams.get("view")]
    ? searchParams.get("view")
    : "all";

  return (
    <PostCatalog
      types={views[view].types}
      label={views[view].count}
      header={
        <ToggleGroup
          type="single"
          variant="solid"
          size="lg"
          spacing={1}
          aria-label="Mostrar"
          value={view}
          onValueChange={(value) =>
            value &&
            setSearchParams(value === "all" ? {} : { view: value }, {
              replace: true,
            })
          }
          className="w-fit rounded-xl bg-secondary/50 p-1"
        >
          {Object.entries(views).map(([value, { label }]) => (
            <ToggleGroupItem
              key={value}
              value={value}
              className="px-3.5 text-muted-foreground hover:bg-transparent"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    />
  );
}
