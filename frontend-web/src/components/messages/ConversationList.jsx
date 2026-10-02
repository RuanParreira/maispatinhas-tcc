import { useState } from "react";
import { Search } from "lucide-react";
import { normalize } from "@/lib/text";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { conversationKinds } from "@/data/mockConversations";

const filterOptions = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
];

const kindOptions = [
  { value: "all", label: "Todos os tipos" },
  { value: "adoption", label: "Adoções" },
  { value: "lost", label: "Perdidos" },
  { value: "found", label: "Encontrados" },
];


export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  className,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [kind, setKind] = useState("all");

  const term = normalize(search);
  const visible = conversations.filter(
    (conversation) =>
      (filter === "all" || conversation.unread > 0) &&
      (kind === "all" || conversation.kind === kind) &&
      normalize(`${conversation.person} ${conversation.pet.name}`).includes(
        term,
      ),
  );

  return (
    <aside className={cn("min-h-0 flex-col", className)}>
      <div className="flex flex-col gap-3 p-4 pb-3">
        <InputGroup className="h-10">
          <InputGroupInput
            type="search"
            aria-label="Buscar conversas"
            placeholder="Buscar conversas ou pets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-4"
          />
          <InputGroupAddon className="pl-3.5">
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center justify-between gap-2">
          <ToggleGroup
            type="single"
            variant="solid"
            size="sm"
            spacing={1.5}
            aria-label="Filtrar conversas"
            value={filter}
            onValueChange={(value) => value && setFilter(value)}
          >
            {filterOptions.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="rounded-full bg-secondary/60 px-3 text-muted-foreground"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={kind === "all" ? "" : kind} onValueChange={setKind}>
            <SelectTrigger
              aria-label="Tipo de anúncio"
              className={cn(
                "h-7 gap-1 rounded-full border-transparent px-3 text-[0.8rem] font-medium data-[size=default]:h-7 data-placeholder:text-muted-foreground",
                kind === "all"
                  ? "bg-secondary/60 hover:text-foreground"
                  : "bg-primary text-primary-foreground shadow-xs [&_svg]:text-primary-foreground",
              )}
            >
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-44">
              {kindOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
          {visible.map((conversation) => {
            const last = conversation.messages.at(-1);
            const kindInfo = conversationKinds[conversation.kind];
            const unread = conversation.unread > 0;

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  aria-current={conversation.id === activeId}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-left transition-colors outline-none hover:bg-secondary/50 focus-visible:ring-3 focus-visible:ring-ring/50",
                    conversation.id === activeId &&
                      "md:bg-secondary md:hover:bg-secondary",
                  )}
                >
                  <Avatar className="size-13">
                    <AvatarImage src={conversation.pet.image} alt="" />
                    <AvatarFallback>{conversation.pet.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={cn(
                          "truncate text-sm",
                          unread ? "font-semibold" : "font-medium",
                        )}
                      >
                        {conversation.person} · {conversation.pet.name}
                      </p>
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          unread
                            ? "font-semibold text-warning"
                            : "text-muted-foreground",
                        )}
                      >
                        {conversation.time}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p
                        className={cn(
                          "min-w-0 flex-1 truncate text-[0.8125rem] leading-5",
                          unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {last.from === "me" && "Você: "}
                        {last.text}
                      </p>
                      {unread && (
                        <span
                          aria-label={`${conversation.unread} não lidas`}
                          className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[0.6875rem] font-semibold text-primary-foreground"
                        >
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <Badge variant={kindInfo.badge} className="mt-1.5">
                      {kindInfo.label}
                    </Badge>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-6 py-10 text-center text-sm text-muted-foreground">
          Nenhuma conversa encontrada.
        </p>
      )}
    </aside>
  );
}
