import { useState, type ReactNode } from "react";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  Maximize2,
  Move,
  Plane,
  Share2,
  Star,
  Video,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/Buttons";
import { FilterChip } from "@/components/documents";

/* Re-export do card visual da galeria */
export { GalleryCard } from "@/components/cards";

/* ── GalleryGrid ─────────────────────────────────────────────── */
export function GalleryGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3", className)}>
      {children}
    </div>
  );
}

/* ── GalleryFilters (tipos de mídia) ─────────────────────────── */
export type MediaKind = "photo" | "video" | "360" | "drone" | "timelapse";

const KIND_META: Record<MediaKind, { label: string; Icon: React.ComponentType<{ className?: string }> }> = {
  photo: { label: "Fotos", Icon: Camera },
  video: { label: "Vídeos", Icon: Video },
  "360": { label: "360°", Icon: Compass },
  drone: { label: "Drone", Icon: Plane },
  timelapse: { label: "Timelapse", Icon: Video },
};

export function GalleryFilters({
  active,
  onChange,
  kinds = ["photo", "video", "360", "drone", "timelapse"],
}: {
  active?: MediaKind | "all";
  onChange?: (k: MediaKind | "all") => void;
  kinds?: MediaKind[];
}) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 md:mx-0 md:px-0">
      <FilterChip active={active === "all"} onClick={() => onChange?.("all")}>
        Todos
      </FilterChip>
      {kinds.map((k) => {
        const M = KIND_META[k];
        return (
          <FilterChip
            key={k}
            active={active === k}
            onClick={() => onChange?.(k)}
            icon={<M.Icon className="size-3.5" />}
          >
            {M.label}
          </FilterChip>
        );
      })}
    </div>
  );
}

/* ── StageSelector (etapa da obra) ───────────────────────────── */
export function StageSelector({
  stages,
  active,
  onChange,
}: {
  stages: string[];
  active?: string;
  onChange?: (s: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 md:mx-0 md:px-0">
      {stages.map((s) => (
        <FilterChip key={s} active={active === s} onClick={() => onChange?.(s)}>
          {s}
        </FilterChip>
      ))}
    </div>
  );
}

/* ── MediaViewer (visualizador básico foto/vídeo) ────────────── */
export function MediaViewer({
  src,
  poster,
  kind = "photo",
  alt = "",
  className,
}: {
  src?: string;
  poster?: string;
  kind?: MediaKind;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-3xl bg-graphite", className)}>
      {kind === "video" ? (
        <video controls poster={poster} src={src} className="size-full object-cover" />
      ) : src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <div
          className="size-full"
          style={{ background: "linear-gradient(135deg,#1F3D2B,#7BA25D)" }}
        />
      )}
    </div>
  );
}

/* ── ZoomControls ────────────────────────────────────────────── */
export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onFullscreen,
  onMove,
  className,
}: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFullscreen?: () => void;
  onMove?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 p-1 backdrop-blur",
        className,
      )}
    >
      <IconButton size="sm" variant="glass" label="Aproximar" icon={<ZoomIn className="size-4" />} onClick={onZoomIn} />
      <IconButton size="sm" variant="glass" label="Afastar" icon={<ZoomOut className="size-4" />} onClick={onZoomOut} />
      <IconButton size="sm" variant="glass" label="Mover" icon={<Move className="size-4" />} onClick={onMove} />
      <IconButton size="sm" variant="glass" label="Tela cheia" icon={<Maximize2 className="size-4" />} onClick={onFullscreen} />
    </div>
  );
}

/* ── ImageCarousel ───────────────────────────────────────────── */
export function ImageCarousel({
  images,
  className,
}: {
  images: { src?: string; alt?: string; gradient?: string }[];
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  const go = (d: number) => setIdx((i) => (i + d + total) % total);
  if (!total) return null;
  const img = images[idx];
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-3xl bg-graphite", className)}>
      {img.src ? (
        <img src={img.src} alt={img.alt ?? ""} className="size-full object-cover" />
      ) : (
        <div className="size-full" style={{ background: img.gradient ?? "linear-gradient(135deg,#1F3D2B,#7BA25D)" }} />
      )}
      {total > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            aria-label="Próxima"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir para ${i + 1}`}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Image360Viewer (placeholder estrutural) ─────────────────── */
export interface Environment360 {
  id: string;
  name: string;
  gradient?: string;
  imageUrl?: string;
}
export function Image360Viewer({
  environments,
  activeId,
  onChange,
  info,
  className,
}: {
  environments: Environment360[];
  activeId?: string;
  onChange?: (id: string) => void;
  info?: ReactNode;
  className?: string;
}) {
  const active = environments.find((e) => e.id === activeId) ?? environments[0];
  return (
    <div className={cn("relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-video", className)}>
      {active?.imageUrl ? (
        <img
          src={active.imageUrl}
          alt={active.name}
          className="size-full object-cover"
          style={{ transform: "scale(1.05)" }}
        />
      ) : (
        <div
          className="size-full"
          style={{ background: active?.gradient ?? "linear-gradient(135deg,#1F3D2B,#7BA25D)" }}
        />
      )}

      {/* Overlay superior */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Label 360 */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase text-white backdrop-blur">
        <Compass className="size-3.5" /> 360°
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4">
        <ZoomControls />
      </div>

      {/* Info footer */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        {info ?? (
          <div>
            <p className="text-sm font-semibold drop-shadow">{active?.name}</p>
            <p className="text-[11px] opacity-80">Arraste para explorar o ambiente</p>
          </div>
        )}

        {/* Environment selector */}
        {environments.length > 1 && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {environments.map((e) => (
              <button
                key={e.id}
                onClick={() => onChange?.(e.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium backdrop-blur transition-colors",
                  e.id === active?.id
                    ? "border-white bg-white text-graphite"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20",
                )}
              >
                {e.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Ações de mídia ──────────────────────────────────────────── */
export function DownloadMediaButton({ onClick }: { onClick?: () => void }) {
  return <IconButton size="md" variant="glass" label="Baixar" icon={<Download className="size-4" />} onClick={onClick} />;
}
export function ShareMediaButton({ onClick }: { onClick?: () => void }) {
  return <IconButton size="md" variant="glass" label="Compartilhar" icon={<Share2 className="size-4" />} onClick={onClick} />;
}
export function FavoriteMediaButton({ favorite, onClick }: { favorite?: boolean; onClick?: () => void }) {
  return (
    <IconButton
      size="md"
      variant="glass"
      label={favorite ? "Remover favorito" : "Favoritar"}
      icon={<Star className={cn("size-4", favorite && "fill-warning text-warning")} />}
      onClick={onClick}
    />
  );
}
