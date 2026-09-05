---
title: Proposta do Projeto — Mais Patinhas
tags:
  - projeto
  - proposta
aliases:
  - Resumo do Projeto
  - Mais Patinhas
---

# Mais Patinhas

O Mais Patinhas é um website voltado à doação, adoção e busca de animais perdidos, criado para ajudar animais em situação de rua e reconectar tutores a pets extraviados. O sistema conecta três perfis de usuário: quem quer doar um pet, quem quer adotar, e quem perdeu um animal e precisa divulgar o caso.

## Funcionalidades principais

- **Catálogo de adoção**: usuários cadastram perfis de animais disponíveis para adoção e podem navegar pelos pets publicados por outras pessoas.
- **Aba de animais perdidos**: posts dedicados a animais perdidos (tutor procurando o bicho) e a animais encontrados (quem achou o bicho procurando o tutor), com local e data do último avistamento.
- **Chat**: bate-papo entre as partes para combinar o encontro e efetivar a adoção.
- **Filtro por região**: os posts exibidos priorizam a localidade do usuário (ex.: morador de Uberaba vê primeiro posts de Uberaba e região), em vez de resultados do país inteiro.
- **Moderação prévia**: todo post — doação ou perdido — fica pendente até um moderador aprovar ou recusar a publicação.
- **Avaliação pós-adoção**: ao final do processo de adoção/doação, as partes avaliam a experiência, construindo reputação dentro da plataforma.

O fluxo de status de um anúncio segue [[Fluxo Status de Anuncio]], e os tipos de post possíveis estão em [[Tipos Anuncio]].

## Stack técnica

- **Laravel (PHP)** — estrutura MVC, roteamento e ORM Eloquent.
- **Livewire** — interatividade no lado do servidor (filtros dinâmicos, chat, catálogo) sem API JavaScript separada.
- **Laravel Fortify** — cadastro, login, recuperação de senha e proteção contra ataques comuns.
- **MySQL** — banco de dados relacional, via migrations e Eloquent.

## Modelo de dados

Entidades principais: Usuário, Endereço, Animais, Anúncios, Arquivos e Adoções. Ver [[Entidades.canvas|Entidades]] para o diagrama completo.

## Justificativa

O abandono de animais domésticos é um problema social e de saúde pública crescente. Ao mesmo tempo, tutores que perdem seus pets costumam recorrer a cartazes ou posts dispersos em redes sociais, sem alcance direcionado. O Mais Patinhas centraliza doação, adoção e busca por perdidos em um único canal, com filtro geográfico para aumentar a relevância dos resultados e moderação para garantir a qualidade das publicações — apoiando ONGs, protetores independentes e tutores na redução do abandono e no reencontro de animais perdidos.
