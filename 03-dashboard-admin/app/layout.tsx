import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Administrativo com Graficos e Filtros Dinamicos",
  description: "Dashboard tecnico com indicadores, filtros por data, graficos e dark mode"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
