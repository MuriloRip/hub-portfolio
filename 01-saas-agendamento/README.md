# Sistema de Agendamento Online (SaaS Web App)

Aplicacao SaaS para salao/barbearia com autenticacao, painel admin, CRUD de clientes e agenda mensal.

## Stack

- Next.js 15 + TypeScript
- Node.js (rotas API no App Router)
- PostgreSQL + Prisma ORM
- Tailwind CSS

## Funcionalidades

- Login e cadastro com cookie de sessao (JWT)
- Painel administrativo com indicadores
- CRUD de clientes (criar, editar, excluir)
- Agenda com calendario mensal e lista de agendamentos
- Layout responsivo para desktop e mobile

## Rodando localmente

1. Instale dependencias:

```bash
npm install
```

2. Configure ambiente:

```bash
cp .env.example .env
```

3. Execute migrations e seed:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

4. Inicie:

```bash
npm run dev
```

5. Credenciais seed:

- Email: `admin@demo.com`
- Senha: `123456`

## Deploy

- Frontend/API: Vercel
- Banco: Supabase PostgreSQL ou Neon
- Configure as variaveis `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET`
