# Mais Patinhas — Frontend Web

SPA React do projeto [Mais Patinhas](../README.md). Consome a API REST em `../backend-api` via `axios`, com autenticação por cookie de sessão (Sanctum SPA).

## Stack

- React 19 + Vite
- React Router
- axios (`withCredentials` + CSRF cookie do Sanctum)
- ESLint

## Instalação

```bash
npm install
```

A URL da API (`http://localhost:8000`) está configurada em `src/api/axios.js`.

## Rodando

```bash
npm run dev
```

SPA sobe em `http://localhost:5173`. Backend precisa estar rodando em paralelo (`php artisan serve` em `../backend-api`).

## Outros comandos

```bash
npm run build     # build de produção
npm run preview   # preview do build
npm run lint      # ESLint
```
