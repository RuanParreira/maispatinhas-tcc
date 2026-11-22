import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, Info, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { echo } from "@/lib/echo";
import { initialsOf } from "@/lib/initials";
import { cn } from "@/lib/utils";
import ConversationDetails from "@/components/messages/ConversationDetails";
import { MessageBubblesSkeleton } from "@/components/messages/MessagesSkeleton";
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
import { conversationKinds } from "@/lib/conversations";

function readOnlyMessage(conversation) {
  const firstName = conversation.person.split(" ")[0];
  if (conversation.blockedByMe) {
    return `Você bloqueou ${firstName}. Desbloqueie nos detalhes da conversa para voltar a conversar.`;
  }
  if (conversation.status === "blocked") return "Esta conversa foi bloqueada.";
  return "Esta conversa não aceita mais mensagens.";
}

// Junta mensagens seguidas do mesmo remetente no mesmo dia.
function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const last = groups.at(-1);
    if (last?.from === message.from && last.day === message.day) {
      last.messages.push(message);
    } else {
      groups.push({
        from: message.from,
        day: message.day,
        messages: [message],
      });
    }
    return groups;
  }, []);
}

/**
 * "digitando..." vai direto de um navegador para o outro pelo canal da conversa
 * (whisper do Reverb), sem passar pela API. O aviso some depois de 3 s sem
 * digitação ou quando a mensagem chega; quem digita avisa no máximo a cada 2 s.
 * O aviso leva o id de quem digita: outra aba da mesma pessoa ignora o próprio aviso.
 */
function useTypingIndicator(conversationId, lastMessageId) {
  const { user } = useAuth();
  const userId = user?.id;
  const [typingAfter, setTypingAfter] = useState(null);
  const channelRef = useRef(null);
  const lastNotifyRef = useRef(0);
  const lastMessageIdRef = useRef(lastMessageId);

  useEffect(() => {
    lastMessageIdRef.current = lastMessageId;
  });

  useEffect(() => {
    const channelName = `conversation.${conversationId}`;
    const channel = echo.private(channelName);
    let timer;

    function handleTyping(data) {
      if (data?.userId === userId) return;
      setTypingAfter(lastMessageIdRef.current ?? 0);
      clearTimeout(timer);
      timer = setTimeout(() => setTypingAfter(null), 3000);
    }

    channel.listenForWhisper("typing", handleTyping);
    channelRef.current = channel;

    return () => {
      clearTimeout(timer);
      channel.stopListeningForWhisper("typing", handleTyping);
      echo.leave(channelName);
    };
  }, [conversationId, userId]);

  return {
    visible: typingAfter !== null && typingAfter === (lastMessageId ?? 0),
    notify() {
      const now = Date.now();
      if (now - lastNotifyRef.current < 2000) return;
      lastNotifyRef.current = now;
      channelRef.current?.whisper("typing", { userId });
    },
  };
}

/**
 * Chat de uma conversa. Mensagem nova rola até o fim; o balão de "digitando..."
 * só puxa a rolagem se a pessoa já está no fim, para não atrapalhar quem lê
 * mensagens antigas.
 */
export default function ChatPanel({
  conversation,
  onBack,
  onSend,
  onLoadOlder,
  onBlockChange,
  className,
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const { person, pet, messages } = conversation;
  const kind = conversationKinds[conversation.kind];
  const groups = groupMessages(messages);
  const lastMessageId = messages.at(-1)?.id;
  const typing = useTypingIndicator(conversation.id, lastMessageId);

  useEffect(() => {
    const area = scrollRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  }, [conversation.id, lastMessageId]);

  useEffect(() => {
    const area = scrollRef.current;
    if (!typing.visible || !area) return;
    if (area.scrollHeight - area.scrollTop - area.clientHeight < 160) {
      area.scrollTop = area.scrollHeight;
    }
  }, [typing.visible]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending || !conversation.loaded) return;
    setSending(true);
    if (await onSend(text)) setDraft("");
    setSending(false);
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
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {pet.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-sans text-base leading-tight font-semibold">
            {person} · {pet.name}
          </h2>
          <p
            aria-live="polite"
            className="truncate text-[0.8125rem] leading-5 text-muted-foreground"
          >
            {typing.visible ? (
              <span className="font-medium text-warning">digitando...</span>
            ) : (
              pet.meta
            )}
          </p>
        </div>
        <ConversationDetails
          conversation={conversation}
          onBlockChange={onBlockChange}
        >
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
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto flex max-w-sm flex-col items-center pb-8 text-center">
          <Avatar className="size-20">
            <AvatarImage src={pet.image} alt={pet.name} />
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {pet.name[0]}
            </AvatarFallback>
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
            <Link to={`/posts/${conversation.postId}`}>Ver anúncio</Link>
          </Button>
        </div>

        {onLoadOlder && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onLoadOlder}
            className="mx-auto mb-4 flex rounded-full"
          >
            Carregar mensagens anteriores
          </Button>
        )}

        {!conversation.loaded && <MessageBubblesSkeleton />}

        <div className="flex w-full flex-col gap-4">
          {groups.map((group, index) => {
            const mine = group.from === "me";
            const isLast = index === groups.length - 1;

            return (
              <Fragment key={group.messages[0].id}>
                {groups[index - 1]?.day !== group.day && (
                  <p className="self-center rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground">
                    {group.day}
                  </p>
                )}
                <Message align={mine ? "end" : "start"}>
                  {!mine && (
                    <MessageAvatar className="group-has-data-[slot=message-footer]/message:-translate-y-5">
                      <Avatar>
                        <AvatarImage src={conversation.personAvatar} alt="" />
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
                      {mine &&
                        isLast &&
                        (group.messages.at(-1).read ? " · Lida" : " · Enviada")}
                    </MessageFooter>
                  </MessageContent>
                </Message>
              </Fragment>
            );
          })}
          {typing.visible && (
            <Message align="start">
              <MessageContent>
                <Bubble variant="secondary">
                  <BubbleContent className="animate-pulse rounded-2xl px-3.5 text-[0.9375rem] text-muted-foreground italic">
                    digitando...
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )}
        </div>
      </div>

      {!conversation.canSend ? (
        <p className="border-t border-border/60 px-4 py-4 text-center text-sm text-muted-foreground">
          {readOnlyMessage(conversation)}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1 border-t border-border/60 px-3 py-3"
        >
          <div className="flex h-10 min-w-0 flex-1 items-center rounded-full bg-secondary/60 pr-4 pl-4 transition-shadow focus-within:ring-1 focus-within:ring-ring">
            <input
              type="text"
              aria-label="Mensagem"
              placeholder="Escreva uma mensagem"
              autoComplete="off"
              maxLength={2000}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (e.target.value.trim()) typing.notify();
              }}
              className="min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            size="icon-lg"
            aria-label="Enviar mensagem"
            disabled={!draft.trim() || sending || !conversation.loaded}
            className="ml-1 size-10 rounded-full"
          >
            <Send />
          </Button>
        </form>
      )}
    </section>
  );
}
