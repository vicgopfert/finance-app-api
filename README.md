# 💰 Finance App API

API REST para gestão de finanças pessoais, construída com **Node.js**, **Express 5**, **PostgreSQL** e **Prisma**, aplicando **Clean Architecture**, injeção de dependência via factories e uma suíte de testes com cobertura em todas as camadas.

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white" alt="Node 20" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL 17" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white" alt="Jest 30" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" alt="GitHub Actions" />
</p>

## 🔗 Links

| Recurso | URL |
| ------- | --- |
| 🚀 API em produção | https://finance-app-api-jyef.onrender.com |
| 📖 Documentação Swagger | https://finance-app-api-jyef.onrender.com/docs |

> ℹ️ A API está hospedada no plano gratuito do Render, então a primeira requisição após um período de inatividade pode levar alguns segundos (cold start).

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Stack](#-stack)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Endpoints](#-endpoints)
- [Autenticação](#-autenticação)
- [Como executar localmente](#-como-executar-localmente)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Testes](#-testes)
- [Qualidade de código](#-qualidade-de-código)
- [Deploy e CI/CD](#-deploy-e-cicd)

---

## 📌 Sobre o projeto

A Finance App API permite que um usuário se cadastre, autentique-se e registre suas movimentações financeiras — **ganhos**, **despesas** e **investimentos** —, obtendo em seguida um resumo do seu saldo por período, com totais e distribuição percentual de cada tipo de transação.

Todas as rotas de dados operam sobre o usuário autenticado (`/me`), ou seja, o `userId` é sempre extraído do token JWT e nunca aceito pelo cliente. Isso elimina a possibilidade de um usuário ler ou alterar dados de outro.

O projeto foi construído com foco em **separação de responsabilidades**, **testabilidade** e **automação de qualidade** — cada camada é isolada, injetada por construtor e testada de forma independente.

---

## 🛠 Stack

### Core

| Tecnologia | Uso |
| ---------- | --- |
| **Node.js 20** (ESM) | Runtime |
| **Express 5** | Framework HTTP |
| **PostgreSQL 17** | Banco de dados relacional |
| **Prisma 7** + `@prisma/adapter-pg` | ORM, migrations e driver adapter para `pg` |

### Segurança e validação

| Tecnologia | Uso |
| ---------- | --- |
| **jsonwebtoken** | Geração e verificação de access/refresh tokens |
| **bcrypt** | Hash de senhas |
| **Zod 4** | Validação de schemas de entrada (body, params e query) |
| **validator** / **uuid** | Validações auxiliares e geração de IDs |

### Documentação

| Tecnologia | Uso |
| ---------- | --- |
| **Swagger UI Express** | Documentação interativa em `/docs` |

### Testes

| Tecnologia | Uso |
| ---------- | --- |
| **Jest 30** | Testes unitários, de integração e relatório de cobertura |
| **Supertest** | Testes end-to-end das rotas HTTP |
| **@faker-js/faker** | Geração de dados de teste |

### Qualidade e automação

| Tecnologia | Uso |
| ---------- | --- |
| **ESLint 10** + **Prettier 3** | Padronização e formatação de código |
| **Husky** + **lint-staged** | Git hooks (lint/format automáticos no pre-commit) |
| **Commitlint** (Conventional Commits) | Padronização das mensagens de commit |
| **Docker Compose** | Bancos PostgreSQL de desenvolvimento e de teste |
| **GitHub Actions** | Pipeline de CI/CD |
| **Render** | Hospedagem da API |

---

## ✨ Funcionalidades

### 🔐 Autenticação

- Cadastro de usuário com senha criptografada (bcrypt) e retorno imediato dos tokens
- Login por e-mail e senha
- Access token com validade de **15 minutos** e refresh token com validade de **30 dias**
- Renovação de sessão via refresh token
- Middleware de autenticação com tratamento distinto para token ausente/inválido (`Unauthorized`) e token expirado (`Token expired`)

### 👤 Usuários

- Consulta dos dados do usuário autenticado
- Atualização parcial do perfil (com rejeição de campos não permitidos)
- Exclusão de conta, com remoção em cascata de todas as transações (`onDelete: Cascade`)
- Bloqueio de cadastro com e-mail já em uso

### 💸 Transações

- Criação de transações dos tipos `EARNING`, `EXPENSE` e `INVESTMENT`
- Listagem por período (`from` / `to`)
- Atualização parcial e exclusão por ID
- Valores monetários em `Decimal(10,2)`, evitando erros de ponto flutuante

### 📊 Saldo

- Cálculo de saldo por período com agregação no banco (`Prisma.aggregate`)
- Totais de ganhos, despesas e investimentos
- Distribuição percentual de cada tipo sobre o total movimentado
- Aritmética feita com `Prisma.Decimal`, garantindo precisão monetária

---

## 🏗 Arquitetura

O projeto segue os princípios de **Clean Architecture**, com o fluxo de uma requisição atravessando camadas independentes e desacopladas:

```
Request → Route → Middleware (auth) → Controller → Use Case → Repository → PostgreSQL
                                          ↓            ↓
                                    Zod Schema      Adapters
```

Cada camada tem uma responsabilidade única:

- **Routes** — definem os endpoints e injetam o `userId` do token no request
- **Middlewares** — validam o access token JWT
- **Controllers** — validam a entrada com Zod, traduzem erros de domínio em status HTTP
- **Use Cases** — concentram as regras de negócio, sem conhecer Express ou Prisma
- **Repositories** — acesso a dados via Prisma, isolando o ORM do restante do sistema
- **Adapters** — abstrações de bibliotecas externas (bcrypt, jsonwebtoken, uuid)
- **Factories** — montam a árvore de dependências (injeção por construtor)
- **Errors** — erros de domínio tipados (`UserNotFoundError`, `EmailAlreadyInUseError`, ...)

Como todas as dependências são recebidas via construtor, cada camada pode ser testada em isolamento com stubs — sem banco de dados e sem servidor HTTP.

### Estrutura de pastas

```
├── prisma/
│   ├── migrations/           # Histórico de migrations
│   ├── schema.prisma         # Modelos User e Transaction
│   └── prisma.js             # Cliente Prisma com adapter pg
├── docs/
│   └── swagger.json          # Especificação OpenAPI
├── src/
│   ├── adapters/             # bcrypt, jsonwebtoken, uuid
│   ├── controllers/          # auth, user, transaction + helpers HTTP
│   ├── errors/               # Erros de domínio
│   ├── factories/            # Injeção de dependência
│   ├── middlewares/          # Autenticação JWT
│   ├── repositories/postgres/# Acesso a dados
│   ├── routes/               # Definição dos endpoints + testes e2e
│   ├── schemas/              # Validações Zod
│   ├── tests/fixtures/       # Dados de teste
│   ├── use-cases/            # Regras de negócio
│   └── app.js                # Configuração do Express
├── .github/workflows/        # Pipeline de CI/CD
├── docker-compose.yml        # PostgreSQL (dev e test)
└── index.js                  # Entry point
```

### Modelo de dados

```prisma
model User {
  id           String        @id @default(uuid())
  first_name   String        @db.VarChar(50)
  last_name    String        @db.VarChar(50)
  email        String        @unique @db.VarChar(100)
  password     String        @db.VarChar(255)
  transactions Transaction[]
}

model Transaction {
  id      String          @id @default(uuid())
  user_id String
  name    String          @db.VarChar(50)
  date    DateTime        @db.Date
  amount  Decimal         @db.Decimal(10, 2)
  type    TransactionType // EARNING | EXPENSE | INVESTMENT
  user    User            @relation(fields: [user_id], references: [id], onDelete: Cascade)
}
```

---

## 🌐 Endpoints

Base URL de produção: `https://finance-app-api-jyef.onrender.com`

### Autenticação

| Método | Rota | Auth | Descrição | Sucesso |
| ------ | ---- | :--: | --------- | ------- |
| `POST` | `/api/users` | ❌ | Cria um novo usuário e retorna os tokens | `201` |
| `POST` | `/api/auth/login` | ❌ | Autentica o usuário e retorna os tokens | `200` |
| `POST` | `/api/auth/refresh-token` | ❌ | Gera um novo par de tokens | `200` |

### Usuários

| Método | Rota | Auth | Descrição | Sucesso |
| ------ | ---- | :--: | --------- | ------- |
| `GET` | `/api/users/me` | ✅ | Retorna os dados do usuário autenticado | `200` |
| `PATCH` | `/api/users/me` | ✅ | Atualiza os dados do usuário autenticado | `200` |
| `DELETE` | `/api/users/me` | ✅ | Exclui a conta do usuário autenticado | `200` |
| `GET` | `/api/users/me/balance?from=&to=` | ✅ | Retorna o saldo do período | `200` |

### Transações

| Método | Rota | Auth | Descrição | Sucesso |
| ------ | ---- | :--: | --------- | ------- |
| `GET` | `/api/transactions/me?from=&to=` | ✅ | Lista as transações do período | `200` |
| `POST` | `/api/transactions/me` | ✅ | Cria uma transação | `201` |
| `PATCH` | `/api/transactions/me/:id` | ✅ | Atualiza uma transação | `200` |
| `DELETE` | `/api/transactions/me/:id` | ✅ | Exclui uma transação | `200` |

### Códigos de erro

| Código | Significado |
| ------ | ----------- |
| `400` | Falha de validação (Zod) ou e-mail já em uso |
| `401` | Token ausente, inválido, expirado ou credenciais incorretas |
| `404` | Usuário ou transação não encontrada |
| `500` | Erro interno do servidor |

### Exemplos

<details>
<summary><strong>POST /api/users</strong> — cadastro</summary>

```jsonc
// Request
{
  "first_name": "Victor",
  "last_name": "Gopfert",
  "email": "victor@email.com",
  "password": "123456"
}

// Response 201
{
  "message": "User created successfully",
  "user": {
    "id": "9f1c...",
    "first_name": "Victor",
    "last_name": "Gopfert",
    "email": "victor@email.com"
  },
  "tokens": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

</details>

<details>
<summary><strong>POST /api/auth/login</strong> — autenticação</summary>

```jsonc
// Request
{
  "email": "victor@email.com",
  "password": "123456"
}

// Response 200
{
  "id": "9f1c...",
  "first_name": "Victor",
  "last_name": "Gopfert",
  "email": "victor@email.com",
  "tokens": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

</details>

<details>
<summary><strong>POST /api/transactions/me</strong> — criar transação</summary>

```jsonc
// Headers
// Authorization: Bearer <accessToken>

// Request
{
  "name": "Salário",
  "date": "2026-07-01T00:00:00.000Z",
  "amount": 5000.00,
  "type": "EARNING"  // EARNING | EXPENSE | INVESTMENT
}
```

</details>

<details>
<summary><strong>GET /api/users/me/balance?from=2026-07-01&to=2026-07-31</strong> — saldo</summary>

```jsonc
// Response 200
{
  "earnings": "5000",
  "expenses": "1200",
  "investments": "800",
  "earningsPercentage": "71",
  "expensesPercentage": "17",
  "investmentsPercentage": "11",
  "balance": "3000"
}
```

</details>

📖 A especificação completa, com todos os schemas de request e response, está disponível no [Swagger UI](https://finance-app-api-jyef.onrender.com/docs).

---

## 🔒 Autenticação

A API usa autenticação **JWT** com dois tokens:

| Token | Validade | Uso |
| ----- | -------- | --- |
| `accessToken` | 15 minutos | Enviado em cada requisição autenticada |
| `refreshToken` | 30 dias | Usado para obter um novo par de tokens |

Envie o access token no header `Authorization`:

```http
Authorization: Bearer <accessToken>
```

Quando o access token expirar, a API responde `401 { "message": "Token expired" }`. Basta então chamar `POST /api/auth/refresh-token` com o refresh token para renovar a sessão:

```jsonc
// Request
{ "refreshToken": "eyJhbGciOi..." }

// Response 200
{ "tokens": { "accessToken": "...", "refreshToken": "..." } }
```

Boas práticas aplicadas:

- Senhas nunca são armazenadas em texto puro (hash com bcrypt)
- O `userId` vem sempre do token, nunca do cliente
- Login com e-mail inexistente e senha incorreta retornam a **mesma** mensagem genérica (`Invalid credentials.`), evitando enumeração de usuários
- Secrets de access e refresh token são independentes

---

## ⚙️ Como executar localmente

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/vicgopfert/finance-app-api.git
cd finance-app-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` conforme a seção [Variáveis de ambiente](#-variáveis-de-ambiente).

### 4. Suba o banco de dados

```bash
docker compose up -d postgres
```

### 5. Aplique as migrations

```bash
npx prisma migrate deploy
```

### 6. Inicie a aplicação

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:<PORT>` e a documentação em `http://localhost:<PORT>/docs`.

### Scripts disponíveis

| Script | Descrição |
| ------ | --------- |
| `npm run start:dev` | Inicia a API em modo watch |
| `npm start` | Inicia a API em produção |
| `npm test` | Executa toda a suíte de testes |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run test:coverage` | Gera o relatório de cobertura |
| `npm run lint` | Executa o ESLint |
| `npm run prettier:format` | Formata o código |
| `npm run prettier:check` | Verifica a formatação |

---

## 🔑 Variáveis de ambiente

| Variável | Descrição |
| -------- | --------- |
| `PORT` | Porta em que a API será exposta |
| `POSTGRES_USER` | Usuário do PostgreSQL (Docker) |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL (Docker) |
| `POSTGRES_DB` | Nome do banco (Docker) |
| `POSTGRES_HOST` | Host do banco |
| `POSTGRES_PORT` | Porta do banco de desenvolvimento |
| `POSTGRES_TEST_PORT` | Porta do banco de testes |
| `DATABASE_URL` | String de conexão usada pelo Prisma |
| `JWT_ACCESS_TOKEN_SECRET` | Secret usado para assinar o access token |
| `JWT_REFRESH_TOKEN_SECRET` | Secret usado para assinar o refresh token |

Os testes usam um arquivo `.env.test` separado (não versionado), apontando para o container `postgres-test` — assim a base de desenvolvimento nunca é afetada:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:<POSTGRES_TEST_PORT>/<POSTGRES_DB>
JWT_ACCESS_TOKEN_SECRET=test-access-token-secret
JWT_REFRESH_TOKEN_SECRET=test-refresh-token-secret
```

---

## 🧪 Testes

A suíte tem **41 arquivos de teste** cobrindo todas as camadas da aplicação:

| Tipo | Escopo | Ferramenta |
| ---- | ------ | ---------- |
| **Unitário** | Use cases, controllers, adapters, middlewares e factories, com dependências stubadas | Jest |
| **Integração** | Repositories executando contra um PostgreSQL real | Jest + Prisma |
| **End-to-end** | Rotas HTTP completas, do request ao banco | Jest + Supertest |

O banco de testes é limpo antes de cada teste (`beforeEach` global em `jest.setup-after-env.js`), garantindo isolamento total entre os casos.

```bash
# Sobe o banco de testes
docker compose up -d --wait postgres-test

# Aplica as migrations no banco de teste
npx dotenv -e .env.test -- npx prisma migrate deploy

# Executa os testes
npm test

# Com relatório de cobertura
npm run test:coverage
```

A cobertura é coletada de todo o diretório `src/` (excluindo os próprios arquivos de teste) e o relatório HTML fica em `coverage/lcov-report/index.html`.

---

## ✅ Qualidade de código

O projeto automatiza a garantia de qualidade em três momentos:

### 1. Durante o desenvolvimento

- **ESLint** com a configuração `@eslint/js` recommended
- **Prettier** com padrão consistente (4 espaços, sem ponto e vírgula, aspas simples)

### 2. No commit (Git hooks com Husky)

| Hook | Ação |
| ---- | ---- |
| `pre-commit` | `lint-staged` executa ESLint e Prettier nos arquivos alterados |
| `commit-msg` | `commitlint` valida a mensagem no padrão **Conventional Commits** |

Isso garante que nenhum código fora do padrão ou commit mal formatado entre no histórico.

### 3. No push (CI)

O pipeline valida lint, formatação e a suíte completa de testes contra um PostgreSQL real antes de qualquer deploy.

### Padrões aplicados

- **Clean Architecture** com camadas independentes
- **Dependency Injection** por construtor, via factories
- **Adapter Pattern** para isolar bibliotecas externas
- **Repository Pattern** para isolar o acesso a dados
- **Erros de domínio tipados**, traduzidos em respostas HTTP nos controllers
- **Validação centralizada** com Zod, separada da lógica de negócio

---

## 🚀 Deploy e CI/CD

A aplicação está hospedada no **Render** e o deploy é totalmente automatizado via **GitHub Actions**, disparado a cada push na branch `main`.

O workflow executa três jobs sequenciais — se qualquer etapa falhar, o deploy não acontece:

```
┌──────────────────────────┐
│  1. check                │
│  ────────────────────    │
│  • npm ci                │
│  • Sobe PostgreSQL       │
│    de teste (Docker)     │
│  • prisma migrate deploy │
│  • ESLint                │
│  • Prettier --check      │
│  • Suíte de testes       │
└───────────┬──────────────┘
            ↓
┌──────────────────────────┐
│  2. migrate              │
│  ────────────────────    │
│  • Valida os secrets     │
│  • Aplica as migrations  │
│    no banco de produção  │
└───────────┬──────────────┘
            ↓
┌──────────────────────────┐
│  3. deploy               │
│  ────────────────────    │
│  • Valida os secrets     │
│  • Dispara o deploy hook │
│    do Render             │
└──────────────────────────┘
```

Destaques do pipeline:

- **Testes contra banco real** — o CI sobe um container PostgreSQL com healthcheck e aguarda ficar saudável antes de rodar as migrations e os testes
- **Migrations versionadas** — aplicadas em produção automaticamente, antes do deploy da aplicação
- **Validação de secrets** — o job falha com mensagem explícita se algum secret obrigatório não estiver configurado no environment `production`
- **Cleanup garantido** — os containers são derrubados mesmo em caso de falha (`if: always()`)

---

## 👤 Autor

**Victor Gopfert**

[![GitHub](https://img.shields.io/badge/GitHub-vicgopfert-181717?logo=github&logoColor=white)](https://github.com/vicgopfert)
