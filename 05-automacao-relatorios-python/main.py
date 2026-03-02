import argparse
import logging
import smtplib
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import Dict

import pandas as pd
from dotenv import load_dotenv
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

import os

REQUIRED_COLUMNS = {"cliente", "valor", "status", "data"}


def setup_logger() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


def read_spreadsheet(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Arquivo nao encontrado: {path}")

    suffix = path.suffix.lower()
    if suffix in {".xlsx", ".xls"}:
        df = pd.read_excel(path)
    elif suffix == ".csv":
        df = pd.read_csv(path)
    else:
        raise ValueError("Formato nao suportado. Use CSV ou Excel (.xlsx/.xls)")

    df.columns = [str(column).strip().lower() for column in df.columns]

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"Colunas obrigatorias ausentes: {', '.join(sorted(missing))}")

    df["valor"] = pd.to_numeric(df["valor"], errors="coerce").fillna(0)
    df["status"] = df["status"].astype(str).str.lower().str.strip()
    df["data"] = pd.to_datetime(df["data"], errors="coerce")

    return df


def build_summary(df: pd.DataFrame) -> Dict[str, float]:
    total_registros = len(df)
    total_faturamento = float(df[df["status"] == "pago"]["valor"].sum())
    total_pendente = float(df[df["status"] == "pendente"]["valor"].sum())
    ticket_medio = float(df[df["status"] == "pago"]["valor"].mean() or 0)

    return {
        "total_registros": total_registros,
        "total_faturamento": total_faturamento,
        "total_pendente": total_pendente,
        "ticket_medio": ticket_medio,
    }


def generate_pdf_report(df: pd.DataFrame, summary: Dict[str, float], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    normal_style = styles["BodyText"]

    doc = SimpleDocTemplate(str(output_path), pagesize=A4)
    elements = []

    elements.append(Paragraph("Relatorio Automatizado de Clientes", title_style))
    elements.append(Paragraph(f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M')}", normal_style))
    elements.append(Spacer(1, 16))

    resumo_text = (
        f"Total de registros: <b>{summary['total_registros']}</b><br/>"
        f"Faturamento (status pago): <b>R$ {summary['total_faturamento']:.2f}</b><br/>"
        f"Valor pendente: <b>R$ {summary['total_pendente']:.2f}</b><br/>"
        f"Ticket medio: <b>R$ {summary['ticket_medio']:.2f}</b>"
    )

    elements.append(Paragraph(resumo_text, normal_style))
    elements.append(Spacer(1, 18))

    table_data = [["Cliente", "Valor", "Status", "Data"]]
    preview = df.sort_values("data", ascending=False).head(20)

    for _, row in preview.iterrows():
        table_data.append(
            [
                str(row["cliente"]),
                f"R$ {float(row['valor']):.2f}",
                str(row["status"]).title(),
                row["data"].strftime("%d/%m/%Y") if not pd.isna(row["data"]) else "-",
            ]
        )

    table = Table(table_data, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("ALIGN", (1, 1), (1, -1), "RIGHT"),
            ]
        )
    )

    elements.append(table)
    doc.build(elements)


def send_email_with_attachment(report_path: Path, subject: str, body: str) -> None:
    load_dotenv()

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    email_from = os.getenv("EMAIL_FROM")
    email_to = os.getenv("EMAIL_TO")

    required = [smtp_host, smtp_user, smtp_pass, email_from, email_to]
    if not all(required):
        raise ValueError("Variaveis SMTP ausentes. Configure o arquivo .env")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = email_from
    message["To"] = email_to
    message.set_content(body)

    with report_path.open("rb") as file:
        message.add_attachment(
            file.read(),
            maintype="application",
            subtype="pdf",
            filename=report_path.name,
        )

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(message)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Automacao de relatorios em Python")
    parser.add_argument(
        "--input",
        type=str,
        default="data/relatorio_clientes.csv",
        help="Caminho do arquivo CSV ou Excel",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="output/relatorio_automatizado.pdf",
        help="Caminho do PDF de saida",
    )
    parser.add_argument(
        "--send-email",
        action="store_true",
        help="Envia o PDF por email apos gerar",
    )
    return parser.parse_args()


def main() -> None:
    setup_logger()
    args = parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    logging.info("Lendo planilha: %s", input_path)
    df = read_spreadsheet(input_path)

    summary = build_summary(df)
    logging.info("Registros: %s | Faturamento: R$ %.2f", summary["total_registros"], summary["total_faturamento"])

    logging.info("Gerando PDF: %s", output_path)
    generate_pdf_report(df, summary, output_path)
    logging.info("PDF gerado com sucesso")

    if args.send_email:
        logging.info("Enviando email com anexo")
        send_email_with_attachment(
            output_path,
            subject="Relatorio Automatizado de Clientes",
            body="Segue o relatorio gerado automaticamente.",
        )
        logging.info("Email enviado com sucesso")


if __name__ == "__main__":
    main()
