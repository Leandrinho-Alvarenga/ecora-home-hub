import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar, CircularProgress } from "@/components/ui/Indicators";
import { StatusBadge, CategoryBadge, VersionBadge, type Category, type Status } from "@/components/ui/Badges";
import { IconButton } from "@/components/ui/Buttons";

/* ── Card (base) ─────────────────────────────────────────────── */
export function Card({
  children,
  className,
  padded = true,
  interactive,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
  as?: React.ElementType;
}) {
  return (
    <As
      className={cn(
        "bg-surface-elevated border border-hairline rounded-3xl shadow-[var(--shadow-card)]",
        padded && "p-5",
        interactive &&
          "transition-all duration-200 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5 active:scale-[0.99]",
        className,
      )}
    >
      {children}
    </As>
  );
}

/* ── HeroProjectCard ─────────────────────────────────────────── */
export function HeroProjectCard({
  name,
  location,
  status = "Em execução",
  physical,
  financial,
  currentStage,
  nextStage,
  imageUrl,
  gradient = "linear-gradient(135deg,#1F3D2B,#7BA25D)",
  updatedAt,
}: {
  name: string;
  location: string;
  status?: string;
  physical: number;
  financial: number;
  currentStage?: string;
  nextStage?: string;
  imageUrl?: string;
  gradient?: string;
  updatedAt?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl text-white shadow-[var(--shadow-elevated)]"
      style={imageUrl ? undefined : { background: gradient }}
    >
      {imageUrl && (
        <>
          <img src={imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand/85 via-brand/60 to-graphite/70" />
        </>
      )}
      <div className="relative p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide backdrop-blur">
            <span className="size-1.5 rounded-full bg-leaf" />
            {status}
          </span>
          {updatedAt && <span className="text-[11px] opacity-80">{updatedAt}</span>}
        </div>
        <h2 className="mt-4 text-2xl font-bold leading-tight">{name}</h2>
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm opacity-80">
          <MapPin className="size-3.5" /> {location}
        </p>

        <div className="mt-6 flex items-center gap-6">
          <CircularProgress value={physical} label="Físico" variant="light" />
          <div className="flex-1 space-y-3 min-w-0">
            <MiniStat label="Execução física" value={`${physical}%`} pct={physical} />
            <MiniStat label="Execução financeira" value={`${financial}%`} pct={financial} tone="leaf" />
          </div>
        </div>

        {(currentStage || nextStage) && (
          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
            {currentStage && (
              <div>
                <p className="text-[10px] uppercase tracking-wide opacity-70">Etapa atual</p>
                <p className="mt-0.5 text-sm font-semibold truncate">{currentStage}</p>
              </div>
            )}
            {nextStage && (
              <div>
                <p className="text-[10px] uppercase tracking-wide opacity-70">Próxima etapa</p>
                <p className="mt-0.5 text-sm font-semibold truncate">{nextStage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  pct,
  tone = "white",
}: {
  label: string;
  value: string;
  pct: number;
  tone?: "white" | "leaf";
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between text-[11px] opacity-80">
        <span>{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className={cn("h-full rounded-full", tone === "leaf" ? "bg-leaf" : "bg-white")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── ProgressCard ────────────────────────────────────────────── */
export function ProgressCard({
  title,
  subtitle,
  percent,
  icon,
  variant = "brand",
  className,
}: {
  title: string;
  subtitle?: string;
  percent: number;
  icon?: ReactNode;
  variant?: "brand" | "leaf" | "warning";
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption">{title}</p>
          {subtitle && <p className="mt-0.5 text-sm text-foreground/70 truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {icon && (
            <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
              {icon}
            </span>
          )}
          <span className="text-xl font-bold text-foreground tabular-nums">{percent}%</span>
        </div>
      </div>
      <ProgressBar value={percent} variant={variant} className="mt-4" />
    </Card>
  );
}

/* ── MetricCard ──────────────────────────────────────────────── */
export function MetricCard({
  label,
  value,
  hint,
  icon,
  trend,
  loading,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  trend?: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-caption">{label}</span>
        {icon && (
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-7 w-20 rounded-md bg-muted animate-pulse" />
        ) : (
          <span className="text-2xl font-bold tabular-nums text-foreground">{value}</span>
        )}
      </div>
      {(hint || trend) && (
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {hint && <span className="truncate">{hint}</span>}
          {trend}
        </div>
      )}
    </Card>
  );
}

/* ── EventCard ───────────────────────────────────────────────── */
export function EventCard({
  title,
  date,
  time,
  description,
  icon,
  onClick,
}: {
  title: string;
  date: string;
  time?: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card interactive={!!onClick} as={onClick ? "button" : "div"} className={onClick ? "w-full text-left" : ""}>
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          <p className="text-xs text-muted-foreground">
            {date}
            {time && ` · ${time}`}
          </p>
          {description && (
            <p className="mt-1 text-xs text-foreground/70 line-clamp-2">{description}</p>
          )}
        </div>
        {onClick && <ChevronRight className="size-4 text-muted-foreground" />}
      </div>
    </Card>
  );
}

/* ── ContactCard ─────────────────────────────────────────────── */
export function ContactCard({
  name,
  role,
  phone,
  whatsapp,
  photoUrl,
}: {
  name: string;
  role: string;
  phone?: string;
  whatsapp?: string;
  photoUrl?: string;
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <Card>
      <div className="flex items-center gap-3">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="size-12 rounded-full object-cover" />
        ) : (
          <div className="grid size-12 place-items-center rounded-full bg-brand text-brand-foreground font-bold">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{role}</p>
        </div>
      </div>
      {(phone || whatsapp) && (
        <div className="mt-4 flex gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface-elevated px-3 py-2.5 text-sm font-medium text-graphite hover:bg-muted"
            >
              <Phone className="size-4" /> Ligar
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-leaf px-3 py-2.5 text-sm font-medium text-leaf-foreground hover:bg-leaf/90"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

/* ── TimelineCard ────────────────────────────────────────────── */
export function TimelineCard({
  stage,
  status,
  startDate,
  endDate,
  responsible,
  onDetail,
}: {
  stage: string;
  status: Status;
  startDate?: string;
  endDate?: string;
  responsible?: string;
  onDetail?: () => void;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{stage}</p>
          {responsible && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              Responsável · {responsible}
            </p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>
      {(startDate || endDate) && (
        <div className="mt-3 grid grid-cols-2 gap-3 rounded-2xl bg-muted/50 p-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Início</p>
            <p className="text-xs font-semibold text-graphite">{startDate ?? "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Término</p>
            <p className="text-xs font-semibold text-graphite">{endDate ?? "—"}</p>
          </div>
        </div>
      )}
      {onDetail && (
        <button
          onClick={onDetail}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:opacity-70"
        >
          Ver detalhes <ChevronRight className="size-3.5" />
        </button>
      )}
    </Card>
  );
}

/* ── DocumentCard ────────────────────────────────────────────── */
export function DocumentCard({
  id,
  name,
  category,
  version,
  date,
  uploadedBy,
  type = "pdf",
  onDownload,
  onShare,
  toHref,
}: {
  id: string;
  name: string;
  category: Category;
  version?: string;
  date: string;
  uploadedBy?: string;
  type?: string;
  onDownload?: () => void;
  onShare?: () => void;
  toHref?: string;
}) {
  const inner = (
    <Card interactive className="group">
      <div className="flex items-start gap-3">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-soft font-bold uppercase text-brand">
          {type.slice(0, 3)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground line-clamp-2">{name}</p>
            {version && <VersionBadge version={version} />}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <CategoryBadge category={category} />
            <span className="text-[11px] text-muted-foreground">{date}</span>
          </div>
          {uploadedBy && (
            <p className="mt-1 text-[11px] text-muted-foreground truncate">
              Enviado por {uploadedBy}
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="relative">
      {toHref ? (
        <Link to={toHref} params={{ documentId: id }}>{inner}</Link>
      ) : (
        inner
      )}
      {(onDownload || onShare) && (
        <div className="pointer-events-none absolute right-4 bottom-4 flex gap-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
          {onDownload && <IconButton size="sm" icon={<ChevronRight className="size-4" />} label="Abrir" onClick={onDownload} />}
        </div>
      )}
    </div>
  );
}

/* ── NotificationCard ────────────────────────────────────────── */
export function NotificationCard({
  title,
  body,
  date,
  read,
  onClick,
}: {
  title: string;
  body: string;
  date: string;
  read?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-3xl border p-4 transition-all duration-200 hover:shadow-[var(--shadow-card)]",
        read ? "border-hairline bg-surface-elevated" : "border-brand/20 bg-brand-soft/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            read ? "bg-muted" : "bg-brand",
          )}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-sm truncate",
                read ? "font-medium text-foreground/80" : "font-semibold text-foreground",
              )}
            >
              {title}
            </p>
            <span className="text-[11px] text-muted-foreground shrink-0">{date}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{body}</p>
        </div>
      </div>
    </button>
  );
}

/* ── EmptyCard ───────────────────────────────────────────────── */
export function EmptyCard({
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
    <Card className="text-center">
      {icon && (
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          {icon}
        </div>
      )}
      <h3 className="mt-3 text-title text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </Card>
  );
}

/* ── GalleryCard ─────────────────────────────────────────────── */
export function GalleryCard({
  title,
  date,
  gradient,
  imageUrl,
  kind,
  favorite,
  onFavorite,
  onClick,
}: {
  title: string;
  date: string;
  gradient?: string;
  imageUrl?: string;
  kind?: "photo" | "video" | "360" | "drone" | "timelapse";
  favorite?: boolean;
  onFavorite?: () => void;
  onClick?: () => void;
}) {
  const kindLabel = {
    photo: "Foto",
    video: "Vídeo",
    "360": "360°",
    drone: "Drone",
    timelapse: "Timelapse",
  };
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-hairline text-left shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      style={imageUrl ? undefined : { background: gradient ?? "linear-gradient(135deg,#1F3D2B,#7BA25D)" }}
    >
      {imageUrl && (
        <img src={imageUrl} alt={title} className="absolute inset-0 size-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/60" />
      {kind && (
        <span className="absolute top-3 left-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-white backdrop-blur">
          {kindLabel[kind]}
        </span>
      )}
      {onFavorite && (
        <button
          aria-label={favorite ? "Remover favorito" : "Favoritar"}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite();
          }}
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
        >
          <Star className={cn("size-4", favorite && "fill-warning text-warning")} />
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-sm font-semibold truncate drop-shadow">{title}</p>
        <p className="text-[11px] opacity-80">{date}</p>
      </div>
    </button>
  );
}
