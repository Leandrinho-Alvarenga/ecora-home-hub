import { type ReactNode } from "react";
import {
  Check,
  Clock,
  AlertTriangle,
  XCircle,
  Hourglass,
  Search,
  ThumbsUp,
  FileText,
  DollarSign,
  Camera,
  Video,
  Compass,
  Plane,
  FileSignature,
  BarChart3,
  Folder,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── StatusBadge ─────────────────────────────────────────────── */
export type Status =
  | "concluido"
  | "andamento"
  | "pendente"
  | "atrasado"
  | "cancelado"
  | "aguardando"
  | "analise"
  | "aprovado";

const STATUS_MAP: Record<
  Status,
  { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  concluido: { label: "Concluído", className: "bg-brand-soft text-brand", Icon: Check },
  andamento: { label: "Em andamento", className: "bg-brand text-brand-foreground", Icon: Clock },
  pendente: { label: "Pendente", className: "bg-muted text-muted-foreground", Icon: Hourglass },
  atrasado: { label: "Atrasado", className: "bg-destructive/10 text-destructive", Icon: AlertTriangle },
  cancelado: { label: "Cancelado", className: "bg-muted text-muted-foreground line-through", Icon: XCircle },
  aguardando: { label: "Aguardando aprovação", className: "bg-warning/15 text-warning", Icon: Hourglass },
  analise: { label: "Em análise", className: "bg-info/10 text-info", Icon: Search },
  aprovado: { label: "Aprovado", className: "bg-leaf/15 text-leaf", Icon: ThumbsUp },
};

export function StatusBadge({
  status,
  children,
  size = "md",
  className,
}: {
  status: Status;
  children?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const cfg = STATUS_MAP[status];
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        cfg.className,
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-2.5" : "size-3"} />
      {children ?? cfg.label}
    </span>
  );
}

/* ── CategoryBadge ───────────────────────────────────────────── */
export type Category =
  | "projetos"
  | "financeiro"
  | "fotos"
  | "videos"
  | "360"
  | "drone"
  | "contrato"
  | "relatorio"
  | "geral";

const CATEGORY_MAP: Record<
  Category,
  { label: string; Icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  projetos: { label: "Projetos", Icon: FileText, className: "bg-brand-soft text-brand" },
  financeiro: { label: "Financeiro", Icon: DollarSign, className: "bg-leaf/15 text-leaf" },
  fotos: { label: "Fotos", Icon: Camera, className: "bg-info/10 text-info" },
  videos: { label: "Vídeos", Icon: Video, className: "bg-graphite/10 text-graphite" },
  "360": { label: "360°", Icon: Compass, className: "bg-brand/10 text-brand" },
  drone: { label: "Drone", Icon: Plane, className: "bg-warning/15 text-warning" },
  contrato: { label: "Contrato", Icon: FileSignature, className: "bg-muted text-graphite" },
  relatorio: { label: "Relatório", Icon: BarChart3, className: "bg-cream text-graphite" },
  geral: { label: "Arquivo geral", Icon: Folder, className: "bg-muted text-muted-foreground" },
};

export function CategoryBadge({
  category,
  children,
  className,
}: {
  category: Category;
  children?: ReactNode;
  className?: string;
}) {
  const cfg = CATEGORY_MAP[category];
  const Icon = cfg.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cfg.className,
        className,
      )}
    >
      <Icon className="size-3" />
      {children ?? cfg.label}
    </span>
  );
}

/* ── VersionBadge ────────────────────────────────────────────── */
export function VersionBadge({ version, className }: { version: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-hairline bg-surface-elevated px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-graphite",
        className,
      )}
    >
      {version}
    </span>
  );
}
