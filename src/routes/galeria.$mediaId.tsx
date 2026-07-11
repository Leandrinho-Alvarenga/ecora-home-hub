import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Download, Share2, Star } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DetailHeader } from "@/components/layout/AppHeader";
import { Card, StatusBadge } from "@/components/ecora";
import { media } from "@/data/mockData";

export const Route = createFileRoute("/galeria/$mediaId")({
  loader: ({ params }) => {
    const idx = media.findIndex((m) => m.id === params.mediaId);
    if (idx === -1) throw notFound();
    return {
      item: media[idx],
      prev: media[idx - 1]?.id ?? null,
      next: media[idx + 1]?.id ?? null,
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.item.title} · ECORA` : "Mídia · ECORA" }],
  }),
  component: MediaDetailsPage,
});

function MediaDetailsPage() {
  const { item, prev, next } = Route.useLoaderData();

  return (
    <AppLayout
      hideBottomNav
      fullBleed
      header={
        <div className="absolute inset-x-0 top-0 z-10">
          <DetailHeader title={item.title} fallbackTo="/galeria" onShare={() => {}} transparent />
        </div>
      }
    >
      {/* Media area */}
      <div className="relative w-full aspect-[4/5] md:aspect-video" style={{ background: item.gradient }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-5">
          <NavArrow to={prev} dir="prev" />
          <NavArrow to={next} dir="next" />
        </div>
      </div>

      <div className="px-5 md:px-8 py-5 space-y-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold">{item.title}</h1>
            <StatusBadge status="info">{item.stage}</StatusBadge>
          </div>
          {item.description && (
            <p className="mt-2 text-sm text-foreground/80">{item.description}</p>
          )}
        </div>

        <Card>
          <dl className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
            <Info label="Data" value={item.date} />
            {item.time && <Info label="Horário" value={item.time} />}
            {item.environment && <Info label="Ambiente" value={item.environment} />}
            <Info label="Etapa" value={item.stage} />
            <Info label="Local" value={item.location} />
            <Info label="Responsável" value={item.responsible} />
          </dl>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-hairline flex flex-wrap gap-2">
              {item.tags.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full bg-cream px-2.5 py-1 text-xs text-graphite"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </Card>

        <div className="flex items-center justify-around rounded-3xl bg-surface-elevated border border-hairline p-2">
          <IconAction icon={<Share2 className="size-5" />} label="Compartilhar" />
          <IconAction icon={<Star className="size-5" />} label="Favoritar" />
          <IconAction icon={<Download className="size-5" />} label="Baixar" />
        </div>
      </div>
    </AppLayout>
  );
}

function NavArrow({ to, dir }: { to: string | null; dir: "prev" | "next" }) {
  const cls =
    "grid size-11 place-items-center rounded-full bg-white/15 backdrop-blur border border-white/20 text-white transition-opacity";
  if (!to)
    return <span className={cls + " opacity-30 pointer-events-none"}>
      {dir === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </span>;
  return (
    <Link
      to="/galeria/$mediaId"
      params={{ mediaId: to }}
      aria-label={dir === "prev" ? "Anterior" : "Próxima"}
      className={cls + " hover:bg-white/25"}
    >
      {dir === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </Link>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function IconAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted-foreground hover:text-brand transition-colors">
      <span className="grid size-10 place-items-center rounded-full bg-cream text-graphite">
        {icon}
      </span>
      {label}
    </button>
  );
}
