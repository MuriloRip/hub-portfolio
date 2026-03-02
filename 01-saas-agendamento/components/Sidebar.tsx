import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type Props = {
  name: string;
};

const links = [
  { href: "/dashboard", label: "Visao geral" },
  { href: "/dashboard/clientes", label: "Clientes" },
  { href: "/dashboard/agenda", label: "Agenda" }
];

export function Sidebar({ name }: Props) {
  return (
    <aside className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:w-64 lg:sticky lg:top-4 lg:h-fit">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Painel Admin</p>
        <h2 className="text-lg font-bold text-slateCustom">{name}</h2>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-primary-50 hover:text-primary-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="pt-2">
        <LogoutButton />
      </div>
    </aside>
  );
}
