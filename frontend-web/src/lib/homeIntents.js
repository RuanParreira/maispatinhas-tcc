// Intenções da busca da home: decidem o catálogo do "Buscar" e os pets da vitrine logo abaixo.
export const homeIntents = [
  {
    label: "Quero adotar",
    path: "/adoptions",
    types: ["adoption"],
    eyebrow: "Adoção responsável",
    title: "Talvez o próximo membro da sua família esteja aqui.",
    description: "Animais resgatados e prontos para encher sua casa de afeto.",
    action: "Ver todos os pets",
    empty: "para adoção",
  },
  {
    label: "Pet perdido",
    path: "/lost",
    view: "lost",
    types: ["lost"],
    eyebrow: "Pets perdidos",
    title: "Eles sumiram e alguém está procurando.",
    description: "Viu algum por aí? Avise o tutor.",
    action: "Ver todos os perdidos",
    empty: "perdidos",
  },
  {
    label: "Pet achado",
    path: "/lost",
    view: "found",
    types: ["found"],
    eyebrow: "Pets achados",
    title: "Encontrados na rua, esperando o tutor.",
    description: "Reconhece algum? Pode ser o pet de um vizinho.",
    action: "Ver todos os achados",
    empty: "achados",
  },
];

export function catalogPathOf(intent, city) {
  const params = new URLSearchParams();
  if (intent.view) params.set("view", intent.view);
  if (city) params.set("city", city);
  const query = params.toString();
  return query ? `${intent.path}?${query}` : intent.path;
}
