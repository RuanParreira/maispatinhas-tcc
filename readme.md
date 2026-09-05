# 🐾 Mais Patinhas

O **Mais Patinhas** é um marketplace voltado para a causa animal. A plataforma conecta pessoas e ONGs que desejam disponibilizar animais para adoção com usuários que buscam adotar um novo pet.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

* [Git](https://git-scm.com/)
* [PHP](https://www.php.net/) 8.3 ou superior
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/) 22 ou superior (com NPM)

O banco padrão é **SQLite**, que não precisa de servidor — o arquivo é criado automaticamente em `database/database.sqlite`. Se preferir usar MySQL ou MariaDB, veja [Usando MySQL](#usando-mysql-opcional) no final.

---

## 🚀 Instalação

**1. Clone o repositório**

```bash
git clone https://github.com/RuanParreira/maispatinhas-tcc
cd maispatinhas-tcc
```

**2. Rode o setup**

```bash
composer setup
```

Esse comando faz tudo de uma vez: instala as dependências do PHP e do Node, cria o `.env` a partir do `.env.example`, gera a chave da aplicação, roda as migrações e compila os assets.

<details>
<summary>Prefere fazer passo a passo?</summary>

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run build
```

</details>

---

## 🌱 Dados de teste

O `composer setup` cria as tabelas, mas deixa o banco vazio. Para recriar o schema **já com dados navegáveis**:

```bash
php artisan migrate:fresh --seed
```

> **Atenção:** o `migrate:fresh` apaga todas as tabelas antes de recriá-las. Tudo que estiver no banco se perde. Em um banco que você não quer zerar, use `php artisan db:seed`, que só insere.

O seed monta um cenário em Uberaba, para dar o que ver no filtro por região: dez usuários, cinco animais, cinco posts em estados diferentes do fluxo de moderação (publicado, na fila, perdido e rejeitado), uma conversa com mensagens, duas adoções e as avaliações de uma adoção concluída.

Três contas ficam com e-mail e senha fixos:

| E-mail | Papel | Senha |
| --- | --- | --- |
| `admin@admin.com` | moderador | `Bomdia123` |
| `doador@doador.com` | publica os posts | `Bomdia123` |
| `adota@adota.com` | solicita adoção | `Bomdia123` |

Os outros sete usuários têm e-mail gerado aleatoriamente e existem só para o catálogo não ficar vazio.

---

## 📦 Dependências: quando rodar o install

> **Sempre que uma biblioteca nova entrar no projeto, é preciso instalar as dependências de novo.** Isso vale nas duas situações abaixo.

### Depois de dar `git pull`

Se alguém da equipe adicionou uma biblioteca, o código dela **não vem no pull** — o Git versiona apenas o `composer.lock` e o `package-lock.json`, não as pastas `vendor/` e `node_modules/`, que estão no `.gitignore`.

Então, depois de puxar as alterações:

```bash
git pull
composer install   # se o composer.lock mudou
npm install        # se o package-lock.json mudou
```

Na dúvida, rode os dois — se nada mudou, o comando termina em segundos sem fazer nada.

Sinal de que você esqueceu: erros de `Class não encontrada`, `Unable to locate file in Vite manifest`, ou a aplicação quebrando logo depois de um pull que estava funcionando antes.

Se a biblioteca nova trouxe migrações, rode também:

```bash
php artisan migrate
```

### Depois de instalar uma biblioteca você mesmo

Ao rodar `composer require` ou `npm install <pacote>`, o arquivo de lock é atualizado. **Comite o lock junto com o código**, senão a equipe e o CI não conseguem instalar a mesma versão:

```bash
composer require vendor/pacote
git add composer.json composer.lock
```

```bash
npm install pacote
git add package.json package-lock.json
```

Se o pacote publicar arquivos de configuração, migrações ou views, comite esses arquivos também.

---

## 💻 Executando o Projeto

Um comando só, que sobe o servidor, a fila e o Vite juntos:

```bash
composer dev
```

<details>
<summary>Prefere terminais separados?</summary>

**Terminal 1 — servidor PHP:**

```bash
php artisan serve
```

**Terminal 2 — compilação de assets:**

```bash
npm run dev
```

</details>

A aplicação estará disponível em [http://localhost:8000](http://localhost:8000).

---

## ✅ Antes de dar push

O CI roda formatação, análise estática e testes a cada push na `main`. Rode o mesmo conjunto localmente para não descobrir o erro depois:

```bash
composer test
```

Comandos individuais, se quiser rodar separado:

| Comando | O que faz |
| --- | --- |
| `composer lint` | corrige a formatação com o Pint |
| `composer lint:check` | só verifica, sem alterar arquivos |
| `composer types:check` | análise estática com o PHPStan |
| `php artisan test --compact` | roda a suíte de testes |

---

## 🗄️ Usando MySQL (opcional)

O projeto funciona em SQLite sem configuração nenhuma. Para usar MySQL ou MariaDB, descomente e preencha as variáveis no seu `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=maispatinhas
DB_USERNAME=root
DB_PASSWORD=
```

> **Atenção:** trocar `DB_CONNECTION` para `mysql` sem preencher `DB_DATABASE` faz o Laravel cair no banco padrão `laravel`, que provavelmente não existe ou está vazio — e a aplicação parece funcionar até a primeira consulta falhar.

Depois de configurar, crie o banco e rode as migrações:

```bash
php artisan migrate
```

Mantenha o `.env.example` com `DB_CONNECTION=sqlite`. O CI usa esse arquivo e não tem servidor MySQL disponível.

---

## 📚 Documentação

A modelagem do projeto (entidades, fluxos de status, pesquisa) fica no vault do Obsidian em [`documentation/Mais Patinhas`](documentation/Mais%20Patinhas). Abra a pasta `documentation` como vault para navegar pelos links e pelo canvas de entidades.
