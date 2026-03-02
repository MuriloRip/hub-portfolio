import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary-700">
        SaaS Web App
      </span>
      <h1 className="text-4xl font-bold tracking-tight text-slateCustom sm:text-5xl">
        Sistema de Agendamento Online
      </h1>
      <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
        Plataforma profissional para saloes e barbearias com autenticacao, painel admin,
        cadastro de clientes e agenda de atendimentos.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/login" className="btn-primary">
          Entrar
        </Link>
        <Link href="/cadastro" className="btn-outline">
          Criar conta
        </Link>
      </div>
    </main>
  );
}
