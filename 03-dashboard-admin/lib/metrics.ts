import { addDays, format, subDays } from "date-fns";

export type MetricRow = {
  date: string;
  revenue: number;
  orders: number;
  newClients: number;
  churnRate: number;
  avgTicket: number;
};

export function getMetricRows(): MetricRow[] {
  const start = subDays(new Date(), 179);
  const rows: MetricRow[] = [];

  for (let index = 0; index < 180; index += 1) {
    const day = addDays(start, index);
    const season = Math.sin(index / 9) * 0.2 + Math.cos(index / 17) * 0.12;
    const baseOrders = 30 + index * 0.05;
    const orders = Math.max(12, Math.round(baseOrders * (1 + season)));
    const avgTicket = 52 + Math.sin(index / 5) * 6 + (index % 7);
    const revenue = Math.round(orders * avgTicket);
    const newClients = Math.max(2, Math.round(orders * 0.18 + (index % 4)));
    const churnRate = Number((4.5 + Math.cos(index / 12) * 1.3).toFixed(2));

    rows.push({
      date: format(day, "yyyy-MM-dd"),
      revenue,
      orders,
      newClients,
      churnRate,
      avgTicket: Number(avgTicket.toFixed(2))
    });
  }

  return rows;
}
