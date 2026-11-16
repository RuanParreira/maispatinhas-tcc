// Rótulos e variantes de Badge usados nos anúncios, espelhando os enums do backend.
export const postTypes = {
  adoption: { label: "Adoção", variant: "success" },
  lost: { label: "Perdido", variant: "destructive" },
  found: { label: "Encontrado", variant: "info" },
};

export const postStatuses = {
  draft: { label: "Rascunho", variant: "muted" },
  pending_approval: { label: "Aguardando moderação", variant: "warning" },
  rejected: { label: "Rejeitado", variant: "destructive" },
  active: { label: "Publicado", variant: "success" },
  paused: { label: "Pausado", variant: "secondary" },
  expired: { label: "Expirado", variant: "muted" },
  resolved: { label: "Resolvido", variant: "info" },
  closed: { label: "Encerrado", variant: "muted" },
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
