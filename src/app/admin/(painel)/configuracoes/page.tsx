import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/registrations";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { PageSkeleton, PageTitle } from "@/components/admin/ui";

export default function SettingsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  await requireAdmin();
  const s = await getSettings();
  return (
    <>
      <PageTitle eyebrow="Evento" title="Configurações" />
      <SettingsForm
        pixKey={s.pixKey}
        pixHolder={s.pixHolder}
        whatsapp={s.whatsapp}
        feeCents={s.feeCents}
        maxRegistrations={s.maxRegistrations}
        registrationsOpen={s.registrationsOpen}
      />
    </>
  );
}
