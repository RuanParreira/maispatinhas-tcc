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


## Testando a API com o Postman

A collection fica em [`postman/MaisPatinhas.postman_collection.json`](postman/MaisPatinhas.postman_collection.json). No Postman: **Import** → arraste o arquivo.

Com a API rodando, basta rodar **Auth → Login** uma vez e depois qualquer outra requisição. Os scripts da collection cuidam do resto:

- Adicionam em toda requisição os headers que o Sanctum exige: `Accept`, `Referer` (sem ele a sessão é ignorada e tudo responde 401) e `X-XSRF-TOKEN`.
- Buscam o token CSRF sozinhos quando ainda não existe, e guardam o token novo que o Laravel devolve em cada resposta. Não precisa rodar `/sanctum/csrf-cookie` na mão.
- Os cadastros salvam o id do post criado em `{{post_id}}` (e da primeira foto em `{{photo_id}}`), usados por Editar, Deletar e Buscar pelo ID. **Meus anúncios → Listar** também preenche `{{post_id}}` com o anúncio mais recente.

As variáveis (`base_url`, `post_id`, `photo_id`...) ficam na collection, aba **Variables**. O login usa a conta `walysson@gmail.com` do seeder (senha `password`).

Fluxo sugerido: **Login** → **Cadastrar (com fotos)** → **Listar** → **Editar (sem fotos)** → **Editar (com fotos)** → **Deletar**. Para testar permissão, rode **Login como Ruan** e tente editar/deletar o post do walysson: deve dar 403.

Pontos de atenção:

- **Fotos:** nas requisições "com fotos", selecione os arquivos no campo `images[]` (aba Body). Cada foto precisa ter no mínimo 300×300 e menos de 2 MB (limite do PHP do container).
- **Editar com fotos** vai como `POST` com o campo `_method=PATCH`: o PHP não lê arquivos enviados via `PATCH`. Sem fotos, `PATCH` com JSON funciona normalmente.
- Em form-data, booleanos são `1`/`0` (`true`/`false` em texto dá 422).
- **401:** a sessão caiu, rode o Login de novo. **419:** token CSRF expirado, só reenvie a requisição.
- Anúncios novos ficam em `pending_approval`, então não aparecem em **Anúncios públicos → Todos os anúncios** até serem aprovados.

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
php artisan storage:link
```

O `storage:link` cria o atalho `public/storage` → `storage/app/public`, por onde a API serve as fotos enviadas (avatares, fotos dos posts). Ele não vai para o Git, então cada máquina precisa rodar uma vez. Se você também usa o Docker, rode `php artisan storage:link --force` ao voltar para o modo manual: o container recria o link com o caminho de dentro dele, que não existe no seu PC.

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
