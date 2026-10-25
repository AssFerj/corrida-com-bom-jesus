import { AdminNav } from "@/components/admin/AdminNav";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </>
  );
}
