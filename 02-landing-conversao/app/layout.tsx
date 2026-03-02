import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landing Page Moderna com Foco em Conversao",
  description:
    "Landing page profissional para desenvolvedor freelancer com SEO, animacoes suaves e formulario funcional.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Landing Page Moderna com Foco em Conversao",
    description: "Landing page profissional para captacao de clientes.",
    type: "website"
  },
  alternates: {
    canonical: "/"
  }
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
