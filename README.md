# Campaign Link Management

API REST para gerenciamento de links de campanha com parâmetros UTM, construída com Node.js, TypeScript e Clean Architecture.

---

## Sumário

- [Introdução](#introdução)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
  - [Visão Geral das Camadas](#visão-geral-das-camadas)
  - [Fluxo de Dependência](#fluxo-de-dependência)
- [Design de Código](#design-de-código)
  - [Entidades de Domínio](#entidades-de-domínio)
  - [Casos de Uso](#casos-de-uso)
  - [Protocolos de Repositório](#protocolos-de-repositório)
  - [Tratamento de Erros](#tratamento-de-erros)
  - [Testes Unitários](#testes-unitários)
- [Rotas da API](#rotas-da-api)
  - [Usuários](#usuários)
  - [Projetos](#projetos)
  - [Links](#links)
  - [Parâmetros](#parâmetros)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
  - [Diagrama de Entidades](#diagrama-de-entidades)
  - [Modelos Prisma](#modelos-prisma)
- [Justificativas Técnicas](#justificativas-técnicas)
  - [Modelagem das Entidades](#modelagem-das-entidades)
  - [Principais Decisões Técnicas](#principais-decisões-técnicas)
  - [Escala na Edição de Links](#escala-na-edição-de-links)
- [Diferenciais Implementados](#diferenciais-implementados)
  - [Paginação e Filtros](#paginação-e-filtros)
  - [Middleware de Log](#middleware-de-log)
  - [Seed do Banco de Dados](#seed-do-banco-de-dados)
- [Manual de Execução](#manual-de-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração de Ambiente](#configuração-de-ambiente)
  - [Banco de Dados](#banco-de-dados)
  - [Executando a Aplicação](#executando-a-aplicação)
  - [Executando os Testes](#executando-os-testes)
- [Considerações Finais](#considerações-finais)

---

## Introdução

O **Campaign Link Management** é uma API para times de marketing que precisam organizar e rastrear links de campanhas digitais. A plataforma permite que cada usuário crie **projetos** para agrupar campanhas e, dentro de cada projeto, gerencie **links** com parâmetros UTM customizados — construindo automaticamente a URL final com todos os parâmetros concatenados.

**Principais funcionalidades:**

- Cadastro e autenticação de usuários com JWT
- Criação de projetos para organizar campanhas
- Gerenciamento completo de links (criar, atualizar, excluir)
- Adição e remoção de parâmetros UTM em links
- Geração da URL final com todos os parâmetros aplicados
- Listagens com paginação e filtros por nome

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 22.x | Runtime |
| TypeScript | 5.x | Linguagem (modo `strict`) |
| Express | 5.x | Framework HTTP |
| Prisma | 5.x | ORM e gerenciamento de migrations |
| PostgreSQL | 15.x | Banco de dados relacional |
| Zod | 4.x | Validação de schemas e variáveis de ambiente |
| jsonwebtoken | 9.x | Autenticação via JWT |
| bcryptjs | 3.x | Hash de senhas |
| Vitest | 4.x | Framework de testes unitários |
| tsx | 4.x | Execução de TypeScript em desenvolvimento |

---

## Arquitetura do Projeto

O projeto é estruturado seguindo os princípios da **Clean Architecture**, garantindo que as regras de negócio sejam completamente independentes de frameworks, bancos de dados e bibliotecas externas.

### Visão Geral das Camadas

```
src/
├── domain/          # Regras de negócio puras — zero dependências externas
│   ├── entities/    # Tipos TypeScript que representam as entidades
│   └── use-cases/   # Interfaces dos casos de uso (contratos)
│
├── application/     # Implementação dos casos de uso e contratos de repositório
│   ├── use-cases/   # Classes que implementam as interfaces do domínio
│   ├── repositories/# Protocolos (interfaces) de repositório e serviços
│   └── errors/      # Erros de domínio tipados
│
├── infra/           # Implementações concretas dos protocolos
│   ├── database/
│   │   ├── prisma/    # Repositórios que utilizam o Prisma Client
│   │   └── in-memory/ # Repositórios em memória, usados nos testes
│   ├── crypto/      # Implementações de hash (bcrypt e in-memory)
│   └── env/         # Validação e exposição de variáveis de ambiente
│
├── presentation/    # Controllers HTTP (Express)
│   └── controllers/
│
└── main/            # Ponto de entrada — composição de todas as camadas
    ├── server.ts
    ├── routes/
    ├── factories/   # Funções que instanciam e conectam as dependências
    └── middlewares/
```

### Fluxo de Dependência

As dependências sempre apontam para o núcleo da aplicação. Nenhuma camada interna conhece a existência de camadas externas.

```
main → presentation → application → domain
main → infra        → application → domain
```

- `domain` não importa nenhuma outra camada
- `application` conhece apenas `domain`
- `infra` e `presentation` implementam contratos definidos em `application` e `domain`
- `main` é a única camada que conhece todas as outras e realiza a composição

---

## Design de Código

### Entidades de Domínio

As entidades são definidas como **tipos TypeScript** (`type`), não como classes. Isso as mantém como estruturas de dados simples — sem lógica e sem dependências externas. Toda regra de negócio reside nos casos de uso, que recebem e retornam essas estruturas.

As entidades do projeto são: `User`, `Project`, `Link` e `Parameter`.

### Casos de Uso

Cada caso de uso é definido por uma **interface** na camada `domain` e **implementado** na camada `application`. Os tipos de Input e Output são declarados como namespaces internos à interface, garantindo que o contrato e seus tipos permaneçam coesos.

Os casos de uso recebem suas dependências via **constructor injection**, tipadas pelas interfaces de protocolo — nunca pelas implementações concretas.

### Protocolos de Repositório

Os contratos dos repositórios ficam em `application/repositories/` e definem os métodos disponíveis para cada entidade, com seus respectivos tipos de Input e Output. As implementações concretas (`PrismaProjectsRepository`, `PrismaLinksRepository`, etc.) ficam em `infra/` e implementam esses protocolos sem que a camada `application` precise saber de sua existência.

A injeção de dependências é feita **manualmente** via **factories** — funções simples que instanciam repositórios, casos de uso e controllers na ordem correta, sem nenhum container IoC.

### Tratamento de Erros

Os erros de domínio são classes que estendem `Error` e implementam a interface marcadora `UseCaseError`. Os controllers os identificam com `instanceof` e retornam o status HTTP adequado.

| Erro | Status HTTP | Descrição |
|---|---|---|
| `EmailAlreadyExistError` | 400 | E-mail já cadastrado |
| `InvalidCredentialsError` | 401 | Credenciais inválidas |
| `ProjectNotFoundError` | 404 | Projeto não encontrado |
| `LinkNotFoundError` | 404 | Link não encontrado |
| `ParameterNotFoundError` | 404 | Parâmetro não encontrado |

### Testes Unitários

Os testes cobrem exclusivamente a camada `application/use-cases/`. Cada spec é **co-localizado** com o arquivo testado e utiliza **repositórios in-memory** como substitutos do banco de dados — sem nenhum mock de módulo. Repositórios in-memory implementam os mesmos protocolos dos repositórios Prisma, o que garante que qualquer quebra de contrato seja detectada pelo compilador.

A validação de inputs ocorre **exclusivamente na camada `presentation`**, via **Zod**. As camadas `domain` e `application` recebem dados já validados e não possuem dependência de biblioteca de validação.

Cada caso de uso possui ao menos três categorias de teste:

1. **Happy path** — execução bem-sucedida e verificação do retorno
2. **Chamadas com valores corretos** — `vitest.spyOn` para garantir que os colaboradores foram chamados com os parâmetros esperados
3. **Erros de domínio** — verificação de que a exceção correta é lançada nos casos de falha

---

## Rotas da API

Todas as rotas que exigem autenticação devem incluir o header:

```
Authorization: Bearer <token>
```

### Usuários

#### Criar usuário

```
POST /users
```

**Body:**

```json
{
  "name": "Guilherme",
  "email": "guilherme@example.com",
  "password": "senha123"
}
```

**Resposta 201:**

```json
{
  "token": "<jwt>"
}
```

**Erros:** `400` — e-mail já cadastrado

---

#### Autenticar usuário

```
POST /sessions
```

**Body:**

```json
{
  "email": "guilherme@example.com",
  "password": "senha123"
}
```

**Resposta 200:**

```json
{
  "token": "<jwt>"
}
```

**Erros:** `401` — credenciais inválidas

---

### Projetos

> Todas as rotas de projetos requerem autenticação JWT.

#### Criar projeto

```
POST /projects
```

**Body:**

```json
{
  "name": "Campanha Black Friday"
}
```

**Resposta 201:**

```json
{
  "project": {
    "projectId": "uuid",
    "name": "Campanha Black Friday",
    "userId": "uuid",
    "createdAt": "2026-05-07T00:00:00.000Z"
  }
}
```

---

#### Listar projetos do usuário

```
GET /projects
```

**Query params:**

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| `page` | number | Não | `1` | Página atual |
| `pageSize` | number | Não | `10` | Itens por página (máx. 100) |
| `name` | string | Não | — | Filtra por nome (contém, case-insensitive) |

**Resposta 200:**

```json
{
  "data": [
    {
      "projectId": "uuid",
      "name": "Campanha Black Friday",
      "userId": "uuid",
      "createdAt": "2026-05-07T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### Links

> Todas as rotas de links requerem autenticação JWT.

#### Criar link

```
POST /projects/:projectId/links
```

**Body:**

```json
{
  "name": "Link Facebook",
  "baseUrl": "https://tracker.example.com",
  "redirectUrl": "https://loja.com/black-friday"
}
```

**Resposta 201:**

```json
{
  "link": {
    "linkId": "uuid",
    "name": "Link Facebook",
    "baseUrl": "https://tracker.example.com",
    "redirectUrl": "https://loja.com/black-friday",
    "parameters": [],
    "projectId": "uuid",
    "createdAt": "2026-05-07T00:00:00.000Z",
    "updatedAt": "2026-05-07T00:00:00.000Z"
  }
}
```

**Erros:** `404` — projeto não encontrado

---

#### Listar links de um projeto

```
GET /projects/:projectId/links
```

**Query params:**

| Parâmetro | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| `page` | number | Não | `1` | Página atual |
| `pageSize` | number | Não | `10` | Itens por página (máx. 100) |
| `name` | string | Não | — | Filtra por nome (contém, case-insensitive) |

**Resposta 200:**

```json
{
  "data": [...],
  "meta": {
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

#### Atualizar link

```
PATCH /links/:id
```

**Body** (todos os campos são opcionais):

```json
{
  "name": "Novo nome",
  "baseUrl": "https://novo-tracker.example.com",
  "redirectUrl": "https://loja.com/nova-pagina"
}
```

**Resposta 200:**

```json
{
  "link": { ... }
}
```

**Erros:** `404` — link não encontrado

---

#### Excluir link

```
DELETE /links/:id
```

**Resposta 204** — sem corpo

**Erros:** `404` — link não encontrado

---

#### Gerar URL final

```
GET /links/:id/generate
```

Constrói a URL final do link com todos os parâmetros UTM concatenados como query string.

**Resposta 200:**

```json
{
  "url": "https://tracker.example.com?utm_source=google&utm_medium=cpc"
}
```

**Erros:** `404` — link não encontrado

---

### Parâmetros

> Todas as rotas de parâmetros requerem autenticação JWT.

#### Adicionar parâmetro a um link

```
POST /links/:id/parameters
```

**Body:**

```json
{
  "key": "utm_source",
  "value": "google"
}
```

**Resposta 201:**

```json
{
  "parameter": {
    "parameterId": "uuid",
    "key": "utm_source",
    "value": "google"
  }
}
```

**Erros:** `404` — link não encontrado

---

#### Remover parâmetro de um link

```
DELETE /links/:id/parameters/:parameterId
```

**Resposta 204** — sem corpo

**Erros:** `404` — link ou parâmetro não encontrado

---

## Estrutura do Banco de Dados

### Diagrama de Entidades

```
┌──────────────────┐       ┌──────────────────────┐       ┌──────────────────────────────┐
│       User       │       │       Project         │       │            Link              │
├──────────────────┤       ├──────────────────────┤       ├──────────────────────────────┤
│ user_id (PK)     │──────<│ project_id (PK)       │──────<│ link_id (PK)                 │
│ name             │       │ name                  │       │ name                         │
│ email (unique)   │       │ user_id (FK → User)   │       │ base_url                     │
│ password         │       │ created_at            │       │ redirect_url (opcional)      │
│ created_at       │       │ updated_at            │       │ parameters (JSON)            │
└──────────────────┘       └──────────────────────┘       │ project_id (FK → Project)    │
                                                           │ created_at                   │
                                                           │ updated_at                   │
                                                           └──────────────────────────────┘
```

### Modelos Prisma

```prisma
model User {
  user_id    String    @id @default(uuid())
  name       String
  email      String    @unique
  password   String
  projects   Project[]
  created_at DateTime  @default(now())
}

model Project {
  project_id String   @id @default(uuid())
  name       String
  user_id    String
  user       User     @relation(fields: [user_id], references: [user_id])
  links      Link[]
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
}

model Link {
  link_id      String   @id @default(uuid())
  name         String
  base_url     String
  redirect_url String?
  parameters   Json     @default("[]")
  project_id   String
  project      Project  @relation(fields: [project_id], references: [project_id])
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
}
```

> Os parâmetros UTM são armazenados como um array JSON diretamente na tabela `Link`, evitando uma tabela auxiliar e a necessidade de JOINs em cada consulta. Esta decisão é detalhada nas justificativas técnicas.

---

## Justificativas Técnicas

### Modelagem das Entidades

As entidades foram modeladas como **tipos TypeScript puros** (`type`), sem uso de classes. Esta escolha reflete o princípio de que entidades de domínio devem ser estruturas de dados simples — portadoras de informação, sem comportamento. Toda lógica de negócio reside nos casos de uso.

A entidade `Parameter` não possui tabela própria no banco de dados. Em vez disso, é armazenada como um **array JSON** dentro da coluna `parameters` da tabela `Link`. Esta modelagem foi deliberada:

- Parâmetros são sempre acessados no contexto de um link — nunca de forma independente
- Não há necessidade de consultas ou filtragens diretas sobre parâmetros
- Elimina o custo de um JOIN em cada leitura de link
- A escrita é atômica: adicionar ou remover um parâmetro é uma única operação de UPDATE

### Principais Decisões Técnicas

**Clean Architecture como base estrutural**

A separação estrita de camadas garante que as regras de negócio possam ser testadas e evoluídas independentemente da infraestrutura. Substituir o Prisma por outro ORM, ou o Express por outro framework, requer mudanças apenas nas camadas `infra` e `presentation` — sem tocar em `domain` ou `application`.

**Injeção de dependência manual via factories**

Containers IoC introduzem acoplamento implícito. Com factories simples e explícitas, o fluxo de criação de objetos é completamente visível e rastreável, sem nenhuma mágica de framework.

**Repositórios in-memory para testes**

Mocks de módulos criam acoplamento ao nome do módulo e frequentemente falham em representar contratos reais. Repositórios in-memory implementam a mesma interface dos repositórios de produção — se o contrato mudar, o compilador exige que o in-memory seja atualizado também. Isso elimina toda uma classe de bugs onde os testes passam mas a aplicação falha.

**Transação no Prisma para paginação**

A listagem paginada executa `findMany` e `count` dentro de uma única `$transaction`, garantindo consistência entre o total retornado e os dados da página — especialmente importante em sistemas com alta taxa de escrita.

### Escala na Edição de Links

O problema de escala na edição de parâmetros é resolvido pela escolha de **armazenar parâmetros como JSON embutido no link**.

Em um modelo relacional tradicional, cada parâmetro seria uma linha em uma tabela `parameters` com FK para `links`. Adicionar ou remover um parâmetro exigiria uma query de leitura, uma operação de INSERT ou DELETE e, potencialmente, uma transação explícita para garantir consistência.

Com o modelo JSON, a operação se resume a: buscar o link, aplicar a mutação no array em memória e executar um único UPDATE na tabela `Link`. A operação é sempre **O(1) no banco** — uma escrita, sem bloqueio de múltiplas linhas, sem risco de deadlock entre operações concorrentes no mesmo link. O volume de parâmetros por link é naturalmente limitado (UTM padrão tem 5-6 parâmetros), então o custo de reescrever o array completo é desprezível. Em cenários de alta concorrência, cada UPDATE é atômico sobre o JSON completo, eliminando condições de corrida entre operações paralelas.

---

## Diferenciais Implementados

### Paginação e Filtros

As rotas `GET /projects` e `GET /projects/:projectId/links` suportam paginação e filtro por nome via query params (`page`, `pageSize`, `name`). A resposta inclui um objeto `meta` com `total`, `page`, `pageSize` e `totalPages`. A implementação no Prisma utiliza `$transaction` para executar `findMany` e `count` de forma atômica.

### Middleware de Log

Todas as requisições são registradas no console com método, caminho, status HTTP e tempo de resposta:

```
GET /projects 200 12ms
POST /projects 201 34ms
DELETE /links/uuid 204 8ms
```

### Seed do Banco de Dados

O script `prisma/seed.ts` popula o banco com dados de exemplo para facilitar o desenvolvimento e demonstrações:

- 1 usuário (`guilherme@example.com` / `senha123`)
- 1 projeto ("Campanha Black Friday")
- 2 links com parâmetros UTM completos ("Link Facebook" e "Link Google Ads")

Para executar: `npm run seed`

---

## Manual de Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) 22.x ou superior
- [npm](https://www.npmjs.com/) 10.x ou superior
- [Docker](https://www.docker.com/) (para o banco de dados)
- [Git](https://git-scm.com/)

### Instalação

**1. Clone o repositório**

```bash
git clone https://github.com/ghmarques-dev/campaign-link-management
cd campaign-link-management
```

**2. Instale as dependências**

```bash
npm install
```

### Configuração de Ambiente

**3. Crie o arquivo `.env` a partir do exemplo**

```bash
cp .env.example .env
```

O arquivo `.env.example` contém:

```env
DATABASE_URL=postgresql://docker:docker@localhost:5432/campaign_link_management
JWT_SECRET=secret_key
PORT=3333
```

Ajuste os valores conforme o seu ambiente. Em produção, utilize um `JWT_SECRET` seguro e aleatório.

### Banco de Dados

**4. Suba o banco de dados com Docker**

```bash
docker compose up -d
```

**5. Execute as migrations**

```bash
npx prisma migrate deploy
```

**6. (Opcional) Popule o banco com dados de exemplo**

```bash
npm run seed
```

### Executando a Aplicação

**7. Inicie o servidor em modo desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3333` (ou na porta definida em `PORT`).

### Executando os Testes

**Modo watch (desenvolvimento):**

```bash
npm run test:watch
```

**Com relatório de cobertura:**

```bash
npm run test:cov
```

Os testes não dependem de banco de dados nem de variáveis de ambiente — utilizam repositórios in-memory instanciados diretamente nos specs.

---

## Considerações Finais

O projeto foi construído com foco em **clareza arquitetural**, **testabilidade** e **facilidade de evolução**. A escolha da Clean Architecture permite que qualquer camada seja substituída ou estendida de forma isolada, sem efeitos colaterais nas regras de negócio.

Alguns pontos que poderiam ser evoluídos em versões futuras:

- **Autorização por recurso**: validar que o usuário autenticado é dono do projeto antes de operar em links, prevenindo acessos cruzados
- **Rate limiting**: proteção das rotas públicas de autenticação contra ataques de força bruta
- **Soft delete**: manter histórico de links excluídos em vez de remoção permanente
- **Refresh tokens**: renovação de sessões sem necessidade de re-autenticação
