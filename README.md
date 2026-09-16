# Mais Patinhas

TCC — plataforma de doação, adoção e busca de animais perdidos. Conecta três perfis de usuário: quem quer doar um pet, quem quer adotar, e quem perdeu (ou encontrou) um animal.

Funcionalidades principais: catálogo de adoção, posts de animais perdidos/encontrados com filtro por região, chat entre as partes, moderação prévia de posts e avaliação pós-adoção. Detalhes da proposta e modelagem em [`docs/`](docs/Mais%20Patinhas/00%20-%20Início.md).

## Arquitetura

Backend e frontend desacoplados:

- **`backend-api/`** — Laravel 13 API REST, autenticação via Sanctum (SPA/cookie).
- **`frontend-web/`** — React (Vite), consome a API via `axios`.

## Pré-requisitos

- PHP 8.3+ e Composer
- Node.js 20+ e npm
- MySQL

## Instalação

Clone o repositório e configure as duas partes:

### 1. Backend

```bash
cd backend-api
composer install
cp .env.example .env
php artisan key:generate
```

Edite `.env` e configure `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` com as credenciais do seu MySQL local. Depois rode as migrations:

```bash
php artisan migrate
```

### 2. Frontend

```bash
cd frontend-web
npm install
```

## Rodando o projeto

Dois terminais, um pra cada parte:

```bash
# terminal 1 — API em http://localhost:8000
cd backend-api
php artisan serve

# terminal 2 — SPA em http://localhost:5173
cd frontend-web
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Documentação de cada parte

- [`backend-api/README.md`](backend-api/README.md)
- [`frontend-web/README.md`](frontend-web/README.md)
