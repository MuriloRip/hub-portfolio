import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [clientsCount, appointmentsCount, pendingToday, upcomingAppointments] = await Promise.all([
    prisma.client.count({ where: { ownerId: session.userId } }),
    prisma.appointment.count({ where: { ownerId: session.userId } }),
    prisma.appointment.count({
      where: {
        ownerId: session.userId,
        startAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 1)
        }
      }
    }),
    prisma.appointment.findMany({
      where: {
        ownerId: session.userId,
        startAt: {
          gte: new Date()
        }
      },
      include: {
        client: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: { startAt: "asc" },
      take: 5
    })
  ]);

  return (
    <div className="space-y-4">
      <header className="card">
        <h1 className="text-2xl font-bold text-slateCustom">Visao geral do negocio</h1>
        <p className="mt-1 text-sm text-slate-600">
          Gerencie clientes, horarios e acompanhe seus proximos atendimentos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">Clientes cadastrados</p>
          <p className="mt-2 text-3xl font-bold text-slateCustom">{clientsCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Agendamentos totais</p>
          <p className="mt-2 text-3xl font-bold text-slateCustom">{appointmentsCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Atendimentos hoje</p>
          <p className="mt-2 text-3xl font-bold text-slateCustom">{pendingToday}</p>
        </div>
      </div>

      <section className="card">
        <h2 className="text-lg font-semibold text-slateCustom">Proximos agendamentos</h2>
        <div className="mt-3 space-y-2">
          {upcomingAppointments.length === 0 ? (
            <p className="text-sm text-slate-600">Nenhum atendimento futuro encontrado.</p>
          ) : (
            upcomingAppointments.map((appointment) => (
              <article key={appointment.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slateCustom">{appointment.title}</p>
                <p className="text-sm text-slate-600">{appointment.client.name}</p>
                <p className="text-xs text-slate-500">
                  {format(appointment.startAt, "dd/MM/yyyy HH:mm", { locale: ptBR })} - {" "}
                  {format(appointment.endAt, "HH:mm", { locale: ptBR })}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
