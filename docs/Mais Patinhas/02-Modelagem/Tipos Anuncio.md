---
title: Tipos de Anúncio
tags:
  - modelagem
---

- **ADOCAO** — animal disponível para doação/adoção.
- **PERDIDO** — post do tutor que perdeu o animal, com local e data do último avistamento.
- **ENCONTRADO** — post de quem achou um animal na rua (sem ser o tutor), procurando o dono.

PERDIDO e ENCONTRADO são fluxos opostos da mesma aba: tutor procurando o bicho vs. quem achou o bicho procurando o tutor. Ambos usam o mesmo [[Fluxo Status de Anuncio]] — o post se resolve (`RESOLVIDO`) quando tutor e animal se reencontram. Só ADOCAO termina em adoção ([[Fluxo Status de Adocao]]).

## O que cada tipo pede no cadastro

O cadastro é feito em etapas e o tipo define as perguntas. Cada regra parte do que a pessoa realmente sabe sobre o animal.

| Campo | ADOCAO | PERDIDO | ENCONTRADO |
| --- | --- | --- | --- |
| Nome | opcional | **obrigatório** (o tutor sabe) | opcional ("nome na coleira") |
| Idade aproximada | **obrigatória** | **obrigatória** | opcional (quem achou não sabe) |
| Saúde (vacinado, vermifugado, castrado) | **obrigatória**, aceita "não sei" | não pergunta | não pergunta |
| Data do ocorrido | proibida | **obrigatória** ("quando sumiu") | **obrigatória** ("quando encontrou") |
| Ponto de referência | proibido | opcional ("onde foi visto pela última vez") | opcional ("onde foi encontrado") |
| Está com quem encontrou? | proibido | proibido | **obrigatório** (sim / ficou no local) |

Regras comuns aos três tipos:

- Espécie, sexo, porte, cor da pelagem e cidade são obrigatórios. Raça e características marcantes são opcionais.
- Ave, roedor e coelho são sempre de porte pequeno: o campo some e o valor é fixo.
- A cor vem de uma lista fechada (ver [[Entidades.canvas|Entidades]]); manchas e detalhes vão em características marcantes.
- Título com no mínimo 10 caracteres e descrição com no mínimo 30.
- Saúde fica de fora em PERDIDO e ENCONTRADO porque quem encontrou não sabe e, no perdido, não ajuda a reconhecer o animal.
- Na edição o tipo não muda, porque ele define as regras acima.
