import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── ProgressBar ─────────────────────────────────────────────── */
export function ProgressBar({
  value,
  variant = "brand",
  size = "md",
  showLabel,
  className,
}: {
  value: number;
  variant?: "brand" | "leaf" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const h = { sm: "h-1.5", md: "h-2", lg: "h-2.5" }[size];
  const bar = {
    brand: "bg-brand",
    leaf: "bg-leaf",
    warning: "bg-warning",
    danger: "bg-destructive",
  }[variant];
  return (
    <div className={cn("w-full", className)}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("w-full overflow-hidden rounded-full bg-cream", h)}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
          {pct}%
        </p>
      )}
    </div>
  );
}

/* ── CircularProgress ────────────────────────────────────────── */
export function CircularProgress({
  value,
  size = 88,
  stroke = 8,
  label,
  variant = "brand",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  variant?: "brand" | "leaf" | "light";
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c - (pct / 100) * c;
  const track = variant === "light" ? "stroke-white/25" : "stroke-cream";
  const active = variant === "leaf" ? "stroke-leaf" : variant === "light" ? "stroke-white" : "stroke-brand";
  return (
    <div className={cn("relative inline-flex", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={track} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn(active, "transition-all duration-700")}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-lg font-bold tabular-nums">{pct}%</div>
          {label && <div className="text-[10px] text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}

/* ── Counter (animação de contagem) ──────────────────────────── */
export function Counter({
  value,
  duration = 900,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {display.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ── Statistic ───────────────────────────────────────────────── */
export function Statistic({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center gap-1.5 text-caption">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-1 text-2xl font-bold tracking-tight text-foreground truncate">
        {value}
      </div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

/* ── TrendIndicator ──────────────────────────────────────────── */
export function TrendIndicator({
  value,
  label,
  invert = false,
  className,
}: {
  value: number;
  label?: string;
  invert?: boolean;
  className?: string;
}) {
  const up = value > 0;
  const flat = value === 0;
  const positive = invert ? !up : up;
  const color = flat
    ? "text-muted-foreground bg-muted"
    : positive
      ? "text-leaf bg-leaf/10"
      : "text-destructive bg-destructive/10";
  const Icon = flat ? Minus : up ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        color,
        className,
      )}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%{label && <span className="opacity-70">· {label}</span>}
    </span>
  );
}

/* ── DeltaIndicator (valor absoluto com sinal) ───────────────── */
export function DeltaIndicator({
  delta,
  format = (v) => v.toLocaleString("pt-BR"),
  className,
}: {
  delta: number;
  format?: (v: number) => string;
  className?: string;
}) {
  const positive = delta >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold tabular-nums",
        positive ? "text-leaf" : "text-destructive",
        className,
      )}
    >
      {positive ? "+" : "−"}
      {format(Math.abs(delta))}
    </span>
  );
}

/* ── BadgeIndicator (pequena bolinha numérica) ───────────────── */
export function BadgeIndicator({
  count,
  variant = "danger",
  className,
}: {
  count: number;
  variant?: "danger" | "brand" | "leaf";
  className?: string;
}) {
  if (count <= 0) return null;
  const bg = { danger: "bg-destructive", brand: "bg-brand", leaf: "bg-leaf" }[variant];
  return (
    <span
      className={cn(
        "inline-grid min-w-[18px] h-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white",
        bg,
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
