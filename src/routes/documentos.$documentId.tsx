import { createFileRoute, notFound } from "@tanstack/react-router";
import { Download, Eye, FileText, Share2, Star, User } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DetailHeader } from "@/components/layout/AppHeader";
import { Card, PrimaryButton, SecondaryButton, StatusBadge } from "@/components/ecora";
import { documents } from "@/data/mockData";

export const Route = createFileRoute("/documentos/$documentId")({
  loader: ({ params }) => {
    const doc = documents.find((d) => d.id === params.documentId);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} · ECORA` : "Documento · ECORA" },
    ],
  }),
  component: DocumentDetailsPage,
  notFoundComponent: () => (
    <AppLayout
      hideBottomNav
      header={<DetailHeader title="Documento" fallbackTo="/documentos" />}
    >
      <p className="text-center text-sm text-muted-foreground py-12">
        Documento não encontrado.
      </p>
    </AppLayout>
  ),
});

function DocumentDetailsPage() {
  const doc = Route.useLoaderData();

  return (
    <AppLayout
      hideBottomNav
      header={
        <DetailHeader title={doc.name} fallbackTo="/documentos" onShare={() => {}} />
      }
    >
      <div className="space-y-5">
        {/* Preview */}
        <div className="aspect-[4/3] rounded-3xl bg-cream border border-hairline overflow-hidden grid place-items-center">
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
              <FileText className="size-7" />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {doc.type}
            </p>
          </div>
        </div>

        {/* Title block */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold leading-tight">{doc.name}</h1>
            <StatusBadge status="info">{doc.version}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{doc.category}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton icon={<Eye className="size-4" />} fullWidth>
            Visualizar
          </PrimaryButton>
          <SecondaryButton icon={<Download className="size-4" />} fullWidth>
            Baixar
          </SecondaryButton>
        </div>

        {/* Info */}
        <Card>
          <h2 className="text-title mb-3">Informações</h2>
          <dl className="grid grid-cols-2 gap-y-4 gap-x-3 text-sm">
            <Info label="Tipo" value={doc.type.toUpperCase()} />
            <Info label="Tamanho" value={formatSize(doc.sizeKB)} />
            <Info label="Data" value={doc.date} />
            <Info label="Versão" value={doc.version} />
            <Info label="Enviado por" value={doc.uploadedBy} icon={<User className="size-3.5" />} />
            <Info label="Categoria" value={doc.category} />
          </dl>
          {doc.description && (
            <p className="mt-4 pt-4 border-t border-hairline text-sm text-foreground/80">
              {doc.description}
            </p>
          )}
        </Card>

        {/* Secondary actions */}
        <div className="flex items-center justify-around rounded-3xl bg-surface-elevated border border-hairline p-2">
          <IconAction icon={<Share2 className="size-5" />} label="Compartilhar" />
          <IconAction icon={<Star className="size-5" />} label="Favoritar" />
          <IconAction icon={<Download className="size-5" />} label="Baixar" />
        </div>
      </div>
    </AppLayout>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-foreground">
        {icon}
        {value}
      </dd>
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

function formatSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb} KB`;
}
