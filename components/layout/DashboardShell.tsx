"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Users,
  LogOut,
  LayoutDashboard,
  Settings,
  UserCircle,
  CalendarDays,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/store/useUserStore";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail: string | undefined;
  companyName?: string;
  companyId?: string;
}

export const DashboardShell = ({
  children,
  userEmail,
  companyName,
}: DashboardShellProps) => {
  // Mobile overlay state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop push state (True = Expanded, False = Collapsed)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { fetchUser } = useUserStore();
  useEffect(() => {
    fetchUser(); // Si la donnée est déjà là, le store bloquera la requête de lui-même !
  }, [fetchUser]);
  const navigation = [
    {
      name: "Vue d'ensemble",
      href: "/",
      icon: LayoutDashboard,
      disabled: false,
    },
    { name: "Annuaire", href: "/directory", icon: Users, disabled: false },
    { name: "Congés", href: "/leaves", icon: CalendarDays, disabled: false },
    { name: "Paramètres", href: "#", icon: Settings, disabled: true },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const companyInitial = companyName
    ? companyName.charAt(0).toUpperCase()
    : "T";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR PRINCIPALE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 shadow-2xl overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          
          md:translate-x-0 ${isDesktopExpanded ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* We keep the fixed w-64 inner container so text doesn't crush during the animation */}
        <div className="flex flex-col h-full w-64">
          <div className="h-16 flex items-center px-6 bg-slate-950/50 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white shrink-0 shadow-lg shadow-brand-500/30">
              {companyInitial}
            </div>
            <span
              className={`ml-4 text-lg font-extrabold text-white transition-all duration-300 ease-out
                ${isDesktopExpanded || isMobileOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4"}
              `}
            >
              {companyName || "TeamFlow"}
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
            {navigation.map((item) => {
              // ✅ LA CORRECTION EST ICI :
              const isActive =
                item.href === "/"
                  ? pathname === "/" // Pour l'accueil, correspondance stricte
                  : pathname.startsWith(item.href) && item.href !== "#"; // Pour le reste, startsWith
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={!isDesktopExpanded ? item.name : undefined}
                  className={`flex items-center px-2 py-3 rounded-xl text-sm font-medium transition-colors group
                    ${
                      isActive
                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                        : item.disabled
                          ? "opacity-50 cursor-not-allowed hover:bg-slate-800/50"
                          : "hover:bg-slate-800 hover:text-white"
                    }
                  `}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault();
                    if (!item.disabled) setIsMobileOpen(false);
                  }}
                >
                  <item.icon
                    className={`w-6 h-6 shrink-0 ml-1 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                  />

                  <span
                    className={`ml-4 whitespace-nowrap transition-all duration-300 ease-out
                      ${isDesktopExpanded || isMobileOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4"}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-danger-500/10 hover:text-danger-500 transition-colors group"
            >
              <LogOut className="w-6 h-6 shrink-0 ml-1 group-hover:text-danger-500 transition-colors" />
              <span
                className={`ml-4 whitespace-nowrap transition-all duration-300 ease-out
                  ${isDesktopExpanded || isMobileOpen ? "opacity-100 translate-x-0 delay-100" : "opacity-0 -translate-x-4"}
                `}
              >
                Se déconnecter
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div
        className={`flex-1 flex flex-col min-w-0 
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
          ${isDesktopExpanded ? "md:ml-64" : "md:ml-20"}
        `}
      >
        {/* NAVBAR */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Toggle Button */}
            <button
              onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
              className="hidden md:flex p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title={isDesktopExpanded ? "Réduire le menu" : "Agrandir le menu"}
            >
              {isDesktopExpanded ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeft className="w-5 h-5" />
              )}
            </button>

            <h2 className="text-sm font-semibold text-slate-800 hidden sm:block">
              Espace Administration
            </h2>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 leading-none">
                {userEmail || "..."}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors">
              <UserCircle className="w-5 h-5" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
