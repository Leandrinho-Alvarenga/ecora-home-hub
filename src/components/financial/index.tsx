import { type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, FileText, Receipt, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/cards";
import { ProgressBar } from "@/components/ui/Indicators";
import { StatusBadge, type Status } from "@/components/ui/Badges";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

/* ── FinancialSummary (mini painel horizontal) ───────────────── */
export function FinancialSummary({
  contracted,
  paid,
  remaining,
  className,
}: {
  contracted: number;
  paid: number;
  remaining: number;
  className?: string;
}) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h3 className="text-title text-foreground">Resumo financeiro</h3>
        <StatusBadge status="analise">Atualizado</StatusBadge>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { l: "Contratado", v: contracted, c: "text-graphite" },
          { l: "Pago", v: paid, c: "text-brand" },
          { l: "A pagar", v: remaining, c: "text-leaf" },
        ].map((it) => (
          <div key={it.l} className="min-w-0">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{it.l}</p>
            <p className={cn("mt-1 text-sm font-bold tabular-nums truncate", it.c)}>
              {fmt(it.v)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── FinancialCard (valor + tendência) ───────────────────────── */
export function FinancialCard({
  label,
  value,
  hint,
  delta,
  icon,
  variant = "brand",
}: {
  label: string;
  value: number;
  hint?: ReactNode;
  delta?: number;
  icon?: ReactNode;
  variant?: "brand" | "leaf" | "graphite";
}) {
  const positive = (delta ?? 0) >= 0;
  const dot = { brand: "bg-brand", leaf: "bg-leaf", graphite: "bg-graphite" }[variant];
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-caption">{label}</p>
        {icon && (
          <div className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn("size-2 rounded-full", dot)} />
        <span className="text-xl font-bold tabular-nums text-foreground">{fmt(value)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        {hint && <span className="truncate">{hint}</span>}
        {delta != null && (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold tabular-nums",
              positive ? "text-leaf" : "text-destructive",
            )}
          >
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
    </Card>
  );
}

/* ── FinancialProgress (executado × contratado) ──────────────── */
export function FinancialProgress({
  executed,
  contracted,
  label = "Executado",
  className,
}: {
  executed: number;
  contracted: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.round((executed / contracted) * 100);
  return (
    <Card className={className}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-caption">{label}</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{fmt(executed)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground">de {fmt(contracted)}</p>
          <p className="text-xs font-semibold tabular-nums text-brand">{pct}%</p>
        </div>
      </div>
      <ProgressBar value={pct} className="mt-3" />
    </Card>
  );
}

/* ── CostByStage (barra empilhada minimalista) ───────────────── */
export function CostByStage({
  items,
  className,
}: {
  items: { name: string; value: number; color?: string }[];
  className?: string;
}) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const palette = ["var(--brand)", "var(--leaf)", "var(--graphite)", "var(--warning)", "var(--info)"];
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <h3 className="text-title text-foreground">Custo por etapa</h3>
        <span className="text-xs font-semibold tabular-nums text-graphite">{fmt(total)}</span>
      </div>
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-cream">
        {items.map((it, i) => (
          <div
            key={it.name}
            className="h-full transition-all duration-500"
            style={{
              width: `${(it.value / total) * 100}%`,
              background: it.color ?? palette[i % palette.length],
            }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: it.color ?? palette[i % palette.length] }}
              />
              <span className="truncate text-graphite">{it.name}</span>
            </div>
            <span className="tabular-nums text-muted-foreground">{fmt(it.value)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── ExpenseItem (linha) ─────────────────────────────────────── */
export function ExpenseItem({
  title,
  category,
  date,
  value,
  outflow = true,
}: {
  title: string;
  category?: string;
  date: string;
  value: number;
  outflow?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-elevated p-3">
      <div
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          outflow ? "bg-destructive/10 text-destructive" : "bg-leaf/10 text-leaf",
        )}
      >
        <Receipt className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-[11px] text-muted-foreground">
          {category ? `${category} · ` : ""}
          {date}
        </p>
      </div>
      <p
        className={cn(
          "text-sm font-bold tabular-nums",
          outflow ? "text-destructive" : "text-leaf",
        )}
      >
        {outflow ? "−" : "+"}
        {fmt(value)}
      </p>
    </div>
  );
}

/* ── BudgetCard ──────────────────────────────────────────────── */
export function BudgetCard({
  title,
  planned,
  actual,
}: {
  title: string;
  planned: number;
  actual: number;
}) {
  const diff = actual - planned;
  const over = diff > 0;
  const pct = Math.min(100, Math.round((actual / planned) * 100));
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            over ? "bg-destructive/10 text-destructive" : "bg-leaf/15 text-leaf",
          )}
        >
          {over ? "Acima" : "Dentro"} {Math.abs((diff / planned) * 100).toFixed(1)}%
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Previsto</p>
          <p className="font-semibold tabular-nums text-graphite">{fmt(planned)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Realizado</p>
          <p className={cn("font-semibold tabular-nums", over ? "text-destructive" : "text-leaf")}>
            {fmt(actual)}
          </p>
        </div>
      </div>
      <ProgressBar value={pct} variant={over ? "danger" : "brand"} className="mt-3" />
    </Card>
  );
}

/* ── InvoiceCard ─────────────────────────────────────────────── */
export function InvoiceCard({
  number,
  supplier,
  date,
  value,
  status = "aprovado",
  onOpen,
}: {
  number: string;
  supplier: string;
  date: string;
  value: number;
  status?: Status;
  onOpen?: () => void;
}) {
  return (
    <Card interactive={!!onOpen} as={onOpen ? "button" : "div"} className={onOpen ? "w-full text-left" : ""}>
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
          <FileText className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">NF {number}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {supplier} · {date}
              </p>
            </div>
            <StatusBadge status={status} size="sm" />
          </div>
          <p className="mt-2 text-lg font-bold tabular-nums text-foreground">{fmt(value)}</p>
        </div>
      </div>
    </Card>
  );
}

/* ── PaymentCard ─────────────────────────────────────────────── */
export function PaymentCard({
  label,
  dueDate,
  value,
  status = "pendente",
  onPay,
}: {
  label: string;
  dueDate: string;
  value: number;
  status?: Status;
  onPay?: () => void;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-caption">Próximo pagamento</p>
          <p className="mt-1 text-sm font-semibold text-foreground truncate">{label}</p>
          <p className="text-[11px] text-muted-foreground">Vence em {dueDate}</p>
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground">
          <Wallet className="size-5" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold tabular-nums text-foreground">{fmt(value)}</p>
        <StatusBadge status={status} />
      </div>
      {onPay && (
        <button
          onClick={onPay}
          className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Ver detalhes do pagamento
        </button>
      )}
    </Card>
  );
}
