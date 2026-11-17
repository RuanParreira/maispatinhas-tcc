// Rótulos e variantes de Badge usados nos anúncios, espelhando os enums do backend.
export const postTypes = {
  adoption: { label: "Adoção", variant: "success" },
  lost: { label: "Perdido", variant: "destructive" },
  found: { label: "Achado", variant: "info" },
};

export const postStatuses = {
  pending_approval: { label: "Aguardando moderação", variant: "warning" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  active: { label: "Publicado", variant: "success" },
  paused: { label: "Pausado", variant: "secondary" },
  expired: { label: "Expirado", variant: "muted" },
  resolved: { label: "Finalizado com sucesso", variant: "success" },
  canceled: { label: "Cancelado", variant: "muted" },
};

export const animalSpecies = {
  dog: "Cachorro",
  cat: "Gato",
  bird: "Ave",
  rodent: "Roedor",
  rabbit: "Coelho",
  other: "Outro",
};

export const animalSexes = {
  male: "Macho",
  female: "Fêmea",
  undefined: "Não sei",
};

export const animalSizes = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
};

export const animalColors = {
  black: "Preto",
  white: "Branco",
  gray: "Cinza",
  caramel: "Caramelo",
  golden: "Dourado",
  orange: "Laranja",
  brown: "Marrom",
  beige: "Bege",
  black_and_white: "Preto e branco",
  brindle: "Tigrado ou rajado",
  tricolor: "Tricolor",
  siamese: "Siamês",
  other: "Outra",
};

/**
 * Respostas de saúde do animal. "unknown" vai para a API como vazio (null).
 */
export const healthAnswers = {
  yes: "Sim",
  no: "Não",
  unknown: "Não sei",
};

export const healthQuestions = [
  { field: "animal.vaccinated", label: "Está vacinado?" },
  { field: "animal.dewormed", label: "Está vermifugado?" },
  { field: "animal.neutered", label: "É castrado?" },
];

/**
 * Tamanhos mínimos do texto do anúncio, iguais aos do StorePostRequest.
 */
export const postTextMinLengths = { title: 10, description: 30 };

/**
 * Status de histórico (mesma regra do PostStatus::isFinished no backend):
 * não se editam nem se cancelam.
 */
export const finishedPostStatuses = ["resolved", "canceled"];

/**
 * No card, "resolvido" conta o final da história de cada tipo. O filtro, que
 * mistura os tipos, usa o rótulo genérico de postStatuses.
 */
const resolvedLabels = {
  adoption: "Adotado",
  lost: "Reencontrado",
  found: "Devolvido ao tutor",
};

export function statusLabelOf(post) {
  if (post.status === "resolved" && resolvedLabels[post.type]) {
    return resolvedLabels[post.type];
  }
  return postStatuses[post.status]?.label;
}
