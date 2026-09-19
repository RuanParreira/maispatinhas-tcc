# Mais Patinhas

TCC — plataforma de doação, adoção e busca de animais perdidos. Conecta três perfis de usuário: quem quer doar um pet, quem quer adotar, e quem perdeu (ou encontrou) um animal.

Funcionalidades principais: catálogo de adoção, posts de animais perdidos/encontrados com filtro por região, chat entre as partes, moderação prévia de posts e avaliação pós-adoção. Detalhes da proposta e modelagem em [`docs/`](docs/Mais%20Patinhas/00%20-%20Início.md).

## Arquitetura

Backend e frontend desacoplados:

- **`backend-api/`** — Laravel 13 API REST (PHP 8.4), autenticação via Sanctum (SPA/cookie).
- **`frontend-web/`** — React (Vite, Node 24), consome a API via `axios`.

## Rodando com Docker (recomendado)

Pré-requisito: [Docker](https://docs.docker.com/get-docker/) e Docker Compose (já vem junto no Docker Desktop).

```bash
git clone <repo>
cd maispatinhas-tcc
docker compose up -d --build
```

O primeiro `up` builda as imagens, sobe o MySQL, espera o banco ficar pronto e roda as migrations sozinho. Nada mais precisa ser instalado no seu PC — nem PHP, nem Composer, nem Node.

| Serviço      | URL                        | O que é                                                                                                                  |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `frontend`   | http://localhost:5173      | SPA React (Vite dev server)                                                                                              |
| `backend`    | http://localhost:8000      | API Laravel                                                                                                              |
| `phpmyadmin` | http://localhost:8080      | Admin do MySQL (login: `maispatinhas` / `secret`)                                                                        |
| `db`         | `127.0.0.1:3307` (do host) | MySQL 8 — use essa porta em ferramentas externas (DBeaver, Workbench). Internamente os containers acessam via `db:3306`. |

### Comandos do dia a dia

```bash
docker compose logs -f backend        # acompanhar logs de um serviço
docker compose exec backend php artisan key:generate         # gerar APP_KEY caso o .env esteja vazio
docker compose exec backend php artisan migrate:fresh --seed   # resetar banco
docker compose exec backend composer require alguma/lib        # instalar lib PHP
docker compose exec frontend npm install alguma-lib             # instalar lib JS
docker compose down                    # parar tudo
docker compose down -v                 # parar e apagar dados do banco
```

### Credenciais do ambiente Docker

As credenciais já estão configuradas no [docker-compose.yml](docker-compose.yml), então normalmente você não precisa editar nada manualmente:

- Banco: `maispatinhas`
- Usuário: `maispatinhas`
- Senha: `secret`
- Host interno do backend: `db`
- Importante: quando o backend roda dentro do container, o host do banco é `db`; em execução local fora do Docker, o host é `127.0.0.1`.

Se o Laravel estiver com `APP_KEY` vazio, o login falha com erro de sessão/criptografia. Nesse caso, rode:

```bash
docker compose exec backend php artisan key:generate
```

Instalou uma dependência nova (`composer.json`/`package.json` mudou, seja local ou via `exec` acima)? Quem for atualizar o ambiente precisa rebuildar a imagem:

```bash
docker compose up -d --build
```

O `--build` serve para reconstruir a imagem do container quando mudou o `Dockerfile`, dependências do sistema, ou a base do ambiente. Para o caso normal de já ter o ambiente funcionando, `docker compose up -d` costuma bastar.

Ainda dá pra usar Composer/Node instalados no seu PC normalmente (ex: rodar `composer require` local só pra atualizar `composer.json`/`composer.lock`) — o container só lê esses arquivos no build, não interfere um com o outro.

## Rodando sem Docker (manual)

Pré-requisitos:

- PHP 8.4+ e Composer
- Node.js 24+ e npm
- MySQL

Ver instruções detalhadas em cada parte:

- [`backend-api/README.md`](backend-api/README.md)
- [`frontend-web/README.md`](frontend-web/README.md)
