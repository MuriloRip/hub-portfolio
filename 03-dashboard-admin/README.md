# Dashboard Administrativo com Graficos e Filtros Dinamicos

Projeto tecnico focado em visualizacao de dados para operacao de negocios.

## Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- Recharts

## Funcionalidades

- Cards de indicadores (receita, pedidos, clientes, ticket medio, churn)
- Graficos interativos (area e barras)
- Filtro por data (inicio/fim)
- Dark mode com persistencia em `localStorage`
- Tabela detalhada para analise diaria
- Layout profissional e responsivo

## Rodando localmente

```bash
npm install
npm run dev
```

## Deploy

- Deploy recomendado: Vercel
- Para versao com dados reais, conecte API/banco no lugar do dataset mock (`lib/metrics.ts`)
