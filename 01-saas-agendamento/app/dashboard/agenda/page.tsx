"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { MonthCalendar, type CalendarAppointment } from "@/components/MonthCalendar";

type Client = {
  id: string;
  name: string;
};

type AppointmentResponse = CalendarAppointment & {
  notes: string | null;
};

type FormState = {
  title: string;
  clientId: string;
  startAt: string;
  endAt: string;
  status: "confirmed" | "pending" | "canceled";
  notes: string;
};

const initialForm: FormState = {
  title: "",
  clientId: "",
  startAt: "",
  endAt: "",
  status: "confirmed",
  notes: ""
};

export default function AgendaPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [clientResponse, appointmentResponse] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/appointments")
      ]);

      const clientData = (await clientResponse.json()) as { clients?: Client[]; error?: string };
      const appointmentData = (await appointmentResponse.json()) as {
        appointments?: AppointmentResponse[];
        error?: string;
      };

      if (!clientResponse.ok || !appointmentResponse.ok) {
        setError(clientData.error ?? appointmentData.error ?? "Erro ao carregar agenda");
        return;
      }

      setClients(clientData.clients ?? []);
      setAppointments(appointmentData.appointments ?? []);
    } catch {
      setError("Falha de conexao");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString()
        })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Erro ao criar agendamento");
        return;
      }

      setForm(initialForm);
      await loadData();
    } catch {
      setError("Falha de conexao");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja excluir este agendamento?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/appointments/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      await loadData();
    }
  }

  return (
    <div className="space-y-4">
      <header className="card">
        <h1 className="text-2xl font-bold text-slateCustom">Calendario e agendamentos</h1>
        <p className="mt-1 text-sm text-slate-600">
          Organize horarios da equipe e acompanhe os atendimentos do mes.
        </p>
      </header>

      <section className="card">
        <h2 className="text-lg font-semibold text-slateCustom">Novo agendamento</h2>

        {clients.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Cadastre pelo menos um cliente para criar agendamentos.
          </p>
        ) : (
          <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={handleCreate}>
            <input
              className="input"
              placeholder="Servico (ex: Corte + Barba)"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />

            <select
              className="input"
              value={form.clientId}
              onChange={(event) => setForm((prev) => ({ ...prev, clientId: event.target.value }))}
              required
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="datetime-local"
              value={form.startAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startAt: event.target.value }))}
              required
            />

            <input
              className="input"
              type="datetime-local"
              value={form.endAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endAt: event.target.value }))}
              required
            />

            <select
              className="input"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as FormState["status"]
                }))
              }
            >
              <option value="confirmed">Confirmado</option>
              <option value="pending">Pendente</option>
              <option value="canceled">Cancelado</option>
            </select>

            <input
              className="input"
              placeholder="Observacoes (opcional)"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />

            {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

            <button type="submit" className="btn-primary sm:col-span-2" disabled={submitting}>
              {submitting ? "Salvando..." : "Criar agendamento"}
            </button>
          </form>
        )}
      </section>

      {loading ? (
        <section className="card">
          <p className="text-sm text-slate-600">Carregando agenda...</p>
        </section>
      ) : (
        <>
          <MonthCalendar appointments={appointments} />

          <section className="card overflow-x-auto">
            <h2 className="text-lg font-semibold text-slateCustom">Lista de agendamentos</h2>
            {appointments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">Nenhum agendamento cadastrado.</p>
            ) : (
              <table className="mt-3 min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2">Servico</th>
                    <th className="py-2">Cliente</th>
                    <th className="py-2">Data/Hora</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-slate-100">
                      <td className="py-2 font-medium text-slateCustom">{appointment.title}</td>
                      <td className="py-2">{appointment.client.name}</td>
                      <td className="py-2">
                        {format(parseISO(appointment.startAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </td>
                      <td className="py-2 capitalize">{appointment.status}</td>
                      <td className="py-2">
                        <button
                          className="btn-outline text-red-600"
                          onClick={() => void handleDelete(appointment.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  );
}
