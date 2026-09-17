# Mais Patinhas — Frontend Web

SPA React do projeto [Mais Patinhas](../README.md). Consome a API REST em `../backend-api` via `axios`, com autenticação por cookie de sessão (Sanctum SPA).

## Stack

- React 19 + Vite
- Node 24
- React Router
- axios (`withCredentials` + CSRF cookie do Sanctum)
- ESLint

## Rodando com Docker (recomendado)

Instruções completas em [`../README.md`](../README.md). Resumo:

```bash
docker compose up -d --build
```

SPA sobe em `http://localhost:5173`, com hot-reload (o código local é montado dentro do container).

Comandos comuns dentro do container:

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm install alguma-lib   # depois: docker compose up -d --build
```

## Rodando sem Docker (manual)

```bash
npm install
```

A URL da API (`http://localhost:8000`) está configurada em `src/api/axios.js`.

### Rodando

```bash
npm run dev
```

SPA sobe em `http://localhost:5173`. Backend precisa estar rodando em paralelo (`php artisan serve` em `../backend-api`).

### Outros comandos

```bash
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # ESLint
```
