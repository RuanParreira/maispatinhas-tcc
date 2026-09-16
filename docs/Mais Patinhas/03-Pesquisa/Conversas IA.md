---
title: Conversas com IA — Pesquisa
tags:
  - pesquisa
---

Conversas usadas como apoio durante a concepção do projeto. As três partiram do mesmo enunciado — a descrição do sistema de doação, perdidos, chat, avaliação e filtro por proximidade — e receberam o diagrama de entidades da época para crítica.

- [ChatGPT](https://chatgpt.com/share/6a9c08dd-22a8-83e9-a98b-80430171ac0a) — *Arquitetura do marketplace e normalização.* Propôs as nove entidades do modelo e defendeu separar animal, anúncio, conversa, adoção e avaliação. A segunda metade é uma discussão sobre redundância de `usuario_id`: quando repetir a FK é normal e quando ela é derivável de outra relação.
- [Gemini](https://share.gemini.google/FyHwzllzuYuQ) — *Lacunas do diagrama e proximidade.* Apontou o que faltava para chat e avaliação, o relacionamento circular entre Usuário e Endereço, a ausência de campo de papel/cargo no usuário, e detalhou o cálculo de distância por latitude/longitude.
- [Claude](https://claude.ai/share/8a8e1051-dcf7-4e6c-9840-fc1c7df7f462) — *Revisão do diagrama e o problema doação × perdido.* Focou em `Adoções` não servir para animal perdido (não existe "doador" nesse fluxo), na duplicação do "ID do Grupo" entre Anúncios e Arquivos, e na falta de coordenadas em Endereço.

## O que foi aproveitado

- **Separar chat em `Conversas` + `Mensagens`** — as três sugeriram, e é o desenho adotado. Ver [[Entidades.canvas|Entidades]].
- **`Avaliações` presa à adoção, não ao anúncio** — sugestão do Gemini, adotada: garante que só se avalia depois de um processo concluído.
- **Tabela de moderação com motivo e histórico** — o `anuncio_moderacoes` do ChatGPT virou a entidade `Moderações`.
- **Localização do anúncio separada do endereço do usuário** — as três insistiram no ponto, com o mesmo exemplo: o animal pode estar perdido longe de onde o dono mora.
- **`Usuário ID` direto em `Animais`** — sugestão do Gemini, para o animal existir no perfil sem depender de anúncio.
- **Campo de cargo no usuário** — sem ele não há como saber quem pode moderar.
- **Questionar cada `usuario_id` do diagrama** — a "faxina" proposta pelo ChatGPT virou a auditoria de redundância que gerou as decisões sobre `Adoções` e `Conversas`.

## O que foi descartado ou decidido diferente

- **PostgreSQL / PostGIS** — ChatGPT e Gemini recomendaram; o projeto usa MySQL. A busca por proximidade foi resolvida por código IBGE de município, não por cálculo de distância. Ver [[Proposta do Projeto]].
- **`conversa_participantes` como tabela separada** (ChatGPT) — desnecessário aqui: a conversa é sempre entre duas pessoas, anunciante e interessado. Tabela de participantes só se justifica em chat de grupo.
- **Tabela de arquivos polimórfica** (Gemini) — descartada porque relação polimórfica não aceita foreign key, e o modelo depende de garantia estrutural.
- **Manter `Status` e `Status ADMIN` separados** (Claude) — o modelo ficou com uma máquina de estados única. Ver [[Fluxo Status de Anuncio]].
- **Generalizar `Adoções` para `Usuario_Origem`/`Usuario_Destino`** (Claude) — o problema de doação × perdido foi resolvido pelo campo `Tipo` no anúncio. Ver [[Tipos Anuncio]].
- **"ID do Grupo"** — as três apontaram como confuso. O conceito foi eliminado; `Arquivos` aponta direto para o anúncio.
