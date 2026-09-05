# 🐾 Mais Patinhas

O **Mais Patinhas** é um marketplace voltado para a causa animal. A plataforma conecta pessoas e ONGs que desejam disponibilizar animais para adoção com usuários que buscam adotar um novo pet.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
* [Git](https://git-scm.com/)
* [PHP](https://www.php.net/)
* [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/) (com NPM)
* O banco de dados local (MariaDB)

---

## 🚀 Instalação e Configuração

Siga os passos abaixo para preparar o ambiente de desenvolvimento local:

**1. Clone o repositório**
```bash
git clone https://github.com/RuanParreira/maispatinhas-tcc
cd maispatinhas-tcc
```

**2. Instale as dependências**
Instale os pacotes do back-end (PHP) e do front-end (Node):
```bash
composer install
npm install
```

**3. Configure o ambiente**
Crie uma cópia do arquivo de configuração padrão:
```bash
cp .env.example .env
```
> **Aviso:** Abra o arquivo `.env` gerado e configure as credenciais do seu banco de dados (variáveis `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

**4. Gere a chave da aplicação**
```bash
php artisan key:generate
```

**5. Execute as migrações**
Crie as tabelas no seu banco de dados:
```bash
php artisan migrate
```
*(Se o projeto tiver dados de teste, você pode usar `php artisan migrate --seed`)*

---

## 💻 Executando o Projeto

Para rodar a aplicação, você precisará de **dois terminais** abertos rodando simultaneamente.

**Terminal 1 (Back-end / Servidor PHP):**
```bash
php artisan serve
```

**Terminal 2 (Front-end / Compilação de assets):**
```bash
npm run dev
```

A aplicação estará disponível no seu navegador em: [http://localhost:8000](http://localhost:8000)
