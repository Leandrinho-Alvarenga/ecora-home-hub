import { type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Circle,
  Download,
  FileText,
  Filter,
  Folder,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Play,
  Search,
  Share2,
  Star,
  TriangleAlert,
  User,
  WifiOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Buttons
   ───────────────────────────────────────────────────────────── */

type BtnBase = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
};

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium text-[15px] leading-none " +
  "min-h-12 px-6 transition-all duration-200 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

export function PrimaryButton({
  children,
  loading,
  fullWidth,
  icon,
  className,
  ...rest
}: BtnBase) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        btnBase,
        "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  loading,
  fullWidth,
  icon,
  className,
  ...rest
}: BtnBase) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        btnBase,
        "bg-transparent border border-brand text-brand hover:bg-brand-soft",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function TextButton({
  children,
  icon,
  className,
  ...rest
}: BtnBase) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 text-brand font-medium text-sm hover:opacity-70 transition-opacity",
        className,
      )}
    >
      {children}
      {icon ?? <ChevronRight className="size-4" />}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Badges
   ───────────────────────────────────────────────────────────── */

type Status = "concluido" | "andamento" | "pendente" | "atrasado" | "info";

export function StatusBadge({ status, children }: { status: Status; children?: ReactNode }) {
  const map: Record<Status, string> = {
    concluido: "bg-brand-soft text-brand",
    andamento: "bg-brand text-brand-foreground",
    pendente: "bg-muted text-muted-foreground",
    atrasado: "bg-destructive/10 text-destructive",
    info: "bg-secondary text-secondary-foreground",
  };
  const label: Record<Status, string> = {
    concluido: "Concluído",
    andamento: "Em andamento",
    pendente: "Pendente",
    atrasado: "Atrasado",
    info: "Info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        map[status],
      )}
    >
      {status === "concluido" && <Check className="size-3" />}
      {status === "atrasado" && <TriangleAlert className="size-3" />}
      {children ?? label[status]}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Cards
   ───────────────────────────────────────────────────────────── */

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-surface-elevated border border-hairline rounded-3xl shadow-[var(--shadow-card)]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  accent?: "brand" | "leaf" | "graphite";
}) {
  const dot = {
    brand: "bg-brand",
    leaf: "bg-leaf",
    graphite: "bg-graphite",
  }[accent];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="text-caption">{label}</span>
        {icon && (
          <div className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn("size-2 rounded-full", dot)} />
        <span className="text-metric text-foreground">{value}</span>
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

export function ProgressCard({
  title,
  percent,
  subtitle,
  variant = "brand",
}: {
  title: string;
  percent: number;
  subtitle?: string;
  variant?: "brand" | "leaf";
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-caption">{title}</p>
          {subtitle && <p className="mt-0.5 text-sm text-foreground/70">{subtitle}</p>}
        </div>
        <span className="text-xl font-bold text-foreground tabular-nums">{percent}%</span>
      </div>
      <ProgressBar value={percent} variant={variant} className="mt-4" />
    </Card>
  );
}

export function FinancialSummaryCard({
  contracted,
  paid,
  remaining,
}: {
  contracted: string;
  paid: string;
  remaining: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-title">Resumo financeiro</h3>
        <StatusBadge status="info">Atualizado</StatusBadge>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { l: "Contratado", v: contracted, c: "text-graphite" },
          { l: "Pago", v: paid, c: "text-brand" },
          { l: "A pagar", v: remaining, c: "text-leaf" },
        ].map((it) => (
          <div key={it.l} className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {it.l}
            </p>
            <p className={cn("mt-1 text-base font-bold tabular-nums truncate", it.c)}>
              {it.v}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────────────────────
   Progress components
   ───────────────────────────────────────────────────────────── */

export function ProgressBar({
  value,
  variant = "brand",
  className,
}: {
  value: number;
  variant?: "brand" | "leaf";
  className?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-cream", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          variant === "brand" ? "bg-brand" : "bg-leaf",
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 88,
  stroke = 8,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-cream"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-brand transition-all duration-700"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-lg font-bold tabular-nums">{value}%</div>
          {label && <div className="text-[10px] text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}

type TimelineState = "done" | "current" | "pending" | "late";

export function Timeline({
  items,
}: {
  items: { title: string; date?: string; state: TimelineState; percent?: number }[];
}) {
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        const dot = {
          done: "bg-leaf text-white",
          current: "bg-brand text-white",
          pending: "bg-transparent border-2 border-hairline text-muted-foreground",
          late: "bg-destructive/10 text-destructive border-2 border-destructive/30",
        }[it.state];
        return (
          <li key={i} className="relative pl-10 pb-5 last:pb-0">
            {!isLast && (
              <span className="absolute left-3 top-7 bottom-0 w-px bg-hairline" />
            )}
            <span
              className={cn(
                "absolute left-0 top-0.5 grid size-6 place-items-center rounded-full",
                dot,
              )}
            >
              {it.state === "done" && <Check className="size-3.5" />}
              {it.state === "current" && <span className="size-2 rounded-full bg-white" />}
              {it.state === "late" && <TriangleAlert className="size-3" />}
            </span>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{it.title}</p>
                {it.date && (
                  <p className="text-xs text-muted-foreground mt-0.5">{it.date}</p>
                )}
              </div>
              {it.state === "current" && it.percent != null && (
                <span className="text-xs font-semibold text-brand tabular-nums">
                  {it.percent}%
                </span>
              )}
              {it.state === "done" && <StatusBadge status="concluido" />}
              {it.state === "pending" && (
                <span className="text-xs text-muted-foreground">Pendente</span>
              )}
              {it.state === "late" && <StatusBadge status="atrasado" />}
            </div>
            {it.state === "current" && it.percent != null && (
              <ProgressBar value={it.percent} className="mt-2.5" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ─────────────────────────────────────────────────────────────
   Project hero + Header
   ───────────────────────────────────────────────────────────── */

export function AppHeader({
  greeting,
  name,
  onBell,
}: {
  greeting: string;
  name: string;
  onBell?: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-3 px-5 pt-6 pb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground font-bold">
          {name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <p className="text-[15px] font-semibold text-foreground truncate">{name}</p>
        </div>
      </div>
      <button
        onClick={onBell}
        aria-label="Notificações"
        className="relative grid size-11 place-items-center rounded-full bg-surface-elevated border border-hairline"
      >
        <Bell className="size-5 text-graphite" />
        <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-leaf ring-2 ring-surface-elevated" />
      </button>
    </header>
  );
}

export function ProjectHeroCard({
  project,
  location,
  status,
  physical,
  financial,
  updatedAt,
}: {
  project: string;
  location: string;
  status: string;
  physical: number;
  financial: number;
  updatedAt: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand text-brand-foreground p-6 shadow-[var(--shadow-elevated)]">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-leaf/20 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide">
            <span className="size-1.5 rounded-full bg-leaf" />
            {status}
          </span>
          <span className="text-[11px] opacity-70">{updatedAt}</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-tight">{project}</h2>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-80">
          <MapPin className="size-3.5" /> {location}
        </p>
        <div className="mt-6 flex items-center gap-6">
          <ProgressRingLight value={physical} label="Físico" />
          <div className="flex-1 space-y-3">
            <MiniStat label="Execução física" value={`${physical}%`} pct={physical} />
            <MiniStat
              label="Execução financeira"
              value={`${financial}%`}
              pct={financial}
              variant="leaf"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRingLight({ value, label }: { value: number; label: string }) {
  const size = 88;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke="rgba(255,255,255,0.15)" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          stroke="#7BA25D"
          fill="none"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-lg font-bold tabular-nums">{value}%</div>
          <div className="text-[10px] opacity-70">{label}</div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  pct,
  variant = "leaf",
}: {
  label: string;
  value: string;
  pct: number;
  variant?: "leaf" | "brand";
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs opacity-90">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: variant === "leaf" ? "#7BA25D" : "#EAE7E1",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Bottom navigation
   ───────────────────────────────────────────────────────────── */

export type NavKey = "dashboard" | "documentos" | "galeria" | "perfil";

export function BottomNavigation({
  active,
  onChange,
}: {
  active: NavKey;
  onChange: (k: NavKey) => void;
}) {
  const items: { key: NavKey; label: string; icon: ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <ChartIcon /> },
    { key: "documentos", label: "Documentos", icon: <Folder className="size-5" /> },
    { key: "galeria", label: "Galeria", icon: <ImageIcon className="size-5" /> },
    { key: "perfil", label: "Perfil", icon: <User className="size-5" /> },
  ];
  return (
    <nav
      className="sticky bottom-0 z-30 mt-6 border-t border-hairline bg-surface-elevated/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {items.map((it) => {
          const on = it.key === active;
          return (
            <li key={it.key}>
              <button
                onClick={() => onChange(it.key)}
                className={cn(
                  "flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  on ? "text-brand" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-full transition-colors",
                    on && "bg-brand-soft",
                  )}
                >
                  {it.icon}
                </span>
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Documents
   ───────────────────────────────────────────────────────────── */

const docPalette: Record<string, string> = {
  Projetos: "bg-[color-mix(in_oklab,var(--color-brand)_10%,white)] text-brand",
  Financeiro: "bg-[color-mix(in_oklab,var(--color-leaf)_15%,white)] text-leaf",
  Relatórios: "bg-cream text-graphite",
  Contratos: "bg-secondary text-secondary-foreground",
  Técnica: "bg-muted text-muted-foreground",
};

export function DocumentCategoryCard({
  name,
  count,
  icon,
}: {
  name: string;
  count: number;
  icon?: ReactNode;
}) {
  return (
    <Card className="p-4">
      <div
        className={cn(
          "grid size-10 place-items-center rounded-xl",
          docPalette[name] ?? "bg-muted text-muted-foreground",
        )}
      >
        {icon ?? <Folder className="size-5" />}
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground truncate">{name}</p>
      <p className="text-xs text-muted-foreground">{count} arquivos</p>
    </Card>
  );
}

export function DocumentListItem({
  name,
  category,
  date,
  size,
}: {
  name: string;
  category: string;
  date: string;
  size: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-elevated p-3">
      <div
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          docPalette[category] ?? "bg-muted text-muted-foreground",
        )}
      >
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {category} · {date} · {size}
        </p>
      </div>
      <button
        aria-label="Baixar"
        className="grid size-9 shrink-0 place-items-center rounded-full text-brand hover:bg-brand-soft transition-colors"
      >
        <Download className="size-4" />
      </button>
      <button
        aria-label="Compartilhar"
        className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
      >
        <Share2 className="size-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Gallery
   ───────────────────────────────────────────────────────────── */

export function MediaFilter({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors",
              on
                ? "bg-brand text-brand-foreground border-brand"
                : "bg-surface-elevated text-graphite border-hairline hover:bg-muted",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function GalleryCard({
  title,
  meta,
  gradient,
  kind = "photo",
}: {
  title: string;
  meta: string;
  gradient: string;
  kind?: "photo" | "video" | "360" | "drone";
}) {
  const kindLabel: Record<string, string> = {
    photo: "Foto",
    video: "Vídeo",
    "360": "360°",
    drone: "Drone",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-hairline aspect-[4/5] bg-cream">
      <div className="absolute inset-0" style={{ background: gradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-1 text-[10px] font-medium text-white">
        {kind === "video" && <Play className="size-3" />}
        {kindLabel[kind]}
      </span>
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <p className="text-sm font-semibold leading-tight truncate">{title}</p>
        <p className="text-[11px] opacity-80 truncate">{meta}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Fields
   ───────────────────────────────────────────────────────────── */

export function SearchField({ placeholder = "Buscar" }: { placeholder?: string }) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-hairline bg-surface-elevated px-4 h-11">
      <Search className="size-4 text-muted-foreground" />
      <input
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
      />
    </label>
  );
}

export function FilterButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface-elevated px-3.5 h-11 text-sm font-medium text-graphite transition-colors hover:bg-muted",
        className,
      )}
    >
      <Filter className="size-4" />
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   States
   ───────────────────────────────────────────────────────────── */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-hairline bg-surface-elevated px-6 py-10 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-cream text-graphite">
        {icon ?? <FileText className="size-5" />}
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-cream/70",
        className,
      )}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-8 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-foreground">Algo deu errado</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Não foi possível carregar as informações.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-medium text-brand hover:opacity-70"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
      <WifiOff className="size-4 text-graphite" />
      <div className="text-sm">
        <p className="font-medium text-foreground">Sem conexão</p>
        <p className="text-xs text-muted-foreground">
          Você está vendo dados salvos anteriormente.
        </p>
      </div>
    </div>
  );
}

/* Re-exports for convenience */
export { Star, ArrowRight, Circle };
