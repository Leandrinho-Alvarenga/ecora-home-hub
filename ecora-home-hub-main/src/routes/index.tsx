import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredAuthUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionUser = getStoredAuthUser();

    if (sessionUser) {
      throw redirect({ to: "/dashboard" });
    }

    throw redirect({ to: "/login" });
  },
});
