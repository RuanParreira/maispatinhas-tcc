# StatusAnuncio

Selo `Badge` que mostra em que etapa do fluxo de moderação está cada anúncio. O mapa fica em `postStatuses` (`src/lib/posts.js`), espelhando o enum do backend.

| `posts.status` | Rótulo | `variant` |
| --- | --- | --- |
| `active` | Publicado | `success` |
| `pending_approval` | Aguardando moderação | `warning`, com ponto pulsante |
| `rejected` | Rejeitado | `destructive` |
| `resolved` | Resolvido | `info` |
| `paused` | Pausado | `secondary` |
| `draft`, `expired`, `closed`, `canceled` | Rascunho, Expirado, Encerrado, Cancelado | `muted` |

Um anúncio aguardando moderação aparece em "Meus anúncios" com borda tracejada em `warning` e foto esmaecida.

**Faça**
- Escreva o estado em caixa de frase: "Aguardando moderação".
- Novo estado no backend: adicione-o em `postStatuses`; sem isso o selo cai no `muted` com o valor cru.
- Num anúncio rejeitado, o `PostCard` mostra o motivo do moderador (`rejection_reason`, da última rejeição) num bloco em `destructive-subtle` abaixo da descrição.

**Não faça**
- Não comunique o estado só pela cor; a palavra é obrigatória.
- Não invente estados intermediários como "Aprovado": aprovação e publicação são a mesma etapa.
