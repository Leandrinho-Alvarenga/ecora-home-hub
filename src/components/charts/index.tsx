import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { CircularProgress } from "@/components/ui/Indicators";

/* Cor helper: converte tokens em strings CSS var. */
const BRAND = "var(--brand)";
const LEAF = "var(--leaf)";
const GRAPHITE = "var(--graphite)";
const WARNING = "var(--warning)";
const INFO = "var(--info)";

interface ChartFrame {
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
  children: React.ReactNode;
}
function ChartFrame({ title, subtitle, height = 240, className, children }: ChartFrame) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-hairline bg-surface-elevated p-5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <h3 className="text-title text-foreground">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

/* Tooltip customizado */
function PremiumTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-hairline bg-surface-elevated/95 px-3 py-2 shadow-[var(--shadow-elevated)] backdrop-blur">
      {label && <p className="text-[11px] font-semibold text-graphite">{label}</p>}
      <div className="mt-1 space-y-0.5">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-semibold tabular-nums text-foreground">
              {typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PhysicalFinancialChart ──────────────────────────────────── */
export interface PhysFinPoint {
  m: string;
  fisico: number;
  financeiro: number;
}
export function PhysicalFinancialChart({
  data,
  title = "Execução Físico × Financeira",
  subtitle,
  height = 260,
}: {
  data: PhysFinPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} height={height}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: -10, right: 6, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="gFis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
              <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gFin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LEAF} stopOpacity={0.35} />
              <stop offset="100%" stopColor={LEAF} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<PremiumTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="fisico"
            name="Físico"
            stroke={BRAND}
            strokeWidth={2.5}
            fill="url(#gFis)"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="financeiro"
            name="Financeiro"
            stroke={LEAF}
            strokeWidth={2.5}
            fill="url(#gFin)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/* ── CostDistributionChart (doughnut) ────────────────────────── */
export interface CostSlice {
  name: string;
  value: number;
  color?: string;
}
const DEFAULT_PALETTE = [BRAND, LEAF, GRAPHITE, WARNING, INFO];
export function CostDistributionChart({
  data,
  title = "Distribuição de custos",
  subtitle,
  height = 240,
}: {
  data: CostSlice[];
  title?: string;
  subtitle?: string;
  height?: number;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} height={height}>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip content={<PremiumTooltip />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="85%"
            paddingAngle={2}
            stroke="var(--surface-elevated)"
            strokeWidth={2}
            animationDuration={800}
          >
            {data.map((s, i) => (
              <Cell key={s.name} fill={s.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/* ── MonthlyCostChart (bars) ─────────────────────────────────── */
export interface MonthlyPoint {
  m: string;
  valor: number;
}
export function MonthlyCostChart({
  data,
  title = "Custos mensais",
  subtitle,
  height = 240,
  formatValue = (v) => `R$ ${(v / 1000).toFixed(0)}k`,
}: {
  data: MonthlyPoint[];
  title?: string;
  subtitle?: string;
  height?: number;
  formatValue?: (v: number) => string;
}) {
  return (
    <ChartFrame title={title} subtitle={subtitle} height={height}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: -10, right: 6, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<PremiumTooltip />} formatter={(v: number) => formatValue(v)} />
          <Bar dataKey="valor" name="Custo" fill={BRAND} radius={[8, 8, 0, 0]} animationDuration={800} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/* ── ProgressChart (Circular) ────────────────────────────────── */
export function ProgressChart({
  value,
  label = "Execução",
  size = 160,
  className,
}: {
  value: number;
  label?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-3xl border border-hairline bg-surface-elevated p-5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <CircularProgress value={value} size={size} stroke={12} label={label} />
    </div>
  );
}

/* ── TimelineChart (linha horizontal com marcadores) ─────────── */
export interface TimelinePoint {
  m: string;
  value: number;
}
export function TimelineChart({
  data,
  title = "Evolução da obra",
  subtitle,
  height = 200,
}: {
  data: TimelinePoint[];
  title?: string;
  subtitle?: string;
  height?: number;
}) {
  const enriched = useMemo(() => data, [data]);
  return (
    <ChartFrame title={title} subtitle={subtitle} height={height}>
      <ResponsiveContainer>
        <LineChart data={enriched} margin={{ left: -10, right: 6, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--hairline)" strokeDasharray="3 4" vertical={false} />
          <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip content={<PremiumTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            name="Progresso"
            stroke={BRAND}
            strokeWidth={2.5}
            dot={{ r: 3, fill: BRAND }}
            activeDot={{ r: 5 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
