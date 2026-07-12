import { type ReactNode } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, FileWarning, Inbox, Lock, WifiOff, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PrimaryButton, SecondaryButton, DangerButton, GhostButton } from "@/components/ui/Buttons";

/* ── State screens ───────────────────────────────────────────── */
interface StateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}
function StateShell({
  title,
  description,
  action,
  icon,
  tone = "brand",
  className,
}: StateProps & { tone?: "brand" | "danger" | "warning" | "info" }) {
  const toneCls = {
    brand: "bg-brand-soft text-brand",
    danger: "bg-destructive/10 text-destructive",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/10 text-info",
  }[tone];
  return (
    <div
      className={cn(
        "rounded-3xl border border-hairline bg-surface-elevated p-8 text-center shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className={cn("mx-auto grid size-14 place-items-center rounded-2xl", toneCls)}>
        {icon}
      </div>
      <h3 className="mt-4 text-title text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingState({ title = "Carregando...", description }: Partial<StateProps>) {
  return (
    <StateShell
      title={title}
      description={description}
      icon={
        <span className="size-6 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      }
    />
  );
}
export function EmptyState(props: StateProps) {
  return <StateShell {...props} icon={props.icon ?? <Inbox className="size-6" />} />;
}
export function ErrorState(props: StateProps) {
  return (
    <StateShell
      {...props}
      tone="danger"
      icon={props.icon ?? <AlertTriangle className="size-6" />}
    />
  );
}
export function OfflineState(props: Partial<StateProps>) {
  return (
    <StateShell
      title={props.title ?? "Você está offline"}
      description={
        props.description ??
        "Verifique sua conexão para acessar as últimas atualizações da obra."
      }
      action={props.action}
      tone="warning"
      icon={<WifiOff className="size-6" />}
    />
  );
}
export function PermissionState(props: Partial<StateProps>) {
  return (
    <StateShell
      title={props.title ?? "Acesso restrito"}
      description={
        props.description ?? "Você não tem permissão para visualizar este conteúdo."
      }
      action={props.action}
      tone="warning"
      icon={<Lock className="size-6" />}
    />
  );
}
export function MaintenanceState(props: Partial<StateProps>) {
  return (
    <StateShell
      title={props.title ?? "Em manutenção"}
      description={
        props.description ??
        "Estamos realizando melhorias. Volte em instantes para acessar novamente."
      }
      action={props.action}
      tone="info"
      icon={<Wrench className="size-6" />}
    />
  );
}

/* ── Skeletons ───────────────────────────────────────────────── */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-hairline bg-surface-elevated p-5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-2 w-full" />
    </div>
  );
}
export function MetricSkeleton() {
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-24" />
      <Skeleton className="mt-2 h-3 w-16" />
    </div>
  );
}
export function ChartSkeleton() {
  return (
    <div className="rounded-3xl border border-hairline bg-surface-elevated p-5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-48 w-full rounded-2xl" />
    </div>
  );
}
export function DocumentSkeleton() {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-elevated p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}
export function GallerySkeleton() {
  return <Skeleton className="aspect-[4/5] w-full rounded-3xl" />;
}
export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="size-7 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-3xl" />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

/* ── Dialogs ─────────────────────────────────────────────────── */
interface BaseDialogProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: ReactNode;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}: BaseDialogProps & {
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="gap-2">
          <SecondaryButton onClick={() => onOpenChange(false)}>{cancelLabel}</SecondaryButton>
          <PrimaryButton
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Excluir item?",
  description = "Esta ação não pode ser desfeita.",
  onConfirm,
}: Partial<BaseDialogProps> & { open: boolean; onOpenChange: (o: boolean) => void; onConfirm?: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <SecondaryButton fullWidth onClick={() => onOpenChange(false)}>
            Cancelar
          </SecondaryButton>
          <DangerButton
            fullWidth
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            Excluir
          </DangerButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-leaf/15 text-leaf">
          <CheckCircle2 className="size-6" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && <DialogDescription className="text-center">{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <PrimaryButton fullWidth onClick={() => onOpenChange(false)}>
            OK
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  title = "Compartilhar",
  url,
}: Partial<BaseDialogProps> & { open: boolean; onOpenChange: (o: boolean) => void; url?: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Envie este link para acesso rápido.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-muted p-2">
          <input
            readOnly
            value={url ?? window.location.href}
            className="flex-1 bg-transparent px-2 text-xs text-graphite outline-none"
          />
          <GhostButton
            onClick={() => {
              navigator.clipboard?.writeText(url ?? window.location.href);
              toast.success("Link copiado");
            }}
          >
            Copiar
          </GhostButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FilterDialog({
  open,
  onOpenChange,
  title = "Filtros",
  children,
  onApply,
  onClear,
}: Partial<BaseDialogProps> & {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children?: ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter className="gap-2">
          <SecondaryButton fullWidth onClick={() => onClear?.()}>
            Limpar
          </SecondaryButton>
          <PrimaryButton
            fullWidth
            onClick={() => {
              onApply?.();
              onOpenChange(false);
            }}
          >
            Aplicar
          </PrimaryButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PreviewDialog({
  open,
  onOpenChange,
  title = "Pré-visualização",
  children,
}: Partial<BaseDialogProps> & {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="rounded-2xl border border-hairline bg-muted p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export function ImageDialog({
  open,
  onOpenChange,
  src,
  alt = "",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  src?: string;
  alt?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0">
        {src ? (
          <img src={src} alt={alt} className="size-full object-contain" />
        ) : (
          <div
            className="aspect-video w-full"
            style={{ background: "linear-gradient(135deg,#1F3D2B,#7BA25D)" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ── Toast helpers (padronizados) ────────────────────────────── */
export const notify = {
  success: (msg: string, description?: string) => toast.success(msg, { description }),
  error: (msg: string, description?: string) => toast.error(msg, { description, icon: <FileWarning className="size-4" /> }),
  warning: (msg: string, description?: string) => toast.warning(msg, { description }),
  info: (msg: string, description?: string) => toast.info(msg, { description }),
};
