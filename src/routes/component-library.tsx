import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  Camera,
  Clock,
  Download,
  Edit3,
  FileText,
  Heart,
  Image as ImageIcon,
  Plus,
  Ruler,
  Trash2,
  Users,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/AppHeader";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  SuccessButton,
  DangerButton,
  IconButton,
  FloatingButton,
} from "@/components/ui/Buttons";
import { StatusBadge, CategoryBadge, VersionBadge } from "@/components/ui/Badges";
import {
  TextField,
  SearchField,
  PasswordField,
  Textarea,
  Dropdown,
  MultiSelect,
  DatePicker,
  UploadField,
} from "@/components/ui/Fields";
import {
  ProgressBar,
  CircularProgress,
  Counter,
  Statistic,
  TrendIndicator,
  DeltaIndicator,
  BadgeIndicator,
} from "@/components/ui/Indicators";
import {
  Card,
  HeroProjectCard,
  ProgressCard,
  MetricCard,
  EventCard,
  ContactCard,
  TimelineCard,
  DocumentCard,
  NotificationCard,
  EmptyCard,
  GalleryCard,
} from "@/components/cards";
import {
  PhysicalFinancialChart,
  CostDistributionChart,
  MonthlyCostChart,
  ProgressChart,
  TimelineChart,
} from "@/components/charts";
import { Timeline } from "@/components/timeline";
import {
  FilterChip,
  CategoryCard,
  DocumentItem,
  StorageIndicator,
} from "@/components/documents";
import {
  GalleryGrid,
  GalleryFilters,
  StageSelector,
  Image360Viewer,
  ImageCarousel,
  ZoomControls,
  MediaViewer,
} from "@/components/gallery";
import {
  FinancialSummary,
  FinancialCard,
  FinancialProgress,
  CostByStage,
  ExpenseItem,
  BudgetCard,
  InvoiceCard,
  PaymentCard,
} from "@/components/financial";
import {
  ProfileHeader,
  ProfileSection,
  ProfileMenuItem,
  LogoutButton,
} from "@/components/profile";
import {
  LoadingState,
  EmptyState,
  ErrorState,
  OfflineState,
  PermissionState,
  MaintenanceState,
  CardSkeleton,
  MetricSkeleton,
  ChartSkeleton,
  DocumentSkeleton,
  GallerySkeleton,
  TimelineSkeleton,
  ConfirmationDialog,
  DeleteDialog,
  SuccessDialog,
  ShareDialog,
  FilterDialog,
  PreviewDialog,
  ImageDialog,
  notify,
} from "@/components/feedback";
import { financialChart } from "@/data/mockData";

export const Route = createFileRoute("/component-library")({
  head: () => ({
    meta: [
      { title: "Component Library — ECORA" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "Catálogo interno de componentes do Design System ECORA — Área do Cliente.",
      },
    ],
  }),
  component: ComponentLibrary,
});

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4 py-8 first:pt-4">
      <div className="border-l-2 border-brand pl-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-start gap-3">{children}</div>;
}

function ComponentLibrary() {
  const [dlgConfirm, setDlgConfirm] = useState(false);
  const [dlgDelete, setDlgDelete] = useState(false);
  const [dlgSuccess, setDlgSuccess] = useState(false);
  const [dlgShare, setDlgShare] = useState(false);
  const [dlgFilter, setDlgFilter] = useState(false);
  const [dlgPreview, setDlgPreview] = useState(false);
  const [dlgImage, setDlgImage] = useState(false);
  const [search, setSearch] = useState("");
  const [mediaKind, setMediaKind] = useState<"all" | "photo" | "video" | "360" | "drone" | "timelapse">("all");
  const [stage, setStage] = useState("Alvenaria");
  const [multi, setMulti] = useState<string[]>(["projetos"]);

  const sections: { id: string; label: string }[] = [
    { id: "buttons", label: "Botões" },
    { id: "badges", label: "Badges" },
    { id: "fields", label: "Campos" },
    { id: "indicators", label: "Indicadores" },
    { id: "cards", label: "Cards" },
    { id: "charts", label: "Gráficos" },
    { id: "timeline", label: "Timeline" },
    { id: "documents", label: "Documentos" },
    { id: "gallery", label: "Galeria" },
    { id: "financial", label: "Financeiro" },
    { id: "profile", label: "Perfil" },
    { id: "feedback", label: "Estados & Diálogos" },
  ];

  return (
    <AppLayout
      header={
        <PageHeader
          title="Component Library"
          subtitle="Catálogo interno · Design System ECORA"
        />
      }
    >
      {/* Nav de âncoras */}
      <nav
        aria-label="Seções"
        className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-full border border-hairline bg-surface-elevated px-3 py-1.5 text-xs font-medium text-graphite hover:bg-muted"
          >
            {s.label}
          </a>
        ))}
      </nav>

      {/* Buttons */}
      <Section id="buttons" title="Botões" description="Primário, secundário, ghost, ícone e FAB.">
        <Row>
          <PrimaryButton icon={<Plus className="size-4" />}>Adicionar</PrimaryButton>
          <PrimaryButton loading>Enviando</PrimaryButton>
          <SecondaryButton>Secundário</SecondaryButton>
          <GhostButton icon={<Edit3 className="size-4" />}>Ghost</GhostButton>
          <SuccessButton>Aprovar</SuccessButton>
          <DangerButton icon={<Trash2 className="size-4" />}>Excluir</DangerButton>
          <PrimaryButton disabled>Desabilitado</PrimaryButton>
        </Row>
        <div className="mt-4">
          <Row>
            <IconButton label="Editar" icon={<Edit3 className="size-4" />} />
            <IconButton label="Baixar" icon={<Download className="size-4" />} />
            <IconButton label="Favoritar" icon={<Heart className="size-4" />} variant="solid" />
            <IconButton label="Fotografar" icon={<Camera className="size-4" />} variant="ghost" />
          </Row>
        </div>
        <div className="relative mt-6 h-20 rounded-2xl border border-dashed border-hairline">
          <FloatingButton label="Nova ação" className="!absolute !bottom-3 !right-3" />
        </div>
      </Section>

      {/* Badges */}
      <Section id="badges" title="Badges" description="Status, categoria e versão.">
        <Row>
          <StatusBadge status="concluido" />
          <StatusBadge status="andamento" />
          <StatusBadge status="pendente" />
          <StatusBadge status="atrasado" />
          <StatusBadge status="cancelado" />
          <StatusBadge status="aguardando" />
          <StatusBadge status="analise" />
          <StatusBadge status="aprovado" />
        </Row>
        <div className="mt-4">
          <Row>
            <CategoryBadge category="projetos" />
            <CategoryBadge category="financeiro" />
            <CategoryBadge category="fotos" />
            <CategoryBadge category="videos" />
            <CategoryBadge category="360" />
            <CategoryBadge category="drone" />
            <CategoryBadge category="contrato" />
            <CategoryBadge category="relatorio" />
          </Row>
        </div>
        <div className="mt-4">
          <Row>
            <VersionBadge version="v1.0" />
            <VersionBadge version="v2.1" />
            <VersionBadge version="v3.0-beta" />
          </Row>
        </div>
      </Section>

      {/* Fields */}
      <Section id="fields" title="Campos" description="Formulários e entradas.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nome completo" placeholder="João Ferreira" required />
          <TextField label="E-mail" placeholder="voce@email.com" error="E-mail inválido" />
          <PasswordField label="Senha" placeholder="Digite sua senha" />
          <SearchField value={search} onChange={setSearch} placeholder="Buscar documentos..." />
          <Dropdown
            label="Etapa"
            placeholder="Selecione"
            options={[
              { value: "fundacao", label: "Fundação" },
              { value: "alvenaria", label: "Alvenaria" },
              { value: "cobertura", label: "Cobertura" },
            ]}
          />
          <DatePicker label="Data prevista" />
          <MultiSelect
            label="Categorias"
            values={multi}
            onChange={setMulti}
            options={[
              { value: "projetos", label: "Projetos" },
              { value: "financeiro", label: "Financeiro" },
              { value: "relatorio", label: "Relatório" },
            ]}
          />
          <Textarea label="Observações" placeholder="Adicione uma nota..." />
        </div>
        <div className="mt-4">
          <UploadField label="Anexos" hint="PDF, DOCX, JPG até 20MB" />
        </div>
      </Section>

      {/* Indicators */}
      <Section id="indicators" title="Indicadores" description="Progresso, contadores e tendências.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-caption">Barra</p>
            <ProgressBar value={68} showLabel className="mt-3" />
            <ProgressBar value={40} variant="leaf" showLabel className="mt-3" />
            <ProgressBar value={90} variant="warning" showLabel className="mt-3" />
          </Card>
          <Card className="flex items-center justify-around">
            <CircularProgress value={68} label="Físico" />
            <CircularProgress value={58} variant="leaf" label="Fin." />
          </Card>
          <Card>
            <Statistic
              label="Documentos"
              icon={<FileText className="size-3.5" />}
              value={<Counter value={132} />}
              hint={<TrendIndicator value={4.2} label="mês" />}
            />
            <div className="mt-3">
              <DeltaIndicator delta={-1240} format={(v) => `R$ ${v.toLocaleString("pt-BR")}`} />
            </div>
            <div className="mt-3">
              <BadgeIndicator count={9} />
            </div>
          </Card>
        </div>
      </Section>

      {/* Cards */}
      <Section id="cards" title="Cards" description="Cards temáticos reutilizáveis.">
        <HeroProjectCard
          name="Residência Campos"
          location="Barretos, SP"
          physical={68}
          financial={58}
          currentStage="Alvenaria Estrutural"
          nextStage="Cobertura"
          updatedAt="Hoje · 08:30"
        />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <ProgressCard title="Execução física" subtitle="Alvenaria em andamento" percent={68} />
          <ProgressCard title="Execução financeira" percent={58} variant="leaf" />
          <MetricCard label="Prazo" value="132 dias" hint="de 190" icon={<Calendar className="size-4" />} />
          <MetricCard label="Fotos" value={<Counter value={248} />} icon={<ImageIcon className="size-4" />} trend={<TrendIndicator value={12.4} />} />
          <MetricCard label="Medições" value="04" icon={<Ruler className="size-4" />} />
          <MetricCard label="Visitas" value="12" icon={<Users className="size-4" />} loading />
          <EventCard
            title="Vistoria estrutural"
            date="14/07/2026"
            time="09:00"
            description="Verificação da alvenaria do pavimento térreo."
            icon={<Calendar className="size-4" />}
          />
          <ContactCard name="Marina Ribeiro" role="Engenheira responsável" phone="17991234567" whatsapp="17991234567" />
          <TimelineCard
            stage="Cobertura"
            status="pendente"
            startDate="15/08/2026"
            endDate="30/09/2026"
            responsible="Eng. Marina"
          />
          <NotificationCard title="Nova medição disponível" body="Referente ao mês de julho." date="08:30" />
          <NotificationCard title="Documento atualizado" body="Projeto arquitetônico v3." date="Ontem" read />
          <DocumentCard
            id="d1"
            name="Projeto arquitetônico — v3"
            category="projetos"
            version="v3.0"
            date="10/07/2026"
            uploadedBy="Eng. Marina"
            type="pdf"
          />
          <GalleryCard title="Alvenaria térreo" date="11/07/2026" kind="photo" gradient="linear-gradient(135deg,#1F3D2B,#7BA25D)" />
          <EmptyCard
            icon={<ImageIcon className="size-6" />}
            title="Nenhuma foto ainda"
            description="Assim que a equipe publicar, aparecerá aqui."
            action={<PrimaryButton>Atualizar</PrimaryButton>}
          />
        </div>
      </Section>

      {/* Charts */}
      <Section id="charts" title="Gráficos" description="Visualização premium com Recharts.">
        <div className="grid gap-4 md:grid-cols-2">
          <PhysicalFinancialChart data={financialChart} subtitle="Últimos 7 meses" />
          <CostDistributionChart
            subtitle="Total contratado"
            data={[
              { name: "Estrutura", value: 480 },
              { name: "Alvenaria", value: 260 },
              { name: "Instalações", value: 210 },
              { name: "Acabamento", value: 300 },
            ]}
          />
          <MonthlyCostChart
            subtitle="Últimos 6 meses"
            data={[
              { m: "Fev", valor: 42000 },
              { m: "Mar", valor: 68000 },
              { m: "Abr", valor: 51000 },
              { m: "Mai", valor: 74000 },
              { m: "Jun", valor: 62000 },
              { m: "Jul", valor: 88000 },
            ]}
          />
          <ProgressChart value={68} label="Físico" />
          <TimelineChart
            data={financialChart.map((d) => ({ m: d.m, value: d.fisico }))}
            subtitle="Execução física"
          />
        </div>
      </Section>

      {/* Timeline */}
      <Section id="timeline" title="Timeline" description="Etapas com expandir/recolher.">
        <Card>
          <Timeline
            items={[
              { id: "1", title: "Fundação", state: "done", date: "Concluída em 12/03", responsible: "Mestre Pedro" },
              { id: "2", title: "Estrutura", state: "done", date: "Concluída em 22/05" },
              {
                id: "3",
                title: "Alvenaria Estrutural",
                state: "current",
                percent: 68,
                date: "Em execução",
                description: "Avanço do quadrante norte em andamento.",
                responsible: "Eng. Marina Ribeiro",
              },
              { id: "4", title: "Cobertura", state: "pending", date: "Prevista para ago/26" },
              { id: "5", title: "Instalações", state: "late", date: "Atrasada em 4 dias" },
            ]}
          />
        </Card>
      </Section>

      {/* Documents */}
      <Section id="documents" title="Documentos" description="Filtros, categorias, listagem e armazenamento.">
        <div className="flex flex-wrap gap-2">
          <FilterChip active>Todos</FilterChip>
          <FilterChip>Projetos</FilterChip>
          <FilterChip>Financeiro</FilterChip>
          <FilterChip>Relatórios</FilterChip>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <CategoryCard category="Projetos" count={8} />
          <CategoryCard category="Financeiro" count={12} />
          <CategoryCard category="Relatórios" count={5} />
        </div>
        <div className="mt-4 space-y-2">
          <DocumentItem
            name="Projeto arquitetônico — v3"
            category="projetos"
            version="v3.0"
            date="10/07/2026"
            sizeKB={8400}
            onDownload={() => notify.success("Download iniciado")}
            onPreview={() => setDlgPreview(true)}
            onShare={() => setDlgShare(true)}
            onFavorite={() => notify.info("Adicionado aos favoritos")}
          />
          <DocumentItem
            name="Medição nº 4"
            category="financeiro"
            type="xlsx"
            version="v1.0"
            date="01/07/2026"
            sizeKB={84}
          />
        </div>
        <div className="mt-4">
          <StorageIndicator usedGB={2.4} totalGB={5} />
        </div>
      </Section>

      {/* Gallery */}
      <Section id="gallery" title="Galeria" description="Grid, filtros, viewer e Image 360 estrutural.">
        <GalleryFilters active={mediaKind} onChange={setMediaKind} />
        <div className="mt-3">
          <StageSelector
            stages={["Fundação", "Radier", "Alvenaria", "Cobertura"]}
            active={stage}
            onChange={setStage}
          />
        </div>
        <GalleryGrid className="mt-4">
          {["photo", "video", "360", "drone"].map((k) => (
            <GalleryCard
              key={k}
              title={`${k.toUpperCase()} exemplo`}
              date="11/07/2026"
              kind={k as "photo" | "video" | "360" | "drone"}
              gradient="linear-gradient(135deg,#1F3D2B,#7BA25D)"
            />
          ))}
        </GalleryGrid>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ImageCarousel
            images={[
              { gradient: "linear-gradient(135deg,#1F3D2B,#7BA25D)" },
              { gradient: "linear-gradient(160deg,#2B2B2B,#7BA25D)" },
              { gradient: "linear-gradient(180deg,#7BA25D,#EAE7E1)" },
            ]}
          />
          <MediaViewer />
        </div>
        <div className="mt-4">
          <Image360Viewer
            environments={[
              { id: "sala", name: "Sala de estar", gradient: "linear-gradient(135deg,#1F3D2B,#EAE7E1)" },
              { id: "suite", name: "Suíte principal", gradient: "linear-gradient(160deg,#2B2B2B,#7BA25D)" },
              { id: "cozinha", name: "Cozinha", gradient: "linear-gradient(180deg,#7BA25D,#1F3D2B)" },
            ]}
            activeId="sala"
          />
        </div>
        <div className="mt-4 flex justify-center">
          <ZoomControls />
        </div>
      </Section>

      {/* Financial */}
      <Section id="financial" title="Financeiro" description="Painéis, orçamentos, notas e pagamentos.">
        <div className="grid gap-3 md:grid-cols-2">
          <FinancialSummary contracted={1250000} paid={284500} remaining={965500} />
          <FinancialProgress executed={312800} contracted={1250000} />
          <FinancialCard label="Total pago" value={284500} delta={12.4} />
          <FinancialCard label="A pagar" value={965500} variant="leaf" delta={-3.1} />
          <BudgetCard title="Estrutura" planned={480000} actual={512000} />
          <BudgetCard title="Alvenaria" planned={260000} actual={240000} />
          <InvoiceCard number="0025" supplier="Aço Central Ltda." date="04/07/2026" value={38400} status="aprovado" />
          <PaymentCard label="Medição nº 5" dueDate="22/07/2026" value={148000} onPay={() => notify.info("Detalhes abertos")} />
        </div>
        <div className="mt-4">
          <CostByStage
            items={[
              { name: "Estrutura", value: 480000 },
              { name: "Alvenaria", value: 260000 },
              { name: "Instalações", value: 210000 },
              { name: "Acabamento", value: 300000 },
            ]}
          />
        </div>
        <div className="mt-4 space-y-2">
          <ExpenseItem title="Cimento CP-II" category="Materiais" date="10/07/2026" value={2480} />
          <ExpenseItem title="Reembolso vistoria" date="08/07/2026" value={340} outflow={false} />
        </div>
      </Section>

      {/* Profile */}
      <Section id="profile" title="Perfil" description="Header, seções e itens de menu.">
        <ProfileHeader name="João Ferreira" email="joao@email.com" role="Cliente ECORA" />
        <div className="mt-4 space-y-4">
          <ProfileSection title="Conta">
            <ProfileMenuItem icon={<Edit3 className="size-4" />} label="Editar perfil" hint="Nome, foto e contato" />
            <ProfileMenuItem icon={<Clock className="size-4" />} label="Histórico" hint="Atividades recentes" />
          </ProfileSection>
          <ProfileSection title="Suporte">
            <ProfileMenuItem icon={<FileText className="size-4" />} label="Documentos" />
            <LogoutButton />
          </ProfileSection>
        </div>
      </Section>

      {/* Feedback */}
      <Section id="feedback" title="Estados & Diálogos" description="Loading, empty, error e modais.">
        <div className="grid gap-3 md:grid-cols-2">
          <LoadingState />
          <EmptyState title="Sem documentos" description="Nada por aqui ainda." />
          <ErrorState title="Erro ao carregar" description="Tente novamente em instantes." action={<SecondaryButton>Tentar de novo</SecondaryButton>} />
          <OfflineState />
          <PermissionState />
          <MaintenanceState />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <MetricSkeleton />
          <CardSkeleton />
          <DocumentSkeleton />
          <GallerySkeleton />
          <ChartSkeleton />
          <TimelineSkeleton />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <PrimaryButton onClick={() => setDlgConfirm(true)}>Confirmar</PrimaryButton>
          <DangerButton onClick={() => setDlgDelete(true)}>Excluir</DangerButton>
          <SuccessButton onClick={() => setDlgSuccess(true)}>Sucesso</SuccessButton>
          <SecondaryButton onClick={() => setDlgShare(true)}>Compartilhar</SecondaryButton>
          <SecondaryButton onClick={() => setDlgFilter(true)}>Filtros</SecondaryButton>
          <SecondaryButton onClick={() => setDlgPreview(true)}>Preview</SecondaryButton>
          <SecondaryButton onClick={() => setDlgImage(true)}>Imagem</SecondaryButton>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <GhostButton onClick={() => notify.success("Salvo com sucesso")}>Toast Sucesso</GhostButton>
          <GhostButton onClick={() => notify.error("Falha ao enviar", "Verifique sua conexão")}>Toast Erro</GhostButton>
          <GhostButton onClick={() => notify.warning("Atenção")}>Toast Aviso</GhostButton>
          <GhostButton onClick={() => notify.info("Nova versão disponível")}>Toast Info</GhostButton>
        </div>
      </Section>

      <ConfirmationDialog
        open={dlgConfirm}
        onOpenChange={setDlgConfirm}
        title="Confirmar ação?"
        description="Deseja aprovar a medição nº 4?"
        onConfirm={() => notify.success("Medição aprovada")}
      />
      <DeleteDialog open={dlgDelete} onOpenChange={setDlgDelete} onConfirm={() => notify.success("Removido")} />
      <SuccessDialog open={dlgSuccess} onOpenChange={setDlgSuccess} title="Tudo certo!" description="Sua ação foi concluída." />
      <ShareDialog open={dlgShare} onOpenChange={setDlgShare} url="https://ecora.app/obra/123" />
      <FilterDialog open={dlgFilter} onOpenChange={setDlgFilter}>
        <MultiSelect label="Categorias" values={multi} onChange={setMulti} options={[{ value: "projetos", label: "Projetos" }, { value: "financeiro", label: "Financeiro" }]} />
        <DatePicker label="A partir de" />
      </FilterDialog>
      <PreviewDialog open={dlgPreview} onOpenChange={setDlgPreview}>
        <p className="text-sm text-graphite">Pré-visualização do documento aqui.</p>
      </PreviewDialog>
      <ImageDialog open={dlgImage} onOpenChange={setDlgImage} />
    </AppLayout>
  );
}
