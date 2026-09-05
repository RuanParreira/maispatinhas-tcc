---
title: Tipos de Anúncio
tags:
  - modelagem
---

- **ADOCAO** — animal disponível para doação/adoção.
- **PERDIDO** — post do tutor que perdeu o animal, com local e data do último avistamento.
- **ENCONTRADO** — post de quem achou um animal na rua (sem ser o tutor), procurando o dono.

PERDIDO e ENCONTRADO são fluxos opostos da mesma aba: tutor procurando o bicho vs. quem achou o bicho procurando o tutor. Ambos usam o mesmo [[Fluxo Status de Anuncio]] — o post se resolve (`RESOLVIDO`) quando tutor e animal se reencontram.
