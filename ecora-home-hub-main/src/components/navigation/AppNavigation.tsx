import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Home, Images, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredAuthUser } from "@/lib/auth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/documentos", label: "Documentos", icon: FileText },
  { to: "/galeria", label: "Galeria", icon: Images },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

function useActiveKey() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return items.find((it) => pathname.startsWith(it.to))?.to ?? "/dashboard";
}

export function BottomNav() {
  const active = useActiveKey();
  return (
    <nav
      aria-label="Navegação principal"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface-elevated/95 backdrop-blur shadow-[var(--shadow-nav)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const on = active === to;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] w-full flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors",
                  on ? "text-brand" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full transition-colors",
                    on && "bg-brand-soft",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DesktopSidebar() {
  const active = useActiveKey();
  const sessionUser = getStoredAuthUser();
  const initials = (sessionUser?.name ?? "Cliente")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <aside
      aria-label="Navegação lateral"
      className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-hairline bg-surface-elevated"
    >
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground font-bold">
          E
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight text-foreground">ECORA</p>
          <p className="text-[11px] text-muted-foreground">Área do cliente</p>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon }) => {
            const on = active === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                    on
                      ? "bg-brand text-brand-foreground"
                      : "text-graphite hover:bg-muted",
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-hairline p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-cream text-graphite font-semibold text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {sessionUser?.name ?? "Cliente"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">Residência Campos</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
