# Mais Patinhas — Backend API

API REST em Laravel 13 do projeto [Mais Patinhas](../README.md). Autenticação via [Sanctum](https://laravel.com/docs/sanctum) no modo SPA (cookie httpOnly + CSRF), consumida pela SPA React em `../frontend-web`.

## Stack

- PHP 8.3, Laravel 13
- Laravel Sanctum (auth SPA)
- MySQL
- Pest (testes), Pint (estilo de código)
- Laravel Boost (integração com agentes de IA)

## Instalação

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

## Rodando

```bash
php artisan serve
```

API sobe em `http://localhost:8000`.

## Testes

```bash
php artisan test
```

## Estilo de código

```bash
vendor/bin/pint
```
