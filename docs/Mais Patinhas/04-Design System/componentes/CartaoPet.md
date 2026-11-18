# CartaoPet

Dois cartões com a mesma estrutura visual:

| Componente | Dados | Onde aparece |
| --- | --- | --- |
| `PetCard` (`src/components/PetCard.jsx`) | Anúncio público de `/api/posts` (adoção, perdido, achado ou reencontro) | Adotar, Pets perdidos, Reencontros, vitrine da home, "Outros pets" da tela de detalhes, Favoritos, perfil |
| `PostCard` (`src/components/PostCard.jsx`) | Anúncio do próprio autor, com status | Meus anúncios |

Estrutura:
- `article` em `bg-card`, `rounded-2xl`, `shadow-xs`, subindo para `shadow-md` no hover. Sem borda.
- Foto de 280px de altura (`h-70`) em `object-cover`, com o corte mirando o terço de cima. Sem foto, bloco `bg-secondary` com o ícone `paw-print`.
- Sobre a foto: [[Etiqueta]] de tipo ou disponibilidade à esquerda ("Disponível para adoção", "Perdido", "Achado"; no reencontro, "Reencontrado" ou "Devolvido ao tutor"); à direita, o favorito (`PetCard`) ou o [[StatusAnuncio]] (`PostCard`).
- Favorito: botão redondo `ghost` com `heart`, `aria-label` com o nome do pet e `aria-pressed`. Só em anúncio de adoção de outra pessoa; marca na hora e desfaz se a API falhar (`useFavorite`).
- Corpo com `p-6`: nome em Instrument Serif `text-xl`, raça ou espécie em `text-warning` à direita, cidade com `map-pin` e descrição em `legenda` (13px, `tinta-suave`).
- Na busca por região, a meta ganha a distância em `text-warning` ("· a 38 km"); pets da mesma cidade ficam sem ela.
- Rodapé separado por `border-t`: etiqueta de atributo e o link "Conhecer" em `text-warning` com seta.

**Faça**
- Grade de cartões com `gap-6`.
- Em Pets perdidos, a etiqueta de tipo ("Perdido", "Achado") diz de que lado está a história.

**Não faça**
- Não mostre telefone nem endereço no cartão — o contato é pelo chat.
- Não escreva o nome do pet em caixa alta nem em Public Sans.
- Não use foto genérica quando o anúncio não tiver foto.
