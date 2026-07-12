import { useState, type ReactNode } from "react";
import { Check, ChevronDown, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/Indicators";

export type TimelineState = "done" | "current" | "pending" | "late";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  responsible?: string;
  percent?: number;
  state: TimelineState;
  icon?: ReactNode;
}

/**
 * Timeline vertical com expandir/recolher por item.
 * Suporta estados: done, current, pending, late.
 */
export function Timeline({
  items,
  defaultExpandedId,
  className,
}: {
  items: TimelineItem[];
  defaultExpandedId?: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(
    defaultExpandedId ?? items.find((i) => i.state === "current")?.id ?? null,
  );

  return (
    <ol className={cn("relative", className)}>
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        const open = openId === it.id;
        const dot = {
          done: "bg-leaf text-white",
          current: "bg-brand text-white ring-4 ring-brand/15",
          pending: "bg-transparent border-2 border-hairline text-muted-foreground",
          late: "bg-destructive/10 text-destructive border-2 border-destructive/30",
        }[it.state];
        const line = {
          done: "bg-leaf/70",
          current: "bg-gradient-to-b from-brand to-hairline",
          pending: "bg-hairline",
          late: "bg-destructive/40",
        }[it.state];

        return (
          <li key={it.id} className="relative pl-11 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[13px] top-8 bottom-0 w-[2px] rounded-full",
                  line,
                )}
              />
            )}
            <span
              className={cn(
                "absolute left-0 top-0 grid size-7 place-items-center rounded-full transition-all",
                dot,
              )}
            >
              {it.state === "done" && <Check className="size-3.5" />}
              {it.state === "current" && (
                <span className="size-2 rounded-full bg-white animate-pulse" />
              )}
              {it.state === "late" && <TriangleAlert className="size-3.5" />}
            </span>

            <button
              onClick={() => setOpenId(open ? null : it.id)}
              aria-expanded={open}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {it.title}
                  </p>
                  {it.date && (
                    <p className="text-xs text-muted-foreground mt-0.5">{it.date}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {it.state === "current" && it.percent != null && (
                    <span className="text-xs font-semibold text-brand tabular-nums">
                      {it.percent}%
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </div>
              </div>
              {it.state === "current" && it.percent != null && (
                <ProgressBar value={it.percent} className="mt-2.5" />
              )}
            </button>

            <div
              className={cn(
                "grid transition-all duration-200",
                open ? "grid-rows-[1fr] mt-2.5 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl bg-muted/60 p-3 text-xs text-foreground/80">
                  {it.description && <p>{it.description}</p>}
                  {it.responsible && (
                    <p className="mt-1.5 text-muted-foreground">
                      Responsável: <span className="font-medium text-graphite">{it.responsible}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
