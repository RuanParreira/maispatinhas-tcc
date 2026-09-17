# Mais Patinhas — Backend API

API REST em Laravel 13 do projeto [Mais Patinhas](../README.md). Autenticação via [Sanctum](https://laravel.com/docs/sanctum) no modo SPA (cookie httpOnly + CSRF), consumida pela SPA React em `../frontend-web`.

## Stack

- PHP 8.4, Laravel 13
- Laravel Sanctum (auth SPA)
- MySQL 8
- Pest (testes), Pint (estilo de código)
- Laravel Boost (integração com agentes de IA)

## Rodando com Docker (recomendado)

Instruções completas em [`../README.md`](../README.md). Resumo:

```bash
docker compose up -d --build
```

API sobe em `http://localhost:8000`, migrations rodam sozinhas.

Comandos comuns dentro do container:

```bash
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan test
docker compose exec backend vendor/bin/pint
docker compose exec backend composer require alguma/lib   # depois: docker compose up -d --build
```

## Rodando sem Docker (manual)

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edite `.env`:

- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — credenciais do seu MySQL local.
- `FRONTEND_URL` e `SANCTUM_STATEFUL_DOMAINS` — já vêm configurados para `http://localhost:5173` / `localhost:5173`, ajuste se a SPA rodar em outra porta/domínio.

```bash
php artisan migrate
```

### Rodando

```bash
php artisan serve
```

API sobe em `http://localhost:8000`.

### Testes

```bash
php artisan test
```

### Estilo de código

```bash
vendor/bin/pint
```
