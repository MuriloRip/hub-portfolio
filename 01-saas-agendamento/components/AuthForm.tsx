"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMode = "login" | "register";

type Props = {
  mode: AuthMode;
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(isRegister ? { name, email, password } : { email, password })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Erro ao autenticar");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Falha de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-slate-100 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
        <h1 className="text-2xl font-bold text-slateCustom">
          {isRegister ? "Criar conta" : "Entrar no sistema"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isRegister
            ? "Cadastre seu salao/barbearia para gerenciar sua agenda online."
            : "Acesse seu painel administrativo de agendamentos."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                className="input"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Processando..." : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          {isRegister ? "Ja possui conta?" : "Ainda nao possui conta?"} {" "}
          <Link
            href={isRegister ? "/login" : "/cadastro"}
            className="font-semibold text-primary-700 hover:underline"
          >
            {isRegister ? "Fazer login" : "Criar conta"}
          </Link>
        </p>
      </section>
    </main>
  );
}
