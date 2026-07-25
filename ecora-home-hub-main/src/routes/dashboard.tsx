import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { getStoredAuthUser } from "@/lib/auth";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Images,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/layout/AppHeader";
import {
  Card,
  FinancialSummaryCard,
  MetricCard,
  ProgressCard,
  ProgressRing,
  ProjectHeroCard,
  StatusBadge,
  TextButton,
  Timeline,
} from "@/components/ecora";
import {
  currentProject,
  events,
  financialChart,
  financials,
  formatBRL,
  stages,
} from "@/data/mockData";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionUser = getStoredAuthUser();
    if (!sessionUser) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard · ECORA" },
      {
        name: "description",
        content: "Acompanhe em tempo real o avanço físico e financeiro da sua obra.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const sessionUser = getStoredAuthUser();
  const timelineItems = stages.slice(0, 5).map((s) => ({
    title: s.name,
    date: s.date,
    state: s.state,
    percent: s.percent,
  }));

  return (
    <AppLayout header={<DashboardHeader greeting="Bom dia," name={sessionUser?.name ?? "Cliente"} />}>
      <div className="space-y-8 pt-2">
        <ProjectHeroCard
          project={currentProject.name}
          location={currentProject.location}
          status="Em execução"
          physical={currentProject.physicalProgress}
          financial={currentProject.financialProgress}
          updatedAt={currentProject.lastUpdate}
        />

        <section>
          <SectionHeader title="Indicadores" subtitle="Visão geral" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="Dias decorridos"
              value={`${currentProject.elapsedDays}`}
              hint={`de ${currentProject.totalDays} dias`}
              icon={<CalendarDays className="size-4" />}
            />
            <MetricCard
              label="Dias restantes"
              value={`${currentProject.totalDays - currentProject.elapsedDays}`}
              hint={`Entrega ${currentProject.expectedDelivery.split(" ")[0]}/12/26`}
              accent="leaf"
              icon={<CalendarDays className="size-4" />}
            />
            <MetricCard
              label="Valor pago"
              value={formatBRL(financials.paid, true)}
              hint={`de ${formatBRL(financials.contracted, true)}`}
              icon={<Wallet className="size-4" />}
            />
            <MetricCard
              label="Próximo evento"
              value="3 dias"
              hint="Vistoria estrutural"
              accent="graphite"
              icon={<Building2 className="size-4" />}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Andamento" subtitle="Físico e financeiro" />
          <div className="grid gap-3 md:grid-cols-2">
            <ProgressCard
              title="Execução física"
              subtitle={currentProject.currentStage}
              percent={currentProject.physicalProgress}
            />
            <ProgressCard
              title="Execução financeira"
              subtitle={`${formatBRL(financials.paid, true)} de ${formatBRL(financials.contracted, true)}`}
              percent={currentProject.financialProgress}
              variant="leaf"
            />
          </div>
          <Card className="mt-3">
            <div className="flex items-center gap-5">
              <ProgressRing value={currentProject.physicalProgress} label="Físico" />
              <div className="flex-1 min-w-0">
                <p className="text-title">Comparativo</p>
                <p className="text-caption mt-0.5">
                  Físico está{" "}
                  {currentProject.physicalProgress - currentProject.financialProgress} p.p. à
                  frente do financeiro.
                </p>
                <TextButton className="mt-3" onClick={() => navigate({ to: "/documentos" })}>
                  Ver detalhes
                </TextButton>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <SectionHeader title="Financeiro" />
          <FinancialSummaryCard
            contracted={formatBRL(financials.contracted, true)}
            paid={formatBRL(financials.paid, true)}
            remaining={formatBRL(financials.remaining, true)}
          />
        </section>

        <section>
          <SectionHeader title="Evolução da obra" subtitle="Últimos 7 meses" />
          <Card>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={financialChart}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--color-hairline)" vertical={false} />
                  <XAxis
                    dataKey="m"
                    stroke="var(--color-muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-hairline)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fisico"
                    name="Físico"
                    stroke="var(--color-brand)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="financeiro"
                    name="Financeiro"
                    stroke="var(--color-leaf)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <Legend color="var(--color-brand)" label="Físico" />
              <Legend color="var(--color-leaf)" label="Financeiro" />
            </div>
          </Card>
        </section>

        <section>
          <SectionHeader
            title="Cronograma"
            subtitle="Etapas da obra"
            action={
              <TextButton onClick={() => navigate({ to: "/documentos" })}>Ver tudo</TextButton>
            }
          />
          <Card>
            <Timeline items={timelineItems} />
          </Card>
        </section>

        <section>
          <SectionHeader title="Próximos eventos" />
          <Card padded={false}>
            <ul className="divide-y divide-hairline">
              {events.map((e) => (
                <li key={e.id} className="flex items-center gap-3 p-4">
                  <div className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                    <CalendarDays className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.date}</p>
                  </div>
                  <StatusBadge status="info">
                    {e.type[0].toUpperCase() + e.type.slice(1)}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <section>
          <SectionHeader title="Atalhos" />
          <div className="grid grid-cols-2 gap-3">
            <Shortcut to="/documentos" icon={<FileText className="size-5" />} label="Documentos" />
            <Shortcut to="/galeria" icon={<Images className="size-5" />} label="Galeria" />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-title text-foreground">{title}</h2>
        {subtitle && <p className="text-caption">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Shortcut({
  to,
  icon,
  label,
}: {
  to: "/documentos" | "/galeria";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface-elevated p-4 hover:bg-muted transition-colors"
    >
      <span className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
          {icon}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground group-hover:text-brand transition-colors" />
    </Link>
  );
}
