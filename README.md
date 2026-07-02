# Receitas

Plataforma full-stack de receitas com Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, autenticação por cookie assinado, senhas criptografadas e roles.

## Links

- GitHub Pages: https://wessyu.github.io/Receitas/
- Repositorio: https://github.com/WessYu/Receitas

> O GitHub Pages hospeda uma versão pública navegável em `docs/`, com receitas, filtros, detalhes, cadastro, login, conta e favoritos no navegador. O painel admin não fica exposto no Pages; ele existe apenas na aplicação full-stack protegida por login e role `ADMIN`.

## Funcionalidades

- Cadastro, login, logout e perfil do usuário com foto.
- Listagem de receitas com busca e filtros por categoria, dificuldade, tempo e ingrediente.
- Página individual com ingredientes, preparo, comentários e botão de salvar/remover favorito.
- Dashboard privado com receitas salvas, receitas enviadas e edição de perfil.
- Área para usuários enviarem receitas com foto, ingredientes e modo de preparo.
- Admin protegido para criar, editar, aprovar, excluir receitas, gerenciar categorias, listar usuários e acompanhar comentários.
- Upload de foto no painel admin e no envio de receitas, sem precisar alterar código.
- Aviso por email para contas que aceitaram notificações quando uma nova receita for publicada.
- Validação com Zod, hash de senha com bcrypt e bloqueio no middleware e no servidor.

## Como instalar

```bash
npm install
```

## Como configurar o banco

Crie um banco PostgreSQL e copie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Depois ajuste o `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/receitas?schema=public"
SESSION_SECRET="troque-por-um-segredo-com-pelo-menos-32-caracteres"
```

Se tiver Docker instalado, você pode subir o PostgreSQL do projeto:

```bash
docker compose up -d
```

## Como rodar as migrations

```bash
npm run prisma:migrate
```

## Como criar o admin inicial

Antes de rodar o seed, defina no `.env` o seu email e uma senha forte:

```env
ADMIN_EMAIL="seu-email@exemplo.com"
ADMIN_PASSWORD="troque-por-uma-senha-forte-com-8-caracteres"
```

Depois rode:

```bash
npm run db:seed
```

O seed cria apenas o usuário administrador definido por você no `.env`.

## Como configurar emails

Para avisar usuários quando uma receita nova for publicada, preencha as variáveis SMTP no `.env`:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SMTP_HOST="smtp.seu-provedor.com"
SMTP_PORT="587"
SMTP_USER="usuario-smtp"
SMTP_PASSWORD="senha-smtp"
SMTP_FROM="Receitas <no-reply@seudominio.com>"
```

Sem SMTP configurado, a receita é publicada normalmente e o envio de email é ignorado.

## Como iniciar localmente

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o servidor local.
- `npm run build`: gera a build de produção.
- `npm run start`: executa a build.
- `npm run prisma:migrate`: cria/aplica migrations.
- `npm run prisma:generate`: gera o Prisma Client.
- `npm run prisma:studio`: abre o Prisma Studio.
- `npm run db:seed`: popula categorias, receitas e o admin configurado no `.env`.

## Estrutura

- `app/`: rotas App Router.
- `components/`: componentes reutilizáveis de UI, auth, receitas e admin.
- `lib/`: Prisma, auth, validações, queries e server actions.
- `prisma/`: schema e seed.

## Observações de produção

- Troque `SESSION_SECRET` por um valor longo e privado.
- Use PostgreSQL gerenciado em produção.
- Configure HTTPS para manter cookies seguros.
- Não versionar `.env`.
- Em hospedagens serverless, confirme suporte a escrita local antes de usar uploads em `public/uploads`; em produção, prefira storage externo como S3, Cloudinary ou Supabase Storage.
