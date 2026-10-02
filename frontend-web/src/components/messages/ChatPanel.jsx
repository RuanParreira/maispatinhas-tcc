import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Info, MapPin, Send, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import { initialsOf } from "@/lib/initials";
import { cn } from "@/lib/utils";
import ConversationDetails from "@/components/messages/ConversationDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { conversationKinds } from "@/data/mockConversations";

// Junta mensagens seguidas do mesmo remetente no mesmo dia.
function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const last = groups.at(-1);
    if (last?.from === message.from && last.day === message.day) {
      last.messages.push(message);
    } else {
      groups.push({ from: message.from, day: message.day, messages: [message] });
    }
    return groups;
  }, []);
}

export default function ChatPanel({ conversation, onBack, onSend, className }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const { person, pet, messages } = conversation;
  const kind = conversationKinds[conversation.kind];
  const groups = groupMessages(messages);

  useEffect(() => {
    const area = scrollRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, [conversation.id, messages.length]);

  function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <section className={cn("min-h-0 min-w-0 flex-col", className)}>
      <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Voltar para conversas"
          onClick={onBack}
          className="-ml-1.5 rounded-full md:hidden"
        >
          <ArrowLeft />
        </Button>
        <Avatar size="lg">
          <AvatarImage src={pet.image} alt="" />
          <AvatarFallback>{pet.name[0]}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-sans text-base leading-tight font-semibold">
            {person} · {pet.name}
          </h2>
          <p className="truncate text-[0.8125rem] leading-5 text-muted-foreground">
            {pet.meta}
          </p>
        </div>
        <ConversationDetails conversation={conversation}>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Detalhes da conversa"
            className="rounded-full text-warning"
          >
            <Info className="size-5" />
          </Button>
        </ConversationDetails>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] sm:px-6"
      >
        <div className="mx-auto flex max-w-sm flex-col items-center pb-8 text-center">
          <Avatar className="size-20">
            <AvatarImage src={pet.image} alt={pet.name} />
            <AvatarFallback>{pet.name[0]}</AvatarFallback>
          </Avatar>
          <p className="mt-3 font-heading text-2xl leading-tight">
            {person} · {pet.name}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.8125rem] text-muted-foreground">
            <Badge variant={kind.badge}>{kind.label}</Badge>
            <span>{pet.meta}</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {pet.city}
            </span>
          </div>
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="mt-4 rounded-full px-3.5"
          >
            <Link to={kind.route}>Ver anúncio</Link>
          </Button>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          {groups.map((group, index) => {
            const mine = group.from === "me";
            const isLast = index === groups.length - 1;

            return (
              <Fragment key={group.messages[0].id}>
                {groups[index - 1]?.day !== group.day && (
                  <p className="self-center rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {group.day}
                  </p>
                )}
                <Message align={mine ? "end" : "start"}>
                  {!mine && (
                    <MessageAvatar className="group-has-data-[slot=message-footer]/message:-translate-y-5">
                      <Avatar>
                        <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                          {initialsOf(person)}
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                  )}
                  <MessageContent className="gap-1">
                    <BubbleGroup className="w-full gap-0.5">
                      {group.messages.map((message) => (
                        <Bubble
                          key={message.id}
                          variant={mine ? "default" : "secondary"}
                          className="max-w-[min(34rem,80%)]"
                        >
                          <BubbleContent className="rounded-2xl px-3.5 text-[0.9375rem] leading-snug whitespace-pre-wrap">
                            {message.text}
                          </BubbleContent>
                        </Bubble>
                      ))}
                    </BubbleGroup>
                    <MessageFooter className="px-1 font-normal">
                      {group.messages.at(-1).time}
                      {mine && isLast && " · Enviada"}
                    </MessageFooter>
                  </MessageContent>
                </Message>
              </Fragment>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1 border-t border-border/60 px-3 py-3"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Enviar foto"
          className="rounded-full text-warning"
        >
          <ImagePlus className="size-5" />
        </Button>
        <div className="flex h-10 min-w-0 flex-1 items-center rounded-full bg-secondary/60 pr-1 pl-4 transition-shadow focus-within:ring-3 focus-within:ring-ring/50">
          <input
            type="text"
            aria-label="Mensagem"
            placeholder="Escreva uma mensagem"
            autoComplete="off"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Inserir emoji"
            className="rounded-full text-warning hover:bg-transparent"
          >
            <Smile className="size-5" />
          </Button>
        </div>
        <Button
          type="submit"
          size="icon-lg"
          aria-label="Enviar mensagem"
          disabled={!draft.trim()}
          className="ml-1 size-10 rounded-full"
        >
          <Send />
        </Button>
      </form>
    </section>
  );
}
