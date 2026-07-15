# Receitas — Aplicação Full Stack

Sistema web de receitas desenvolvido com **Next.js, TypeScript, TailwindCSS, Prisma e PostgreSQL**, com autenticação, área privada, favoritos, comentários, dashboard do usuário e painel administrativo.

O projeto foi criado como aplicação principal de portfólio para demonstrar uma experiência próxima de produto real: interface responsiva, rotas protegidas, banco de dados, regras de usuário e deploy em produção.

![Next.js](https://img.shields.io/badge/Next.js-111827?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-111827?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-111827?style=for-the-badge&logo=typescript&logoColor=3178C6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-111827?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Prisma](https://img.shields.io/badge/Prisma-111827?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-111827?style=for-the-badge&logo=postgresql&logoColor=4169E1)

---

## Deploy

- **Aplicação em produção:** https://receitas-delta-eight.vercel.app
- **Repositório:** https://github.com/WessYu/Receitas

---

## Visão geral

O **Receitas** é uma plataforma full stack para descobrir, salvar, comentar e gerenciar receitas.

A aplicação possui uma área pública com listagem, filtros e detalhes de receitas, além de uma área autenticada onde o usuário pode editar perfil, salvar receitas favoritas, enviar receitas e acompanhar suas publicações.

Também existe um fluxo administrativo protegido por role `ADMIN`, usado para gerenciar receitas, categorias, comentários e usuários.

---

## Demonstração

<p align="center">
  <a href="https://receitas-delta-eight.vercel.app">
    <strong>🍳 Acessar aplicação em produção</strong>
  </a>
</p>

### Página da receita

![Página de detalhes da receita](docs/screenshots/recipe.png)

### Biblioteca de receitas

![Biblioteca de receitas com busca e filtros](docs/screenshots/library.png)

### Painel administrativo

![Dashboard administrativo do Savor](docs/screenshots/admin.png)

### Vídeo demonstrativo

https://github.com/user-attachments/assets/COLE-AQUI-O-LINK-DO-VIDEO
---

## Funcionalidades

- Cadastro, login e logout de usuários
- Autenticação com cookie assinado
- Senhas criptografadas
- Área privada do usuário
- Perfil editável com foto e preferências
- Listagem de receitas com busca e filtros
- Página individual de receita com ingredientes e preparo
- Modo cozinha com checklist, ajuste de porções, progresso, timer e tela ligada opcional
- Comentários em receitas
- Favoritos privados por usuário
- Dashboard com receitas enviadas e salvas
- Envio de receitas para revisão
- Painel administrativo protegido
- CRUD de receitas e categorias
- Gerenciamento de usuários e comentários
- Validação de dados com Zod
- Banco de dados PostgreSQL com Prisma
- SEO com Open Graph, Twitter Card, sitemap e robots
- Deploy em produção na Vercel

---

## Stack utilizada

### Front-end

- Next.js App Router
- React
- TypeScript
- TailwindCSS
- Lucide React
- Componentização de interface
- Layout responsivo

### Back-end / Dados

- Server Actions
- Prisma ORM
- PostgreSQL
- Cookies para sessão
- Bcrypt para hash de senha
- Zod para validação
- Nodemailer para notificações opcionais

### Deploy

- Vercel
- Vercel Postgres / Neon
- Variáveis de ambiente para produção

---

## Explicação técnica

A aplicação usa **Next.js App Router** para organizar rotas públicas, privadas e administrativas.

A autenticação é baseada em sessão via cookie assinado. As senhas são armazenadas com hash usando `bcryptjs`, e as permissões são controladas por roles, permitindo separar usuários comuns de administradores.

O banco de dados é modelado com **Prisma**, utilizando relações entre usuários, receitas, categorias, ingredientes, etapas de preparo, favoritos e comentários.

O painel administrativo permite gerenciar o conteúdo publicado, enquanto o usuário comum possui uma área privada para acompanhar suas receitas e salvar favoritos.

---

## Modelagem principal

O banco possui entidades para:

- `User`
- `Recipe`
- `Category`
- `Ingredient`
- `PreparationStep`
- `Favorite`
- `Comment`

Essas relações permitem criar uma experiência completa com autoria, favoritos, comentários, filtros e gestão administrativa.

---

## Como rodar localmente

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Exemplo de variáveis:

```env
POSTGRES_PRISMA_URL="postgresql://usuario:senha@localhost:5432/receitas?schema=public"
SESSION_SECRET="troque-por-um-segredo-com-pelo-menos-32-caracteres"
ADMIN_EMAIL="seu-email@exemplo.com"
ADMIN_PASSWORD="troque-por-uma-senha-forte"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Configure o banco

```bash
npm run db:push
npm run db:seed
```

### 4. Inicie o projeto

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

---

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run vercel-build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run db:push
npm run db:seed
```

---

## Estrutura do projeto

```txt
app/          Rotas da aplicação, páginas públicas, privadas e admin
components/   Componentes reutilizáveis de UI, auth, receitas e admin
lib/          Prisma, autenticação, validações, queries e server actions
prisma/       Schema do banco e seed inicial
public/       Assets públicos
docs/         Versão estática e imagens para documentação
```

---

## Próximas melhorias

- Integrar upload de imagens com storage externo
- Criar testes automatizados para fluxos principais
- Adicionar paginação avançada na listagem de receitas
- Incluir métricas reais de uso no dashboard administrativo

---

## Autor

Desenvolvido por **Wesley Cruz**.

- GitHub: [@WessYu](https://github.com/WessYu)
- Email: wess.c@proton.me

---

> Projeto principal de portfólio, criado para demonstrar front-end moderno, autenticação, banco de dados, CRUD, painel administrativo e deploy em produção.
