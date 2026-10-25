import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin • 1ª Corrida com Bom Jesus",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-surface text-on-surface">{children}</div>;
}
