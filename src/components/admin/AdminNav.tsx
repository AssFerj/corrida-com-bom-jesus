import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { LogoMark } from "@/components/ui";
import { NavLinks, NavLinksView } from "./NavLinks";

export function AdminNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <LogoMark className="h-8 w-8 shrink-0" />
          <span className="truncate font-display text-lg font-medium uppercase tracking-wider text-white">
            Admin <span className="hidden text-on-surface-variant sm:inline">• Corrida Bom Jesus</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Suspense fallback={<NavLinksView pathname="" variant="desktop" />}>
            <NavLinks variant="desktop" />
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-white sm:flex"
          >
            <ExternalLink size={14} /> Ver site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full border border-surface-bright bg-surface-container-high px-3 py-2 text-xs font-semibold uppercase tracking-wider text-on-surface transition-colors hover:border-primary-container"
            >
              <LogOut size={14} /> Sair
            </button>
          </form>
        </div>
      </div>

      {/* Navegação no celular */}
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden [scrollbar-width:none]">
        <Suspense fallback={<NavLinksView pathname="" variant="mobile" />}>
          <NavLinks variant="mobile" />
        </Suspense>
      </nav>
    </header>
  );
}
