"use client";

import { useState } from "react";

type FormPayload = {
  name: string;
  email: string;
  message: string;
};

const initialPayload: FormPayload = {
  name: "",
  email: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<FormPayload>(initialPayload);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setStatus("error");
        setFeedback(data.error ?? "Nao foi possivel enviar.");
        return;
      }

      setStatus("success");
      setFeedback(data.message ?? "Mensagem enviada com sucesso.");
      setForm(initialPayload);
    } catch {
      setStatus("error");
      setFeedback("Falha de conexao. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-xl shadow-ocean/10 backdrop-blur">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ocean"
          placeholder="Seu nome"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ocean"
          type="email"
          placeholder="Seu e-mail"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <textarea
          className="min-h-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ocean sm:col-span-2"
          placeholder="Fale sobre seu projeto"
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          required
        />
      </div>

      <button className="btn-main mt-4 w-full" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Quero receber uma proposta"}
      </button>

      {feedback && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>{feedback}</p>
      )}
    </form>
  );
}
