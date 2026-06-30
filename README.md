# Receitas

Plataforma full-stack de receitas com Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, autenticacao por cookie assinado, senhas criptografadas e roles `USER` / `ADMIN`.

## Links

- GitHub Pages: https://wessyu.github.io/Receitas/
- Repositorio: https://github.com/WessYu/Receitas

> O GitHub Pages hospeda apenas a vitrine estatica em `docs/`. A aplicacao completa precisa de Node.js e PostgreSQL para autenticar usuarios, usar Prisma e executar o painel admin.

## Funcionalidades

- Cadastro, login, logout e perfil do usuario.
- Listagem de receitas com busca e filtros por categoria, dificuldade, tempo e ingrediente.
- Pagina individual com ingredientes, preparo e botao de salvar/remover favorito.
- Dashboard privado com receitas salvas e edicao basica de perfil.
- Admin protegido para criar, editar, excluir receitas, gerenciar categorias e listar usuarios.
- Validacao com Zod, hash de senha com bcrypt e bloqueio no middleware e no servidor.

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

Se tiver Docker instalado, voce pode subir o PostgreSQL do projeto:

```bash
docker compose up -d
```

## Como rodar as migrations

```bash
npm run prisma:migrate
```

## Como criar o admin inicial

Rode o seed:

```bash
npm run db:seed
```

Credenciais criadas:

- Admin: `admin@receitas.local`
- Senha: `Admin@123456`

Tambem existe um usuario comum:

- Usuario: `demo@receitas.local`
- Senha: `Demo@123456`

## Como iniciar localmente

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o servidor local.
- `npm run build`: gera a build de producao.
- `npm run start`: executa a build.
- `npm run prisma:migrate`: cria/aplica migrations.
- `npm run prisma:generate`: gera o Prisma Client.
- `npm run prisma:studio`: abre o Prisma Studio.
- `npm run db:seed`: popula categorias, receitas, admin e usuario demo.

## Estrutura

- `app/`: rotas App Router.
- `components/`: componentes reutilizaveis de UI, auth, receitas e admin.
- `lib/`: Prisma, auth, validacoes, queries e server actions.
- `prisma/`: schema e seed.

## Observacoes de producao

- Troque `SESSION_SECRET` por um valor longo e privado.
- Use PostgreSQL gerenciado em producao.
- Configure HTTPS para manter cookies seguros.
- Nao versionar `.env`.
