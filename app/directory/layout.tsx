import { createClient } from "@/utils/supabase/server";
import DirectoryPage from "./page";
import { redirect } from "next/navigation";

export default async function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. On récupère la réponse brute pour comprendre
  const authResponse = await supabase.auth.getUser();

  const user = authResponse.data.user;

  if (authResponse.error || !user) {
    console.log("Redirection vers /login !");
    redirect("/login");
  }

  // Récupérer le profil de l'employé ET les infos de sa boite en une seule fois
  const { data: profile } = await supabase
    .from("employees")
    .select("*, companies(name)")
    .eq("user_id", user.id)
    .single();

  return (
    <DirectoryPage
      userEmail={user.email}
      companyName={profile?.companies?.name}
      companyId={profile?.company_id} // Crucial pour les formulaires enfants
    >
      {children}
    </DirectoryPage>
  );
}
