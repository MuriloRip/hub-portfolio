"use client";

import { useEffect, useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  notes: string | null;
};

type ClientPayload = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const initialPayload: ClientPayload = {
  name: "",
  email: "",
  phone: "",
  notes: ""
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ClientPayload>(initialPayload);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadClients() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/clients");
      const data = (await response.json()) as { clients?: Client[]; error?: string };
      if (!response.ok) {
        setError(data.error ?? "Erro ao carregar clientes");
        return;
      }
      setClients(data.clients ?? []);
    } catch {
      setError("Falha de conexao");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadClients();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const endpoint = editingId ? `/api/clients/${editingId}` : "/api/clients";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Falha ao salvar cliente");
        return;
      }

      setForm(initialPayload);
      setEditingId(null);
      await loadClients();
    } catch {
      setError("Falha de conexao");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(client: Client) {
    setEditingId(client.id);
    setForm({
      name: client.name,
      email: client.email ?? "",
      phone: client.phone,
      notes: client.notes ?? ""
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja remover este cliente?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadClients();
    }
  }

  const title = useMemo(
    () => (editingId ? "Editar cliente" : "Novo cliente"),
    [editingId]
  );

  return (
    <div className="space-y-4">
      <header className="card">
        <h1 className="text-2xl font-bold text-slateCustom">CRUD de clientes</h1>
        <p className="mt-1 text-sm text-slate-600">Cadastre, edite e gerencie sua base de clientes.</p>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold text-slateCustom">{title}</h2>
        <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Nome do cliente"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="input"
            placeholder="Telefone"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
          <input
            className="input sm:col-span-2"
            type="email"
            placeholder="Email (opcional)"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <textarea
            className="input min-h-24 sm:col-span-2"
            placeholder="Observacoes"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />

          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Salvando..." : editingId ? "Atualizar" : "Cadastrar"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialPayload);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-slateCustom">Lista de clientes</h2>

        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Carregando...</p>
        ) : clients.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nenhum cliente cadastrado.</p>
        ) : (
          <table className="mt-3 min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2">Nome</th>
                <th className="py-2">Telefone</th>
                <th className="py-2">Email</th>
                <th className="py-2">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slateCustom">{client.name}</td>
                  <td className="py-2">{client.phone}</td>
                  <td className="py-2">{client.email ?? "-"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button className="btn-outline" onClick={() => handleEdit(client)}>
                        Editar
                      </button>
                      <button className="btn-outline text-red-600" onClick={() => void handleDelete(client.id)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
