import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Play } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/AppHeader";
import { EmptyState, FilterButton, MediaFilter } from "@/components/ecora";
import { media } from "@/data/mockData";
import type { MediaKind, ProjectStageKey } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/galeria/")({
  head: () => ({
    meta: [
      { title: "Galeria · ECORA" },
      { name: "description", content: "Acompanhe visualmente cada etapa da obra." },
    ],
  }),
  component: GalleryPage,
});

const KIND_OPTIONS: { key: MediaKind | "Todos"; label: string }[] = [
  { key: "Todos", label: "Todos" },
  { key: "photo", label: "Fotos" },
  { key: "video", label: "Vídeos" },
  { key: "360", label: "360°" },
  { key: "drone", label: "Drone" },
  { key: "timelapse", label: "Timelapse" },
];

const STAGES: (ProjectStageKey | "Todas")[] = [
  "Todas",
  "Projeto",
  "Fundação",
  "Radier",
  "Alvenaria",
  "Cobertura",
  "Instalações",
  "Acabamentos",
  "Entrega",
];

function GalleryPage() {
  const [kind, setKind] = useState<string>("Todos");
  const [stage, setStage] = useState<(typeof STAGES)[number]>("Todas");

  const filtered = useMemo(() => {
    return media.filter((m) => {
      const okKind =
        kind === "Todos" ||
        m.kind === KIND_OPTIONS.find((o) => o.label === kind)?.key;
      const okStage = stage === "Todas" || m.stage === stage;
      return okKind && okStage;
    });
  }, [kind, stage]);

  return (
    <AppLayout
      header={
        <PageHeader
          title="Galeria"
          subtitle="Fotos, vídeos, drone e panorâmicas 360°"
        />
      }
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <MediaFilter
            options={KIND_OPTIONS.map((o) => o.label)}
            value={kind}
            onChange={setKind}
          />
          <FilterButton
            type="button"
            onClick={() => {
              document.getElementById("gallery-stages")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Etapa
          </FilterButton>
        </div>

        {/* Stage chips */}
        <div id="gallery-stages" className="-mx-5 md:-mx-8 px-5 md:px-8 flex gap-2 overflow-x-auto no-scrollbar">
          {STAGES.map((s) => {
            const on = s === stage;
            return (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
                  on
                    ? "bg-brand text-brand-foreground border-brand"
                    : "bg-surface-elevated text-graphite border-hairline hover:bg-muted",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Camera className="size-5" />}
            title="Nenhum registro disponível"
            description="Nenhuma mídia encontrada para os filtros selecionados."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((m) => {
              const to = m.kind === "360" ? "/galeria/360/$mediaId" : "/galeria/$mediaId";
              return (
                <Link
                  key={m.id}
                  to={to}
                  params={{ mediaId: m.id }}
                  className="group relative overflow-hidden rounded-2xl border border-hairline aspect-[4/5] bg-cream"
                >
                  <div className="absolute inset-0" style={{ background: m.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-white">
                    {m.kind === "video" && <Play className="size-3" />}
                    {kindLabel(m.kind)}
                  </span>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <p className="text-xs font-semibold leading-tight truncate">
                      {m.title}
                    </p>
                    <p className="text-[10px] opacity-80 truncate">
                      {m.stage} · {m.date}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function kindLabel(k: MediaKind) {
  switch (k) {
    case "photo":
      return "Foto";
    case "video":
      return "Vídeo";
    case "360":
      return "360°";
    case "drone":
      return "Drone";
    case "timelapse":
      return "Timelapse";
  }
}
