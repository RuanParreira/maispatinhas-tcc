# StatusAnuncio

Selo `Badge` que mostra em que etapa do fluxo de moderação está cada anúncio. O mapa fica em `postStatuses` (`src/lib/posts.js`), espelhando o enum do backend.

| `posts.status` | Rótulo | `variant` |
| --- | --- | --- |
| `active` | Publicado | `success` |
| `pending_approval` | Aguardando moderação | `warning`, com ponto pulsante |
| `rejected` | Rejeitado | `destructive` |
| `resolved` | No card, conforme o tipo: Adotado (adoção), Reencontrado (perdido), Devolvido ao tutor (encontrado). No filtro: Finalizado com sucesso | `success` |
| `paused` | Pausado | `secondary` |
| `expired`, `canceled` | Expirado, Cancelado | `muted` |

Em "Meus anúncios" o selo fica sobre a foto, com fundo sólido e um ponto na cor do estado. Aguardando moderação, pausado e expirado mostram também uma faixa explicativa no corpo do card; resolvido mantém as cores (é um final feliz) e cancelado aparece com a foto em tons de cinza.

**Faça**
- Escreva o estado em caixa de frase: "Aguardando moderação".
- Novo estado no backend: adicione-o em `postStatuses`; sem isso o selo cai no `muted` com o valor cru.
- Num anúncio rejeitado, o `PostCard` mostra o motivo do moderador (`rejection_reason`, da última rejeição) num bloco em `destructive-subtle` abaixo da descrição.

**Não faça**
- Não comunique o estado só pela cor; a palavra é obrigatória.
- Não invente estados intermediários como "Aprovado": aprovação e publicação são a mesma etapa.
