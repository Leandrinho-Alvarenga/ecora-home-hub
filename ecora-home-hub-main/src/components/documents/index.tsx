import { type ReactNode, useState } from "react";
import { Download, Eye, Star, Share2, FileText, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryBadge, VersionBadge, type Category } from "@/components/ui/Badges";
import { IconButton } from "@/components/ui/Buttons";
import { ProgressBar } from "@/components/ui/Indicators";
import { SearchField } from "@/components/ui/Fields";

/* Re-export para conveniência */
export { SearchField as SearchBar } from "@/components/ui/Fields";

/* ── FilterChip ──────────────────────────────────────────────── */
export function FilterChip({
  active,
  children,
  onClick,
  icon,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-150",
        active
          ? "border-brand bg-brand text-brand-foreground shadow-sm"
          : "border-hairline bg-surface-elevated text-graphite hover:bg-muted",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ── CategoryCard (browse por categoria) ─────────────────────── */
export function CategoryCard({
  category,
  count,
  icon,
  onClick,
}: {
  category: string;
  count: number;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col gap-3 rounded-3xl border border-hairline bg-surface-elevated p-4 text-left shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
        {icon ?? <FileText className="size-5" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{category}</p>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "documento" : "documentos"}
        </p>
      </div>
    </button>
  );
}

/* ── DocumentItem (linha compacta) ───────────────────────────── */
export interface DocumentItemProps {
  name: string;
  category: Category;
  type?: string;
  version?: string;
  date: string;
  sizeKB?: number;
  onDownload?: () => void;
  onPreview?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  favorite?: boolean;
}

export function DocumentItem({
  name,
  category,
  type = "pdf",
  version,
  date,
  sizeKB,
  onDownload,
  onPreview,
  onShare,
  onFavorite,
  favorite,
}: DocumentItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-hairline bg-surface-elevated p-3 transition-colors hover:bg-muted/60">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-[10px] font-bold uppercase text-brand">
        {type.slice(0, 4)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <CategoryBadge category={category} />
          <span>·</span>
          <span>{date}</span>
          {sizeKB != null && (
            <>
              <span>·</span>
              <span>{formatSize(sizeKB)}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {version && <VersionBadge version={version} />}
        {onFavorite && (
          <FavoriteButton favorite={favorite} onClick={onFavorite} />
        )}
        {onPreview && <PreviewButton onClick={onPreview} />}
        {onDownload && <DownloadButton onClick={onDownload} />}
        {onShare && <ShareButton onClick={onShare} />}
      </div>
    </div>
  );
}

/* ── DocumentList ────────────────────────────────────────────── */
export function DocumentList({
  items,
  emptyState,
}: {
  items: DocumentItemProps[];
  emptyState?: ReactNode;
}) {
  if (!items.length && emptyState) return <>{emptyState}</>;
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <DocumentItem key={i} {...it} />
      ))}
    </div>
  );
}

/* ── StorageIndicator ────────────────────────────────────────── */
export function StorageIndicator({
  usedGB,
  totalGB,
  className,
}: {
  usedGB: number;
  totalGB: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((usedGB / totalGB) * 100));
  const variant = pct > 85 ? "danger" : pct > 65 ? "warning" : "brand";
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface-elevated p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
          <HardDrive className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Armazenamento</p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {usedGB.toFixed(1)} GB de {totalGB} GB
          </p>
        </div>
        <span className="text-xs font-semibold tabular-nums text-graphite">{pct}%</span>
      </div>
      <ProgressBar value={pct} variant={variant} className="mt-3" />
    </div>
  );
}

/* ── Ações compactas ─────────────────────────────────────────── */
export function DownloadButton({ onClick, label = "Baixar" }: { onClick?: () => void; label?: string }) {
  return <IconButton size="sm" label={label} icon={<Download className="size-4" />} onClick={onClick} />;
}
export function PreviewButton({ onClick, label = "Visualizar" }: { onClick?: () => void; label?: string }) {
  return <IconButton size="sm" label={label} icon={<Eye className="size-4" />} onClick={onClick} />;
}
export function ShareButton({ onClick, label = "Compartilhar" }: { onClick?: () => void; label?: string }) {
  return <IconButton size="sm" label={label} icon={<Share2 className="size-4" />} onClick={onClick} />;
}
export function FavoriteButton({
  favorite,
  onClick,
  label = "Favoritar",
}: {
  favorite?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <IconButton
      size="sm"
      label={label}
      icon={<Star className={cn("size-4", favorite && "fill-warning text-warning")} />}
      onClick={onClick}
    />
  );
}

/* ── Estado local para uso em showcase ───────────────────────── */
export function FavoriteButtonStateful({ initial }: { initial?: boolean }) {
  const [on, setOn] = useState(!!initial);
  return <FavoriteButton favorite={on} onClick={() => setOn((v) => !v)} />;
}

function formatSize(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
