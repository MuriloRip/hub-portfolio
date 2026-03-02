# Portfolio Avancado - Murilo Fonseca

Este repositorio contem 5 projetos para demonstrar capacidade profissional para plataformas de freelancer.

## Projetos

1. `01-saas-agendamento` - Sistema de Agendamento Online (SaaS Web App)
2. `02-landing-conversao` - Landing Page Moderna com Foco em Conversao
3. `03-dashboard-admin` - Dashboard Administrativo com Graficos e Filtros Dinamicos
4. `04-mobile-tarefas` - Aplicativo Mobile de Controle de Tarefas (React Native)
5. `05-automacao-relatorios-python` - Sistema de Automacao de Relatorios em Python

## Como executar cada projeto

### 1) SaaS de Agendamento

```bash
cd 01-saas-agendamento
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### 2) Landing de Conversao

```bash
cd 02-landing-conversao
npm install
npm run dev
```

### 3) Dashboard Administrativo

```bash
cd 03-dashboard-admin
npm install
npm run dev
```

### 4) App Mobile

```bash
cd 04-mobile-tarefas
npm install
npm run start
```

### 5) Automacao Python

```bash
cd 05-automacao-relatorios-python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python main.py --input data/relatorio_clientes.csv --output output/relatorio_automatizado.pdf
```

## Estrategia de apresentacao no portfolio

- Cada projeto tem README proprio com stack, features, setup e deploy.
- Todos os projetos foram pensados para ter visual profissional e valor comercial real.
- Priorize publicar os 3 projetos web primeiro (Vercel), depois mobile e automacao.
