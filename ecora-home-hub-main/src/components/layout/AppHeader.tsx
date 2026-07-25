import { type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Bell, Filter, MoreHorizontal, Search, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseProps {
  className?: string;
}

/* Cabeçalho da Dashboard: saudação + avatar + sino */
export function DashboardHeader({
  greeting,
  name,
  onBell,
}: {
  greeting: string;
  name: string;
  onBell?: () => void;
}) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <header className="flex items-center justify-between gap-3 px-5 md:px-8 pt-6 pb-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{greeting}</p>
          <p className="text-[15px] font-semibold text-foreground truncate">{name}</p>
        </div>
      </div>
      <button
        onClick={onBell}
        aria-label="Notificações"
        className="relative grid size-11 place-items-center rounded-full bg-surface-elevated border border-hairline"
      >
        <Bell className="size-5 text-graphite" />
        <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-leaf ring-2 ring-surface-elevated" />
      </button>
    </header>
  );
}

/* Cabeçalho de páginas principais: título + subtítulo + ações */
export function PageHeader({
  title,
  subtitle,
  showSearch,
  showFilter,
  showBell,
  className,
}: BaseProps & {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showBell?: boolean;
}) {
  return (
    <header className={cn("px-5 md:px-8 pt-6 pb-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <IconButton aria-label="Buscar">
              <Search className="size-5" />
            </IconButton>
          )}
          {showFilter && (
            <IconButton aria-label="Filtrar">
              <Filter className="size-5" />
            </IconButton>
          )}
          {showBell && (
            <IconButton aria-label="Notificações">
              <Bell className="size-5" />
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
}

/* Cabeçalho de tela de detalhes: voltar + título + ações */
export function DetailHeader({
  title,
  fallbackTo = "/dashboard",
  onShare,
  actions,
  transparent,
}: {
  title: string;
  fallbackTo?: string;
  onShare?: () => void;
  actions?: ReactNode;
  transparent?: boolean;
}) {
  const router = useRouter();
  const canBack = router.history.length > 1;

  const back = (
    <IconButton
      aria-label="Voltar"
      onClick={() => (canBack ? router.history.back() : router.navigate({ to: fallbackTo }))}
    >
      <ArrowLeft className="size-5" />
    </IconButton>
  );

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 px-5 md:px-8 pt-4 pb-3",
        transparent
          ? "text-white"
          : "text-foreground",
      )}
    >
      {canBack ? back : (
        <Link
          to={fallbackTo}
          aria-label="Voltar"
          className={cn(
            "grid size-11 place-items-center rounded-full border",
            transparent
              ? "bg-white/10 border-white/20 text-white backdrop-blur"
              : "bg-surface-elevated border-hairline",
          )}
        >
          <ArrowLeft className="size-5" />
        </Link>
      )}
      <h1 className={cn("text-base font-semibold truncate", transparent && "drop-shadow")}>
        {title}
      </h1>
      <div className="flex items-center gap-2">
        {onShare && (
          <IconButton aria-label="Compartilhar" onClick={onShare} transparent={transparent}>
            <Share2 className="size-5" />
          </IconButton>
        )}
        {actions ?? (
          <IconButton aria-label="Mais opções" transparent={transparent}>
            <MoreHorizontal className="size-5" />
          </IconButton>
        )}
      </div>
    </header>
  );
}

function IconButton({
  children,
  transparent,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { transparent?: boolean }) {
  return (
    <button
      {...rest}
      className={cn(
        "grid size-11 place-items-center rounded-full border transition-colors",
        transparent
          ? "bg-white/10 border-white/20 text-white backdrop-blur hover:bg-white/20"
          : "bg-surface-elevated border-hairline text-graphite hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}
