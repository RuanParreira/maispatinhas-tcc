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

Se o `.env` do backend estiver vazio ou sem `APP_KEY`, gere a chave antes de testar login:

```bash
docker compose exec backend php artisan key:generate
```

Credenciais do banco do Docker (já configuradas no Compose):

- `DB_HOST=db` (dentro do container)
- `DB_DATABASE=maispatinhas`
- `DB_USERNAME=maispatinhas`
- `DB_PASSWORD=secret`

Para execução local fora do Docker, use `DB_HOST=127.0.0.1` e as mesmas credenciais do banco.

## Configurar o MailTrap

- Vá no site do mailtrap: https://mailtrap.io/
- Depois vá nos sandoboxes e projects: https://mailtrap.io/sandboxes/projects
- Crie um novo projeto, ele dará as informações para colocar no .env

Exemplo:

```
    HOST: sandbox.smtp.mailtrap.io
    PORT: 25, 465, 587 or 2525
    USERNAME: d9bcb6c6a123123
    PASSWORD: ****44b3
    AUTH: PLAIN, LOGIN and CRAM-MD5
    TLS: Optional (STARTTLS on all ports)
```
- Coloque `MAIL_MAILER=smtp`
- Vá até o phpMyAdmin e no seu usuário remova a data da coluna `email_verified_at` e deixe nulo
- Acesse a rota: `/verify-email`
- E clique em `Reenviar e-mail de verificação`
- Se o email aparecer na tela do MailTrap deu tudo certo
- Clique no botão de `verificar e-mail` e pronto


## Comandos comuns dentro do container:

```bash
docker compose exec backend php artisan key:generate
 docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan test
docker compose exec backend vendor/bin/pint
docker compose exec backend composer require alguma/lib   # depois: docker compose up -d --build
```

O `--build` só é necessário quando a imagem ou dependências do container mudaram. Em um ambiente já funcionando, normalmente basta `docker compose up -d`.

## Rodando sem Docker (manual)

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edite `.env`:

- `DB_CONNECTION=mysql`
- `DB_DATABASE=maispatinhas`
- `DB_USERNAME=maispatinhas`
- `DB_PASSWORD=secret`
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
