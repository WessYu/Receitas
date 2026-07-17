# Receitas

Aplicação full stack para publicar, buscar, salvar e gerenciar receitas.

O projeto reúne uma área pública, autenticação, perfil de usuário, favoritos, comentários, envio de receitas e um painel administrativo para moderação de conteúdo.

## Demo

- Aplicação: https://receitas-delta-eight.vercel.app
- Repositório: https://github.com/WessYu/Receitas

## Funcionalidades

- cadastro, login e logout
- sessão por cookie assinado
- perfil editável
- busca e filtros de receitas
- página de detalhes com ingredientes e preparo
- modo cozinha com checklist, ajuste de porções e timer
- favoritos e comentários
- envio de receitas para revisão
- painel administrativo
- gerenciamento de receitas, categorias, usuários e comentários
- validação de dados com Zod
- SEO com sitemap, robots e metadados sociais

## Tecnologias

### Aplicação

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Dados e autenticação

- Prisma ORM
- PostgreSQL
- bcryptjs
- jose
- Zod

### Infraestrutura

- Vercel
- Neon ou outro banco PostgreSQL compatível
- Cloudinary para upload de imagens

## Estrutura

```text
app/          rotas, páginas e ações da aplicação
components/   componentes de interface
lib/          autenticação, banco, validações e consultas
prisma/       schema e seed do banco
public/       arquivos públicos
docs/         imagens usadas na documentação
```

## Execução local

### Requisitos

- Node.js 20 ou superior
- banco PostgreSQL

### Instalação

```bash
npm install
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis do `.env` e configure o banco:

```bash
npm run db:push
npm run db:seed
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Variáveis de ambiente

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/receitas?schema=public"
SESSION_SECRET="defina-um-segredo-com-pelo-menos-32-caracteres"
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="defina-uma-senha-forte"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_FOLDER="savor"
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test:e2e
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run db:push
npm run db:seed
```

## Autor

Wesley Cruz

- GitHub: https://github.com/WessYu
- Email: wess.c@proton.me
