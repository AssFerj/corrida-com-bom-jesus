import { LogoMark } from "@/components/ui";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="halftone pointer-events-none absolute -left-10 bottom-0 h-80 w-80 text-primary opacity-10 [mask-image:radial-gradient(circle_at_bottom_left,black,transparent_70%)]" />
      <div className="bg-velocity pointer-events-none absolute -right-24 top-16 h-6 w-80 rotate-[-25deg] opacity-70 shadow-[0_0_30px_rgba(255,87,8,0.6)]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/5 bg-surface-container p-6 shadow-2xl sm:p-10">
        <span className="bg-velocity absolute inset-x-0 top-0 h-1" />
        <div className="mb-6 flex items-center gap-3">
          <LogoMark className="h-11 w-11" />
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-container">Área restrita</span>
            <h1 className="font-display text-2xl font-bold uppercase leading-tight text-white">Painel de Inscrições</h1>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
