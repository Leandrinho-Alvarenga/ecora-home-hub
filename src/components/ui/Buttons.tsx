import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* Base classes shared by pill-shaped buttons */
const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium text-[15px] leading-none " +
  "min-h-12 px-6 transition-all duration-200 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "success"
  | "danger";

type BaseBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
};

/** PrimaryButton — action principal (verde institucional). */
export const PrimaryButton = forwardRef<HTMLButtonElement, BaseBtnProps>(
  ({ children, loading, fullWidth, icon, trailingIcon, className, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        base,
        "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
      {trailingIcon}
    </button>
  ),
);
PrimaryButton.displayName = "PrimaryButton";

/** SecondaryButton — borda verde, fundo transparente. */
export const SecondaryButton = forwardRef<HTMLButtonElement, BaseBtnProps>(
  ({ children, loading, fullWidth, icon, className, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        base,
        "bg-transparent border border-brand text-brand hover:bg-brand-soft",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  ),
);
SecondaryButton.displayName = "SecondaryButton";

/** GhostButton — apenas texto/ícone. */
export const GhostButton = forwardRef<HTMLButtonElement, BaseBtnProps>(
  ({ children, icon, className, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      className={cn(
        "inline-flex items-center gap-2 text-brand font-medium text-sm h-10 px-3 rounded-xl hover:bg-brand-soft transition-colors",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  ),
);
GhostButton.displayName = "GhostButton";

/** SuccessButton / DangerButton — variantes semânticas. */
export const SuccessButton = forwardRef<HTMLButtonElement, BaseBtnProps>(
  ({ children, loading, fullWidth, icon, className, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        base,
        "bg-leaf text-leaf-foreground hover:bg-leaf/90 shadow-sm",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  ),
);
SuccessButton.displayName = "SuccessButton";

export const DangerButton = forwardRef<HTMLButtonElement, BaseBtnProps>(
  ({ children, loading, fullWidth, icon, className, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      disabled={rest.disabled || loading}
      className={cn(
        base,
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  ),
);
DangerButton.displayName = "DangerButton";

/** IconButton — botão circular somente ícone. */
type IconBtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: "surface" | "solid" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
};

export const IconButton = forwardRef<HTMLButtonElement, IconBtnProps>(
  ({ icon, label, variant = "surface", size = "md", className, ...rest }, ref) => {
    const sizes = { sm: "size-9", md: "size-11", lg: "size-12" }[size];
    const variants = {
      surface:
        "bg-surface-elevated border border-hairline text-graphite hover:bg-muted",
      solid: "bg-brand text-brand-foreground hover:bg-brand/90",
      ghost: "bg-transparent text-graphite hover:bg-muted",
      glass:
        "bg-white/10 border border-white/20 text-white backdrop-blur hover:bg-white/20",
    }[variant];
    return (
      <button
        ref={ref}
        aria-label={label}
        {...rest}
        className={cn(
          "grid place-items-center rounded-full transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          sizes,
          variants,
          className,
        )}
      >
        {icon}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

/** FloatingButton — FAB para ações rápidas. */
export function FloatingButton({
  icon = <Plus className="size-6" />,
  label,
  onClick,
  className,
}: {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-5 md:bottom-8 md:right-8 z-30",
        "grid size-14 place-items-center rounded-full bg-brand text-brand-foreground",
        "shadow-[var(--shadow-elevated)] transition-transform duration-200 hover:scale-105 active:scale-95",
        className,
      )}
    >
      {icon}
    </button>
  );
}
