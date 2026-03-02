# Sistema de Automacao de Relatorios em Python

Script de automacao que le planilha, gera PDF automaticamente e opcionalmente envia por email.

## Stack

- Python 3.10+
- pandas
- reportlab
- python-dotenv
- smtplib (biblioteca padrao)

## Fluxo

1. Le planilha (`.csv` ou `.xlsx`)
2. Calcula resumo financeiro
3. Gera PDF em `output/`
4. (Opcional) Envia o PDF por email com SMTP

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Execucao

Gerar PDF:

```bash
python main.py --input data/relatorio_clientes.csv --output output/relatorio_automatizado.pdf
```

Gerar PDF e enviar e-mail:

```bash
copy .env.example .env
# preencha as credenciais SMTP no .env
python main.py --send-email
```

## Formato esperado da planilha

Colunas obrigatorias:

- `cliente`
- `valor`
- `status` (`pago`, `pendente`, `cancelado`)
- `data`

## Caso de uso real

Esse projeto mostra automacao com impacto: reduz trabalho manual de consolidacao e envio de relatorios.
