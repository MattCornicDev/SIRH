import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardShell } from "@components/layout/DashboardShell";
import StoreInitializer from "@components/storeInitializer"; // <-- LE PONT

export default async function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profiles } = await supabase
    .from("employees")
    .select("*, companies(name)")
    .eq("user_id", user.id);

  const activeProfile = profiles && profiles.length > 0 ? profiles[0] : null;

  return (
    <>
      {/* Le pont charge les données dans Zustand silencieusement */}
      <StoreInitializer user={user} activeProfile={activeProfile} />

      <DashboardShell
        userEmail={user.email}
        companyName={activeProfile?.companies?.name || "TeamFlow"}
      >
        {children}
      </DashboardShell>
    </>
  );
}
