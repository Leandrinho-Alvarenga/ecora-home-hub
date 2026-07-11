import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  Compass,
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DetailHeader } from "@/components/layout/AppHeader";
import { media } from "@/data/mockData";

export const Route = createFileRoute("/galeria/360/$mediaId")({
  loader: ({ params }) => {
    const item = media.find((m) => m.id === params.mediaId);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} · 360° · ECORA` : "360° · ECORA" },
    ],
  }),
  component: Image360Page,
});

function Image360Page() {
  const item = Route.useLoaderData();
  const [gyro, setGyro] = useState(false);
  const rooms = media.filter((m) => m.kind === "360");

  return (
    <AppLayout
      hideBottomNav
      hideSidebar
      fullBleed
      contentClassName="p-0"
    >
      <div className="relative min-h-screen w-full overflow-hidden bg-graphite">
        {/* Panoramic placeholder */}
        <div
          className="absolute inset-0 animate-[pan_60s_linear_infinite]"
          style={{
            background: `${item.gradient}, linear-gradient(90deg, #1F3D2B, #7BA25D, #1F3D2B)`,
            backgroundSize: "300% 100%",
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-20">
          <DetailHeader title={item.title} fallbackTo="/galeria" transparent />
        </div>

        {/* Info pill */}
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2">
          <div className="rounded-full bg-black/40 backdrop-blur px-3 py-1.5 text-[11px] text-white flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-leaf" />
            {item.environment ?? "Ambiente"} · {item.stage} · {item.date}
          </div>
        </div>

        {/* Instruction */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-white/80 pointer-events-none">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-white/10 backdrop-blur border border-white/20">
            <Compass className="size-6" />
          </div>
          <p className="mt-3 text-xs">Arraste para explorar em 360°</p>
        </div>

        {/* Right controls */}
        <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex flex-col gap-2">
          <CtrlButton label="Zoom in"><ZoomIn className="size-5" /></CtrlButton>
          <CtrlButton label="Zoom out"><ZoomOut className="size-5" /></CtrlButton>
          <CtrlButton label="Tela cheia"><Maximize2 className="size-5" /></CtrlButton>
          <CtrlButton
            label={gyro ? "Desativar giroscópio" : "Ativar giroscópio"}
            active={gyro}
            onClick={() => setGyro((v) => !v)}
          >
            <RotateCw className="size-5" />
          </CtrlButton>
        </div>

        {/* Room selector */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 pt-8 bg-gradient-to-t from-black/70 to-transparent"
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
        >
          <p className="text-[11px] uppercase tracking-wide text-white/60 mb-2 px-1">
            Ambientes
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {rooms.map((r) => {
              const on = r.id === item.id;
              return (
                <a
                  key={r.id}
                  href={`/galeria/360/${r.id}`}
                  className={
                    "shrink-0 rounded-2xl overflow-hidden border transition-all " +
                    (on
                      ? "border-leaf ring-2 ring-leaf/50"
                      : "border-white/15 opacity-80 hover:opacity-100")
                  }
                  style={{ width: 96, height: 64 }}
                >
                  <div
                    className="size-full"
                    style={{ background: r.gradient }}
                    aria-label={r.environment ?? r.title}
                  />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pan {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </AppLayout>
  );
}

function CtrlButton({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={
        "grid size-11 place-items-center rounded-full border backdrop-blur transition-colors " +
        (active
          ? "bg-leaf text-white border-leaf"
          : "bg-white/10 border-white/20 text-white hover:bg-white/20")
      }
    >
      {children}
    </button>
  );
}
