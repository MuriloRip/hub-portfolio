"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO, subDays } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getMetricRows } from "@/lib/metrics";
import { ThemeToggle } from "@/components/ThemeToggle";

const allRows = getMetricRows();

type Theme = "light" | "dark";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);
}

export default function DashboardPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [startDate, setStartDate] = useState(subDays(new Date(), 29).toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const stored = window.localStorage.getItem("dashboard-theme");
    const initialTheme: Theme = stored === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  function handleToggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("dashboard-theme", nextTheme);
  }

  const filtered = useMemo(() => {
    return allRows.filter((row) => row.date >= startDate && row.date <= endDate);
  }, [startDate, endDate]);

  const summary = useMemo(() => {
    if (filtered.length === 0) {
      return {
        revenue: 0,
        orders: 0,
        clients: 0,
        avgTicket: 0,
        churnRate: 0
      };
    }

    const totals = filtered.reduce(
      (acc, row) => {
        acc.revenue += row.revenue;
        acc.orders += row.orders;
        acc.clients += row.newClients;
        acc.avgTicket += row.avgTicket;
        acc.churnRate += row.churnRate;
        return acc;
      },
      { revenue: 0, orders: 0, clients: 0, avgTicket: 0, churnRate: 0 }
    );

    return {
      revenue: totals.revenue,
      orders: totals.orders,
      clients: totals.clients,
      avgTicket: totals.avgTicket / filtered.length,
      churnRate: totals.churnRate / filtered.length
    };
  }, [filtered]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4">
      <header className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Painel de Gestao</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard Administrativo
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Inicio
            <input
              type="date"
              className="input ml-2"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Fim
            <input
              type="date"
              className="input ml-2"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Receita</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(summary.revenue)}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pedidos</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.orders}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Novos clientes</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{summary.clients}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ticket medio</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{formatMoney(summary.avgTicket)}</p>
        </article>
        <article className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Churn medio</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {summary.churnRate.toFixed(2)}%
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Receita por dia</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filtered}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => format(parseISO(value), "dd/MM")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | string | undefined) => formatMoney(Number(value ?? 0))}
                  labelFormatter={(value) => format(parseISO(String(value)), "dd/MM/yyyy")}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pedidos e novos clientes</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => format(parseISO(value), "dd/MM")}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => format(parseISO(String(value)), "dd/MM/yyyy")}
                />
                <Legend />
                <Bar dataKey="orders" name="Pedidos" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="newClients" name="Novos clientes" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="card overflow-x-auto">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Detalhamento por dia</h2>
        <table className="mt-4 min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-2">Data</th>
              <th className="py-2">Receita</th>
              <th className="py-2">Pedidos</th>
              <th className="py-2">Novos clientes</th>
              <th className="py-2">Ticket medio</th>
              <th className="py-2">Churn</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.date}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="py-2">{format(parseISO(row.date), "dd/MM/yyyy")}</td>
                <td className="py-2">{formatMoney(row.revenue)}</td>
                <td className="py-2">{row.orders}</td>
                <td className="py-2">{row.newClients}</td>
                <td className="py-2">{formatMoney(row.avgTicket)}</td>
                <td className="py-2">{row.churnRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
