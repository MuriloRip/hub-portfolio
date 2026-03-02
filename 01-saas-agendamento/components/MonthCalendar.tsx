"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type CalendarAppointment = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  status: string;
  client: {
    name: string;
  };
};

type Props = {
  appointments: CalendarAppointment[];
};

export function MonthCalendar({ appointments }: Props) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = Array.from({ length: 7 }).map((_, index) =>
    format(addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), index), "EEE", { locale: ptBR })
  );

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slateCustom">Calendario do mes</h2>
        <span className="text-sm font-medium text-slate-500">
          {format(today, "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const events = appointments.filter((event) =>
            isSameDay(parseISO(event.startAt), day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`min-h-28 rounded-lg border p-2 ${
                isSameMonth(day, monthStart) ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50"
              } ${isSameDay(day, today) ? "ring-2 ring-primary-200" : ""}`}
            >
              <p className="mb-1 text-xs font-semibold text-slate-600">{format(day, "d")}</p>
              <div className="space-y-1">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded bg-primary-50 px-1.5 py-0.5 text-[11px] font-medium text-primary-700"
                    title={`${event.title} - ${event.client.name}`}
                  >
                    {format(parseISO(event.startAt), "HH:mm")} {event.client.name}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-[11px] font-semibold text-slate-500">+{events.length - 3} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
