import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav, DesktopSidebar } from "@/components/navigation/AppNavigation";

interface AppLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  hideBottomNav?: boolean;
  hideSidebar?: boolean;
  fullBleed?: boolean; // remove padding lateral para telas imersivas (360)
  contentClassName?: string;
}

/**
 * Layout base do aplicativo.
 * - Mobile: coluna única com bottom nav.
 * - Desktop (md+): sidebar lateral fixa + conteúdo com largura máxima.
 */
export function AppLayout({
  children,
  header,
  hideBottomNav,
  hideSidebar,
  fullBleed,
  contentClassName,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideSidebar && <DesktopSidebar />}

      <div className={cn("flex min-h-screen flex-col", !hideSidebar && "md:pl-64")}>
        {header}

        <main
          className={cn(
            "flex-1 animate-in fade-in duration-300",
            !fullBleed && "px-5 md:px-8",
            !hideBottomNav && "pb-24 md:pb-8",
            contentClassName,
          )}
          style={{ paddingBottom: hideBottomNav ? undefined : "calc(6rem + env(safe-area-inset-bottom))" }}
        >
          <div className={cn(!fullBleed && "mx-auto w-full max-w-3xl")}>{children}</div>
        </main>
      </div>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
