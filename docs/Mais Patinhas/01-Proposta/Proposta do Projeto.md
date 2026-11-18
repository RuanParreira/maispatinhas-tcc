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
- **Aba de animais perdidos**: posts dedicados a animais perdidos (tutor procurando o bicho) e a animais encontrados (quem achou o bicho procurando o tutor), com município e data do ocorrido.
- **Chat**: bate-papo entre as partes para combinar o encontro. Não há pedido de adoção: quem tem interesse manda mensagem, e no fim o doador marca "Doei", escolhe entre as pessoas que conversaram com ele qual adotou, e o adotante confirma.
- **Filtro por região**: os posts exibidos priorizam a localidade do usuário (ex.: morador de Uberaba vê primeiro posts de Uberaba e região), em vez de resultados do país inteiro.
- **Moderação prévia**: todo post — doação ou perdido — fica pendente até um moderador aprovar ou recusar a publicação.
- **Avaliação pós-adoção**: ao final do processo de adoção/doação, as partes avaliam a experiência, construindo reputação dentro da plataforma.

O fluxo de status de um anúncio segue [[Fluxo Status de Anuncio]], e os tipos de post possíveis estão em [[Tipos Anuncio]].

## Stack técnica

Arquitetura desacoplada: o backend só fornece dados em JSON e a interface é uma SPA separada.

- **Laravel 13 (PHP 8.4)** — API REST (`backend-api/`): rotas, validação (Form Requests), permissões (Policies), regras de negócio e ORM Eloquent.
- **Laravel Sanctum** — autenticação da SPA por cookie de sessão, com proteção CSRF.
- **React 19 + Vite** — SPA (`frontend-web/`) com React Router, Tailwind CSS e shadcn/ui; consome a API via axios.
- **MySQL 8** — banco relacional, versionado por migrations.
- **Docker Compose** — MySQL, phpMyAdmin, backend e frontend.
- **Pest** e **Postman** — testes automatizados e manuais da API.

> A primeira versão desta proposta usava Livewire e Laravel Fortify. Foram trocados porque partem do princípio de que o próprio Laravel gera as telas, o que não acontece com o frontend em React.

## Modelo de dados

Entidades: Usuário, Municípios, Animais, Anúncios, Arquivos (fotos), Moderações, Favoritos, Conversas, Mensagens, Adoções e Avaliações. No código as tabelas têm nomes em inglês (`users`, `municipalities`, `animals`, `posts`, `post_files`, `moderations`, `favorites`, `conversations`, `messages`, `adoptions`, `reviews`). Ver [[Entidades.canvas|Entidades]] para o diagrama completo.

## Estado da implementação (nov/2026)

- **Pronto:**
  - cadastro, login (com volta para a página de origem) e recuperação de senha;
  - perfil público (anúncios, adoções e avaliações recebidas);
  - configurações da conta (perfil, foto, e-mail, senha, sessões e exclusão da conta com anonimização);
  - cadastro em etapas, edição e cancelamento dos próprios anúncios, com fotos conferidas e reduzidas no envio;
  - ciclo do anúncio: pausar, retomar, expirar (comando diário), renovar e marcar como reencontrado ([[Fluxo Status de Anuncio]]);
  - catálogo por região em Adotar, Pets perdidos e Reencontros, com filtros guardados no endereço ([[Busca por Proximidade]]);
  - tela de detalhes do anúncio, com galeria, ficha do pet, card de quem anunciou e outros pets da região;
  - favoritos (só de anúncios de outras pessoas);
  - confirmação da adoção pelo adotante em Minhas adoções ([[Fluxo Status de Adocao]]);
  - home com busca por cidade e vitrine dos anúncios mais recentes.
- **A fazer:** painel de moderação, chat, indicação do adotante pelo doador ("Doei", depende do chat), avaliação pós-adoção. Ideias em estudo ficam em [[Ideias]].

## Documentos do TCC

As versões atuais dos documentos entregues (projeto, atividades, metodologia, resultados e roteiro) ficam em `docs/TCC/`, fora deste vault.

## Justificativa

O abandono de animais domésticos é um problema social e de saúde pública crescente. Ao mesmo tempo, tutores que perdem seus pets costumam recorrer a cartazes ou posts dispersos em redes sociais, sem alcance direcionado. O Mais Patinhas centraliza doação, adoção e busca por perdidos em um único canal, com filtro geográfico para aumentar a relevância dos resultados e moderação para garantir a qualidade das publicações — apoiando ONGs, protetores independentes e tutores na redução do abandono e no reencontro de animais perdidos.
