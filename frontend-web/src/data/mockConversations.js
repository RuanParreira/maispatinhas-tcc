import { mockPets } from "@/data/mockPets";

const petByName = Object.fromEntries(mockPets.map((pet) => [pet.name, pet]));

export const conversationKinds = {
  adoption: { label: "Adoção", badge: "success", route: "/adoptions" },
  lost: { label: "Perdido", badge: "destructive", route: "/lost" },
  found: { label: "Encontrado", badge: "info", route: "/found" },
};

// Dados de exemplo enquanto o backend não expõe o chat.
export const mockConversations = [
  {
    id: 1,
    person: "Carla Santos",
    personCity: "Franca, SP",
    memberSince: "março de 2025",
    pet: petByName.Luna,
    kind: "adoption",
    time: "14:32",
    unread: 1,
    messages: [
      {
        id: 1,
        from: "me",
        day: "Ontem",
        time: "19:04",
        text: "Olá! A Luna ainda está disponível para adoção?",
      },
      {
        id: 2,
        from: "them",
        day: "Ontem",
        time: "19:20",
        text: "Oi! Está sim 😊",
      },
      {
        id: 3,
        from: "them",
        day: "Ontem",
        time: "19:21",
        text: "Você já teve gatos antes?",
      },
      {
        id: 4,
        from: "me",
        day: "Hoje",
        time: "10:22",
        text: "Sim, cuidei de dois gatinhos por mais de 10 anos. Meu apartamento já é todo telado nas janelas e na sacada.",
      },
      {
        id: 5,
        from: "them",
        day: "Hoje",
        time: "14:30",
        text: "Que maravilha saber disso! A Luna é muito dócil e adora um cantinho ao sol.",
      },
      {
        id: 6,
        from: "them",
        day: "Hoje",
        time: "14:32",
        text: "Perfeito! O que acha de marcarmos uma visita no sábado?",
      },
    ],
  },
  {
    id: 2,
    person: "Rodrigo Lima",
    personCity: "Ribeirão Preto, SP",
    memberSince: "janeiro de 2026",
    pet: petByName.Thor,
    kind: "adoption",
    time: "Ontem",
    unread: 0,
    messages: [
      {
        id: 1,
        from: "them",
        day: "Ontem",
        time: "16:02",
        text: "Boa tarde! Vi o anúncio do Thor. Ele convive bem com crianças?",
      },
      {
        id: 2,
        from: "me",
        day: "Ontem",
        time: "16:15",
        text: "Boa tarde, Rodrigo! Convive sim, é super paciente.",
      },
      {
        id: 3,
        from: "me",
        day: "Ontem",
        time: "16:16",
        text: "Só precisa de espaço para gastar energia, ele é de porte grande.",
      },
      {
        id: 4,
        from: "them",
        day: "Ontem",
        time: "16:40",
        text: "Muito obrigado pelas informações!",
      },
    ],
  },
  {
    id: 3,
    person: "Beatriz Mendes",
    personCity: "São Paulo, SP",
    memberSince: "agosto de 2025",
    pet: petByName.Pipoca,
    kind: "lost",
    time: "Seg",
    unread: 2,
    messages: [
      {
        id: 1,
        from: "them",
        day: "Segunda-feira",
        time: "08:47",
        text: "Oi! Acho que vi um cachorrinho muito parecido com o Pipoca perto da praça central.",
      },
      {
        id: 2,
        from: "them",
        day: "Segunda-feira",
        time: "08:48",
        text: "Ele estava com uma coleira vermelha?",
      },
    ],
  },
  {
    id: 4,
    person: "Felipe Araújo",
    personCity: "Franca, SP",
    memberSince: "junho de 2026",
    pet: petByName.Nina,
    kind: "found",
    time: "12 set",
    unread: 0,
    messages: [
      {
        id: 1,
        from: "me",
        day: "12 de setembro",
        time: "11:05",
        text: "Olá, Felipe! Acho que a cachorrinha que você encontrou é a minha Nina.",
      },
      {
        id: 2,
        from: "them",
        day: "12 de setembro",
        time: "11:30",
        text: "Que bom! Consegue me mandar uma foto dela para eu confirmar?",
      },
      {
        id: 3,
        from: "me",
        day: "12 de setembro",
        time: "11:34",
        text: "Claro, já envio. Muito obrigado por cuidar dela!",
      },
    ],
  },
];
