import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardShell } from "../components/layout/DashboardShell";
import { createClient } from "@/utils/supabase/client";
import StoreInitializer from "../components/storeInitializer";
import { EmployeeProfile } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO SEO Changes here
export const metadata: Metadata = {
  title: "TeamFlow - SaaS RH",
  description: "Gérez vos équipes simplement",
};
const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();
// if (!user) redirect("/login");

const { data: profiles } = await supabase
  .from("employees")
  .select("*, companies(name)")
  .eq("user_id", user?.id);

const activeProfile: EmployeeProfile =
  profiles && profiles.length > 0 ? profiles[0] : null;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // <-- LE BOUCLIER ANTI-EXTENSION ICI
    >
      <body
        className="min-h-full flex flex-col"
        suppressHydrationWarning // <-- ET ICI
      >
        {user && <StoreInitializer user={user} activeProfile={activeProfile} />}
        <DashboardShell
          userEmail={user?.email}
          companyName={activeProfile?.companies?.name || "TeamFlow"}
        >
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}
