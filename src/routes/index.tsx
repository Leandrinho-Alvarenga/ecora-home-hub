import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  CalendarDays,
  Camera,
  FileSignature,
  FileText,
  Folder,
  ImageIcon,
  Receipt,
  Wallet,
} from "lucide-react";
import {
  AppHeader,
  BottomNavigation,
  Card,
  DocumentCategoryCard,
  DocumentListItem,
  EmptyState,
  ErrorState,
  FilterButton,
  FinancialSummaryCard,
  GalleryCard,
  LoadingSkeleton,
  MediaFilter,
  MetricCard,
  OfflineState,
  PrimaryButton,
  ProgressBar,
  ProgressCard,
  ProgressRing,
  ProjectHeroCard,
  SearchField,
  SecondaryButton,
  StatusBadge,
  TextButton,
  Timeline,
  type NavKey,
} from "@/components/ecora";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ECORA — Área do Cliente · Design System" },
      {
        name: "description",
        content:
          "Catálogo do Design System da ECORA: componentes, tokens e padrões visuais do app do cliente.",
      },
    ],
  }),
  component: Showcase,
});

const CHART_DATA = [
  { m: "Jan", fisico: 8, financeiro: 6 },
  { m: "Fev", fisico: 18, financeiro: 14 },
  { m: "Mar", fisico: 27, financeiro: 22 },
  { m: "Abr", fisico: 38, financeiro: 30 },
  { m: "Mai", fisico: 49, financeiro: 39 },
  { m: "Jun", fisico: 58, financeiro: 48 },
  { m: "Jul", fisico: 68, financeiro: 58 },
];

function Showcase() {
  const [nav, setNav] = useState<NavKey>("dashboard");
  const [media, setMedia] = useState("Todos");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md flex min-h-screen flex-col">
        <AppHeader greeting="Bom dia," name="João Ferreira" />

        <main className="flex-1 space-y-8 px-5 pb-6">
          {/* Hero */}
          <ProjectHeroCard
            project="Residência Campos"
            location="Barretos, SP"
            status="Em execução"
            physical={68}
            financial={58}
            updatedAt="Hoje, 08:30"
          />

          {/* Metrics */}
          <Section title="Indicadores" subtitle="Visão geral da obra">
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Dias decorridos"
                value="132"
                hint="de 190 dias"
                icon={<CalendarDays className="size-4" />}
              />
              <MetricCard
                label="Dias restantes"
                value="58"
                hint="Entrega 18/12/2026"
                accent="leaf"
                icon={<CalendarDays className="size-4" />}
              />
              <MetricCard
                label="Valor pago"
                value="R$ 284,5k"
                hint="de R$ 1,25M"
                accent="brand"
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
          </Section>

          {/* Progress + Ring */}
          <Section title="Andamento" subtitle="Físico e financeiro">
            <div className="space-y-3">
              <ProgressCard
                title="Execução física"
                subtitle="Alvenaria estrutural"
                percent={68}
              />
              <ProgressCard
                title="Execução financeira"
                subtitle="R$ 725k de R$ 1,25M"
                percent={58}
                variant="leaf"
              />
              <Card>
                <div className="flex items-center gap-5">
                  <ProgressRing value={68} label="Físico" />
                  <div className="flex-1">
                    <p className="text-title">Comparativo</p>
                    <p className="text-caption mt-0.5">
                      Físico está 10 p.p. à frente do financeiro.
                    </p>
                    <TextButton className="mt-3">Ver detalhes</TextButton>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          {/* Financial */}
          <Section title="Financeiro">
            <FinancialSummaryCard
              contracted="R$ 1,25M"
              paid="R$ 284,5k"
              remaining="R$ 965,5k"
            />
          </Section>

          {/* Chart */}
          <Section title="Evolução da obra" subtitle="Últimos 7 meses">
            <Card>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
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
                <LegendDot color="var(--color-brand)" label="Físico" />
                <LegendDot color="var(--color-leaf)" label="Financeiro" />
              </div>
            </Card>
          </Section>

          {/* Timeline */}
          <Section title="Cronograma" subtitle="Etapas da obra">
            <Card>
              <Timeline
                items={[
                  { title: "Fundação", date: "Concluída em 12/03", state: "done" },
                  { title: "Estrutura", date: "Concluída em 22/05", state: "done" },
                  {
                    title: "Alvenaria estrutural",
                    date: "Em execução",
                    state: "current",
                    percent: 68,
                  },
                  { title: "Cobertura", date: "Prevista para ago/26", state: "pending" },
                  { title: "Acabamentos", date: "Prevista para out/26", state: "pending" },
                ]}
              />
            </Card>
          </Section>

          {/* Documents */}
          <Section
            title="Documentos"
            subtitle="Categorias principais"
            action={<TextButton>Ver todos</TextButton>}
          >
            <div className="grid grid-cols-3 gap-3">
              <DocumentCategoryCard name="Projetos" count={24} icon={<Folder className="size-5" />} />
              <DocumentCategoryCard name="Financeiro" count={12} icon={<Receipt className="size-5" />} />
              <DocumentCategoryCard name="Contratos" count={6} icon={<FileSignature className="size-5" />} />
              <DocumentCategoryCard name="Relatórios" count={18} icon={<FileText className="size-5" />} />
              <DocumentCategoryCard name="Técnica" count={9} icon={<FileText className="size-5" />} />
              <DocumentCategoryCard name="Projetos" count={4} icon={<ImageIcon className="size-5" />} />
            </div>
            <div className="mt-4 space-y-2">
              <DocumentListItem
                name="Projeto arquitetônico — v3"
                category="Projetos"
                date="10/07/2026"
                size="8,4 MB"
              />
              <DocumentListItem
                name="Nota fiscal — Estrutura metálica"
                category="Financeiro"
                date="04/07/2026"
                size="212 KB"
              />
              <DocumentListItem
                name="Diário de obra — Semana 18"
                category="Relatórios"
                date="01/07/2026"
                size="1,1 MB"
              />
            </div>
          </Section>

          {/* Gallery */}
          <Section
            title="Galeria"
            subtitle="Registros da obra"
            action={<TextButton>Ver todos</TextButton>}
          >
            <MediaFilter
              options={["Todos", "Fotos", "Vídeos", "360°", "Drone", "Timelapse"]}
              value={media}
              onChange={setMedia}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <GalleryCard
                title="Alvenaria — Pav. térreo"
                meta="Hoje · Barretos, SP"
                gradient="linear-gradient(135deg,#1F3D2B, #7BA25D)"
                kind="photo"
              />
              <GalleryCard
                title="Vista aérea"
                meta="Ontem · Drone"
                gradient="linear-gradient(160deg,#2B2B2B,#7BA25D)"
                kind="drone"
              />
              <GalleryCard
                title="Sala de estar"
                meta="Panorâmica"
                gradient="linear-gradient(135deg,#EAE7E1,#1F3D2B)"
                kind="360"
              />
              <GalleryCard
                title="Timelapse semana 18"
                meta="Vídeo · 1:24"
                gradient="linear-gradient(180deg,#1F3D2B,#2B2B2B)"
                kind="video"
              />
            </div>
          </Section>

          {/* Fields */}
          <Section title="Campos & filtros">
            <div className="space-y-3">
              <SearchField placeholder="Buscar documentos, etapas…" />
              <div className="flex gap-2">
                <FilterButton>Todos os tipos</FilterButton>
                <FilterButton>Mais recentes</FilterButton>
              </div>
            </div>
          </Section>

          {/* Design system reference */}
          <div className="pt-6 border-t border-hairline">
            <h2 className="text-display text-foreground">Design System</h2>
            <p className="text-caption mt-1">
              Catálogo dos tokens e componentes reutilizáveis do app ECORA.
            </p>
          </div>

          {/* Colors */}
          <Section title="Cores">
            <Card>
              <div className="grid grid-cols-2 gap-3">
                <Swatch name="Verde escuro" hex="#1F3D2B" className="bg-brand" fg="text-brand-foreground" />
                <Swatch name="Verde secundário" hex="#7BA25D" className="bg-leaf" fg="text-leaf-foreground" />
                <Swatch name="Off-white" hex="#EAE7E1" className="bg-cream" fg="text-graphite" />
                <Swatch name="Fundo" hex="#F7F6F3" className="bg-background border border-hairline" fg="text-graphite" />
                <Swatch name="Grafite" hex="#2B2B2B" className="bg-graphite" fg="text-white" />
                <Swatch name="Sucesso" hex="Leaf" className="bg-success" fg="text-white" />
              </div>
            </Card>
          </Section>

          {/* Typography */}
          <Section title="Tipografia">
            <Card>
              <div className="space-y-3">
                <p className="text-display">Título principal · 28/700</p>
                <p className="text-title">Título de seção · 18/600</p>
                <p className="text-metric">R$ 284.500</p>
                <p className="text-base">Texto comum · 16/400</p>
                <p className="text-caption">Texto auxiliar · 13/400</p>
              </div>
            </Card>
          </Section>

          {/* Buttons */}
          <Section title="Botões">
            <Card>
              <div className="space-y-3">
                <PrimaryButton fullWidth>Botão primário</PrimaryButton>
                <SecondaryButton fullWidth>Botão secundário</SecondaryButton>
                <div className="flex items-center justify-between">
                  <TextButton>Ver detalhes</TextButton>
                  <PrimaryButton loading>Carregando</PrimaryButton>
                </div>
                <PrimaryButton disabled fullWidth>
                  Desabilitado
                </PrimaryButton>
              </div>
            </Card>
          </Section>

          {/* Badges */}
          <Section title="Badges / Status">
            <Card>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="concluido" />
                <StatusBadge status="andamento" />
                <StatusBadge status="pendente" />
                <StatusBadge status="atrasado" />
                <StatusBadge status="info">Atualizado</StatusBadge>
              </div>
            </Card>
          </Section>

          {/* Progress components */}
          <Section title="Progresso">
            <Card>
              <div className="space-y-4">
                <ProgressBar value={30} />
                <ProgressBar value={62} variant="leaf" />
                <div className="flex items-center gap-4">
                  <ProgressRing value={68} label="Físico" />
                  <ProgressRing value={58} label="Financ." />
                </div>
              </div>
            </Card>
          </Section>

          {/* States */}
          <Section title="Estados">
            <div className="space-y-3">
              <EmptyState
                icon={<Camera className="size-5" />}
                title="Sem imagens ainda"
                description="Novos registros aparecerão aqui assim que forem publicados pela equipe."
                action={<SecondaryButton>Atualizar</SecondaryButton>}
              />
              <ErrorState onRetry={() => {}} />
              <OfflineState />
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-2/3" />
                <LoadingSkeleton className="h-4 w-1/2" />
                <LoadingSkeleton className="h-24 w-full" />
              </div>
            </div>
          </Section>

          <p className="text-center text-[11px] text-muted-foreground pt-6">
            ECORA · Área do Cliente — v0.1 Design System
          </p>
        </main>

        <BottomNavigation active={nav} onChange={setNav} />
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-title text-foreground">{title}</h2>
          {subtitle && <p className="text-caption">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Swatch({
  name,
  hex,
  className,
  fg,
}: {
  name: string;
  hex: string;
  className: string;
  fg: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${className}`}>
      <p className={`text-sm font-semibold ${fg}`}>{name}</p>
      <p className={`text-xs opacity-80 ${fg}`}>{hex}</p>
    </div>
  );
}
