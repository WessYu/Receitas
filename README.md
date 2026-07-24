# Receitas

Aplicação full stack para descobrir, publicar, salvar e gerenciar receitas em uma única plataforma.

O projeto foi desenvolvido para ir além de um catálogo estático. Ele reúne autenticação, perfis, favoritos, comentários, envio de receitas, modo cozinha e um painel administrativo para moderação de conteúdo.

**Projeto publicado:** https://receitas-delta-eight.vercel.app  
**Repositório:** https://github.com/WessYu/Receitas

## Visão geral

O Receitas organiza dois fluxos principais:

- usuários podem criar conta, buscar receitas, salvar favoritos, comentar e enviar suas próprias receitas;
- administradores podem revisar conteúdo e gerenciar receitas, categorias, usuários e comentários.

A aplicação foi estruturada com Next.js, Prisma e PostgreSQL, mantendo regras de autenticação, validação e acesso ao banco separadas da camada de interface.

## Problema

Sites de receitas normalmente apresentam apenas conteúdo estático, sem permitir participação do usuário ou gestão centralizada.

A proposta deste projeto foi criar uma aplicação real, com diferentes níveis de acesso, conteúdo persistido em banco de dados e ferramentas para publicação e moderação sem necessidade de editar o código.

## Funcionalidades

- cadastro, login e logout;
- sessão por cookie assinado;
- perfil de usuário editável;
- busca e filtros de receitas;
- página de detalhes com ingredientes e modo de preparo;
- modo cozinha com checklist, ajuste de porções e timer;
- favoritos e comentários;
- envio de receitas para revisão;
- painel administrativo;
- gerenciamento de receitas, categorias, usuários e comentários;
- upload de imagens com Cloudinary;
- validação de dados com Zod;
- sitemap, robots e metadados para compartilhamento.

## Decisões técnicas

### Autenticação e autorização

As sessões são mantidas por cookies assinados. As áreas restritas verificam a sessão do usuário e suas permissões antes de permitir acesso às ações administrativas.

### Modelagem de dados

O Prisma centraliza o schema e os relacionamentos entre usuários, receitas, categorias, favoritos e comentários. O PostgreSQL é usado como banco principal da aplicação.

### Validação

Os dados enviados por formulários e ações do servidor são validados com Zod antes de serem processados ou gravados.

### Upload de imagens

As imagens das receitas são enviadas para o Cloudinary, evitando armazenar arquivos diretamente no servidor da aplicação.

### Testes

O projeto possui estrutura para testes de ponta a ponta com Playwright.

## Tecnologias

### Aplicação

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

### Dados e autenticação

- Prisma 6
- PostgreSQL
- bcryptjs
- jose
- Zod

### Infraestrutura e qualidade

- Vercel
- Cloudinary
- Playwright
- ESLint

## Estrutura do projeto

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
- conta no Cloudinary para upload de imagens

### Instalação

```bash
npm install
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis de ambiente e prepare o banco:

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

## Próximos passos

- recuperação de senha por e-mail;
- melhorias na moderação de receitas;
- testes automatizados para os fluxos críticos;
- otimizações adicionais de acessibilidade e desempenho.

## Autor

Wesley Cruz

- GitHub: https://github.com/WessYu
- Portfólio: https://portifoliowess.netlify.app
- E-mail: wess.c@proton.me
