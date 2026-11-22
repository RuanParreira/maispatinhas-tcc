import api from "@/api/axios";
import { animalSpecies, postTypes } from "@/lib/posts";

export const conversationKinds = Object.fromEntries(
  Object.entries(postTypes).map(([type, { label, variant }]) => [
    type,
    { label, badge: variant },
  ]),
);

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});
const dayFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
});
const monthFormat = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

function dayLabel(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Hoje";
  if (date.toDateString() === yesterday.toDateString()) return "Ontem";
  return dayFormat.format(date);
}

// Hora para a lista: hoje mostra o horário; antes disso, o dia.
function listTime(value) {
  if (!value) return "";
  const date = new Date(value);
  const day = dayLabel(date);
  return day === "Hoje" ? timeFormat.format(date) : day;
}

export function toChatMessage(message) {
  const date = new Date(message.created_at);

  return {
    id: message.id,
    from: message.is_mine ? "me" : "them",
    day: dayLabel(date),
    time: timeFormat.format(date),
    text: message.body,
    read: Boolean(message.read_at),
    createdAt: message.created_at,
  };
}

export function updateById(conversations, id, change) {
  return conversations.map((item) =>
    item.id === id ? { ...item, ...change(item) } : item,
  );
}

/**
 * Põe a mensagem na conversa e sobe a conversa para o topo. Serve para a que eu
 * envio e para a que chega em tempo real; a mesma mensagem nunca entra duas
 * vezes (a aba que enviou recebe também o aviso). Só a da outra pessoa conta
 * como não lida. fallback é a conversa buscada na API quando ainda não está na lista.
 */
export function withNewMessage(conversations, id, message, fallback) {
  const target = conversations.find((item) => item.id === id) ?? fallback;
  if (!target || target.messages.some((item) => item.id === message.id)) {
    return conversations;
  }

  return [
    {
      ...target,
      time: message.time,
      lastMessage: message,
      messages: target.loaded ? [...target.messages, message] : target.messages,
      unread: message.from === "me" ? target.unread : target.unread + 1,
    },
    ...conversations.filter((item) => item.id !== id),
  ];
}

/**
 * Converte a conversa da API para o formato que os componentes do chat usam.
 * Pet encontrado pode não ter nome: aí vale a espécie.
 */
export function toChatConversation(conversation) {
  const { post, other_user: person } = conversation;
  const species = animalSpecies[post.animal.species];

  return {
    id: conversation.id,
    postId: post.id,
    kind: post.type,
    canSend: conversation.can_send,
    status: conversation.status,
    blockedByMe: conversation.blocked_by_me,
    person: person.name,
    personAvatar: person.avatar_url,
    personCity: person.municipality
      ? `${person.municipality.name}, ${person.municipality.state}`
      : "",
    memberSince: monthFormat.format(new Date(person.member_since)),
    pet: {
      name: post.animal.name ?? species,
      image: post.cover_url,
      meta: species,
      city: `${post.municipality.name}, ${post.municipality.state}`,
      description: post.title,
    },
    time: listTime(conversation.last_message_at),
    unread: conversation.unread_count ?? 0,
    lastMessage: conversation.last_message
      ? toChatMessage(conversation.last_message)
      : null,
    messages: [],
  };
}

export async function fetchConversation(id) {
  const { data } = await api.get(`/api/conversations/${id}`);
  return toChatConversation(data.data);
}

/**
 * Campos que mudam com bloqueio e desbloqueio. can_send vem da API porque um
 * anúncio cancelado continua só para leitura mesmo sem bloqueio.
 */
export function accessOf({ canSend, status, blockedByMe }) {
  return { canSend, status, blockedByMe };
}
