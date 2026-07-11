import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  FileText,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/AppHeader";
import { Card, SecondaryButton, StatusBadge } from "@/components/ecora";
import { currentProject, currentUser } from "@/data/mockData";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil · ECORA" },
      { name: "description", content: "Informações do cliente, obra e preferências." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const initials = currentUser.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <AppLayout header={<PageHeader title="Perfil" subtitle="Sua conta e sua obra" />}>
      <div className="space-y-6">
        {/* Identity card */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground text-lg font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate">
                {currentUser.name}
              </p>
              <p className="text-sm text-muted-foreground truncate">Cliente ECORA</p>
            </div>
          </div>
          <div className="mt-5 space-y-2.5 text-sm">
            <Line icon={<Mail className="size-4" />} value={currentUser.email} />
            <Line icon={<Phone className="size-4" />} value={currentUser.phone} />
          </div>
        </Card>

        {/* Project card */}
        <section>
          <h2 className="text-title mb-3">Obra vinculada</h2>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-bold truncate">{currentProject.name}</p>
                <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" /> {currentProject.location}
                </p>
              </div>
              <StatusBadge status="andamento" />
            </div>
            <div className="mt-4 pt-4 border-t border-hairline space-y-2.5 text-sm">
              <Line label="Etapa atual" value={currentProject.currentStage} />
              <Line label="Entrega prevista" value={currentProject.expectedDelivery} />
              <Line label="Engenheiro responsável" value={currentProject.engineer} />
            </div>
          </Card>
        </section>

        {/* Settings */}
        <section>
          <h2 className="text-title mb-3">Preferências</h2>
          <Card padded={false}>
            <ul className="divide-y divide-hairline">
              <Row icon={<Bell className="size-5" />} title="Notificações" hint="Alertas de novas mídias e documentos" />
              <Row icon={<Shield className="size-5" />} title="Privacidade" hint="Como seus dados são usados" />
              <Row icon={<FileText className="size-5" />} title="Termos de uso" />
              <Row icon={<HelpCircle className="size-5" />} title="Suporte" hint="Fale com a equipe ECORA" />
            </ul>
          </Card>
        </section>

        <SecondaryButton fullWidth icon={<LogOut className="size-4" />}>
          Sair da conta
        </SecondaryButton>

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          ECORA · Área do Cliente — v0.2
        </p>
      </div>
    </AppLayout>
  );
}

function Line({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label?: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

function Row({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <li>
      <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted transition-colors">
        <span className="grid size-10 place-items-center rounded-xl bg-cream text-graphite">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </button>
    </li>
  );
}
