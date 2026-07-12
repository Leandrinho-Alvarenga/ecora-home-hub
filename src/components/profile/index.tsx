import { type ReactNode } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/cards";

/* ── ProfileHeader ───────────────────────────────────────────── */
export function ProfileHeader({
  name,
  email,
  role,
  photoUrl,
  className,
}: {
  name: string;
  email?: string;
  role?: string;
  photoUrl?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-brand p-6 text-brand-foreground shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-leaf/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="size-16 rounded-full border-2 border-white/30 object-cover"
          />
        ) : (
          <div className="grid size-16 place-items-center rounded-full bg-white/15 text-xl font-bold backdrop-blur">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide opacity-70">{role ?? "Cliente"}</p>
          <h2 className="text-lg font-bold truncate">{name}</h2>
          {email && <p className="text-xs opacity-80 truncate">{email}</p>}
        </div>
      </div>
    </div>
  );
}

/* ── ProfileSection ──────────────────────────────────────────── */
export function ProfileSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <Card padded={false} className="divide-y divide-hairline overflow-hidden">
        {children}
      </Card>
    </div>
  );
}

/* ── ProfileMenuItem ─────────────────────────────────────────── */
export function ProfileMenuItem({
  icon,
  label,
  hint,
  onClick,
  danger,
  trailing,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  onClick?: () => void;
  danger?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
    >
      <div
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl",
          danger ? "bg-destructive/10 text-destructive" : "bg-brand-soft text-brand",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium truncate",
            danger ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </p>
        {hint && <p className="text-[11px] text-muted-foreground truncate">{hint}</p>}
      </div>
      {trailing ?? <ChevronRight className="size-4 text-muted-foreground" />}
    </button>
  );
}

/* ── LogoutButton ────────────────────────────────────────────── */
export function LogoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <ProfileMenuItem
      icon={<LogOut className="size-4" />}
      label="Sair da conta"
      onClick={onClick}
      danger
      trailing={<span />}
    />
  );
}
