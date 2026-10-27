import type { Metadata, Viewport } from "next";
import { Oswald, Space_Grotesk } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "1ª Corrida com Bom Jesus dos Navegantes • 15/11/2026",
  description:
    "Uma manhã de fé, superação e esporte em celebração aos festejos de Bom Jesus dos Navegantes. Percurso de 3km com medalha para todos que concluírem. Inscrição: R$ 10,00 + 1kg de alimento.",
  openGraph: {
    title: "1ª Corrida com Bom Jesus dos Navegantes",
    description: "Supere seus limites! 15/11/2026 • Largada às 06:00 • Percurso de 3km.",
    images: ["/images/atleta.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#131315",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: extensões do navegador (ex.: Scribe) adicionam atributos no <html>
    <html lang="pt-BR" className={`${oswald.variable} ${spaceGrotesk.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
