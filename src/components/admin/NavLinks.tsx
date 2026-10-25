"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Settings } from "lucide-react";

const links = [
  { href: "/admin", label: "Inscrições", icon: ClipboardList, match: (p: string) => p === "/admin" || p.startsWith("/admin/inscricoes") },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, match: (p: string) => p.startsWith("/admin/configuracoes") },
];

type Variant = "desktop" | "mobile";

/** Links sem destaque de página ativa (usado enquanto a URL não está disponível). */
export function NavLinksView({ pathname, variant }: { pathname: string; variant: Variant }) {
  return links.map(({ href, label, icon: Icon, match }) => {
    const active = match(pathname);
    const cls =
      variant === "desktop"
        ? `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
            active ? "bg-primary-container/15 text-white" : "text-on-surface-variant hover:text-white"
          }`
        : `flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
            active ? "bg-velocity text-white" : "bg-surface-container-high text-on-surface-variant"
          }`;
    return (
      <Link key={href} href={href} className={cls} aria-current={active ? "page" : undefined}>
        <Icon size={variant === "desktop" ? 16 : 14} className={active && variant === "desktop" ? "text-primary-container" : ""} />
        {label}
      </Link>
    );
  });
}

export function NavLinks({ variant }: { variant: Variant }) {
  return <NavLinksView pathname={usePathname()} variant={variant} />;
}
