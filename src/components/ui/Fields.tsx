import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff, Search, ChevronDown, Calendar, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── FieldWrapper ────────────────────────────────────────────── */
interface FieldBase {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

function Wrapper({
  label,
  hint,
  error,
  required,
  children,
  id,
}: FieldBase & { children: ReactNode; id?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-graphite">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <p
          className={cn(
            "mt-1.5 text-[11px]",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full min-h-12 rounded-2xl border border-input bg-surface-elevated px-4 text-[15px] text-foreground placeholder:text-muted-foreground " +
  "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

/* ── TextField ───────────────────────────────────────────────── */
type TextFieldProps = FieldBase &
  InputHTMLAttributes<HTMLInputElement> & { leftIcon?: ReactNode; rightIcon?: ReactNode };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, error, required, leftIcon, rightIcon, className, id, ...rest }, ref) => {
    const autoId = id ?? rest.name;
    return (
      <Wrapper label={label} hint={hint} error={error} required={required} id={autoId}>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </span>
          )}
          <input
            id={autoId}
            ref={ref}
            {...rest}
            className={cn(
              inputCls,
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-destructive focus-visible:ring-destructive",
              className,
            )}
          />
          {rightIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>
      </Wrapper>
    );
  },
);
TextField.displayName = "TextField";

/* ── SearchField ─────────────────────────────────────────────── */
export function SearchField({
  value,
  onChange,
  placeholder = "Buscar...",
  onClear,
  className,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        role="searchbox"
        aria-label="Buscar"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, "pl-11", value ? "pr-11" : "")}
      />
      {value && (
        <button
          aria-label="Limpar busca"
          onClick={() => {
            onChange?.("");
            onClear?.();
          }}
          className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── PasswordField ───────────────────────────────────────────── */
export function PasswordField(props: Omit<TextFieldProps, "type" | "rightIcon">) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      {...props}
      type={show ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          className="pointer-events-auto"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
}

/* ── Textarea ────────────────────────────────────────────────── */
type TAProps = FieldBase & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TAProps>(
  ({ label, hint, error, required, className, id, ...rest }, ref) => (
    <Wrapper label={label} hint={hint} error={error} required={required} id={id}>
      <textarea
        ref={ref}
        id={id}
        {...rest}
        className={cn(
          inputCls,
          "min-h-[112px] py-3 resize-y",
          error && "border-destructive",
          className,
        )}
      />
    </Wrapper>
  ),
);
Textarea.displayName = "Textarea";

/* ── Dropdown (single-select nativo estilizado) ──────────────── */
export function Dropdown({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options,
  placeholder = "Selecione...",
}: FieldBase & {
  value?: string;
  onChange?: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <Wrapper label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(inputCls, "appearance-none pr-11")}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </Wrapper>
  );
}

/* ── MultiSelect (chips) ─────────────────────────────────────── */
export function MultiSelect({
  label,
  hint,
  error,
  values = [],
  onChange,
  options,
}: FieldBase & {
  values?: string[];
  onChange?: (v: string[]) => void;
  options: { value: string; label: string }[];
}) {
  const toggle = (v: string) =>
    onChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <Wrapper label={label} hint={hint} error={error}>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                on
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-hairline bg-surface-elevated text-graphite hover:bg-muted",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Wrapper>
  );
}

/* ── DatePicker (input date estilizado) ──────────────────────── */
export function DatePicker(props: Omit<TextFieldProps, "type" | "leftIcon">) {
  return <TextField {...props} type="date" leftIcon={<Calendar className="size-4" />} />;
}

/* ── UploadField ─────────────────────────────────────────────── */
export function UploadField({
  label,
  hint,
  error,
  accept,
  multiple,
  onFiles,
}: FieldBase & {
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: FileList) => void;
}) {
  return (
    <Wrapper label={label} hint={hint} error={error}>
      <label
        className={cn(
          "flex min-h-[128px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-hairline bg-surface-elevated p-6 text-center transition-colors hover:border-brand hover:bg-brand-soft/40",
          error && "border-destructive",
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand">
          <Upload className="size-5" />
        </span>
        <span className="text-sm font-medium text-graphite">
          Arraste ou clique para enviar
        </span>
        <span className="text-[11px] text-muted-foreground">
          Formatos aceitos: {accept ?? "PDF, DOCX, JPG, PNG"}
        </span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => e.target.files && onFiles?.(e.target.files)}
        />
      </label>
    </Wrapper>
  );
}
