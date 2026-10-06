import { mockPets } from "@/data/mockPets";

// Dados de exemplo enquanto o perfil não consome a API.
// O formato segue o que o endpoint público de perfil deve devolver.
export const mockProfile = {
  city: "Franca, SP",
  bio: "Resgato e cuido de cães e gatos em Franca há alguns anos. Prefiro lares com quintal telado e gosto de acompanhar os primeiros meses depois da adoção.",
  stats: {
    adoptionsCompleted: 3,
    activePosts: 3,
    rating: 4.7,
    reviewsCount: 3,
  },
  pets: mockPets.slice(0, 3),
  happyEndings: [
    {
      id: 1,
      pet: mockPets[3],
      adopter: "Camila Rocha",
      completedAt: "2026-08-14T12:00:00",
    },
    {
      id: 2,
      pet: mockPets[4],
      adopter: "Lucas Andrade",
      completedAt: "2026-06-02T12:00:00",
    },
    {
      id: 3,
      pet: mockPets[5],
      adopter: "Beatriz Lima",
      completedAt: "2026-03-21T12:00:00",
    },
  ],
  reviews: [
    {
      id: 1,
      rating: 5,
      comment:
        "Foi transparente sobre a personalidade da Mel e nos ajudou muito nas primeiras semanas. Recomendo de olhos fechados.",
      reviewer: "Camila Rocha",
      petName: "Mel",
      createdAt: "2026-09-02T12:00:00",
    },
    {
      id: 2,
      rating: 5,
      comment:
        "Atenciosa desde o primeiro contato até a entrega. O Thor chegou vacinado e com todas as orientações.",
      reviewer: "Lucas Andrade",
      petName: "Thor",
      createdAt: "2026-06-20T12:00:00",
    },
    {
      id: 3,
      rating: 4,
      comment:
        "Processo tranquilo e bem explicado. Só demorou um pouco para combinar o dia da visita.",
      reviewer: "Beatriz Lima",
      petName: "Theo",
      createdAt: "2026-04-05T12:00:00",
    },
  ],
};
