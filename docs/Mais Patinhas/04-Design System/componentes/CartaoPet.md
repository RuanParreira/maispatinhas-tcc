# CartaoPet

Dois cartões com a mesma estrutura visual:

| Componente | Dados | Onde aparece |
| --- | --- | --- |
| `PetCard` (`src/components/PetCard.jsx`) | Anúncio de adoção de `/api/posts` | Catálogo de adoção, destaques da home |
| `PostCard` (`src/components/PostCard.jsx`) | Qualquer anúncio, com status | Meus anúncios, Perdidos e Encontrados |

Estrutura:
- `article` em `bg-card`, `rounded-2xl`, `shadow-xs`, subindo para `shadow-md` no hover. Sem borda.
- Foto de 280px de altura (`h-70`) em `object-cover`. Sem foto, bloco `bg-secondary` com o ícone `paw-print`.
- Sobre a foto: [[Etiqueta]] de tipo ou disponibilidade à esquerda; à direita, o favorito (`PetCard`) ou o [[StatusAnuncio]] (`PostCard`).
- Favorito: botão redondo `ghost` com `heart`, `aria-label` com o nome do pet e `aria-pressed`.
- Corpo com `p-6`: nome em Instrument Serif `text-xl`, raça ou espécie em `text-warning` à direita, cidade com `map-pin` e descrição em `legenda` (13px, `tinta-suave`).
- Rodapé separado por `border-t`: etiqueta de atributo e o link "Conhecer" em `text-warning` com seta.

**Faça**
- Grade de cartões com `gap-6`.
- Em Perdidos e Encontrados, a etiqueta de tipo ("Perdido", "Encontrado") vem primeiro e a data do ocorrido aparece na meta.

**Não faça**
- Não mostre telefone nem endereço no cartão — o contato é pelo chat.
- Não escreva o nome do pet em caixa alta nem em Public Sans.
- Não use foto genérica quando o anúncio não tiver foto.
