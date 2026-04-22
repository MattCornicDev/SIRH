"use client";

import { useEffect, useState } from "react";
import { LeaveRequestWithEmployee } from "@/types";
import { useLeaveStore } from "@/store/useLeaveStore";
import { clsx } from "clsx";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type LeaveStatus = "en_attente" | "approuve" | "refuse";

export default function LeavesHistoryPage() {
  // 1. Récupération des données et fonctions depuis notre store Zustand
  const { requests, isLoading, fetchRequests, lastFetched } = useLeaveStore();
  const [isCooldown, setIsCooldown] = useState(false);

  // 2. Chargement initial au montage du composant (sera ignoré par le store si déjà en cache)
  useEffect(() => {
    fetchRequests(false);
  }, [fetchRequests]);

  // 3. Gestion du clic sur le bouton Actualiser avec blocage anti-spam
  const handleRefresh = async () => {
    const now = Date.now();
    const ONE_MINUTE = 60 * 1000;

    if (lastFetched && now - lastFetched < ONE_MINUTE) {
      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 2000); // Retire l'état d'erreur visuel après 2s
      fetchRequests(true); // Appelle le store pour déclencher l'alerte des secondes restantes
      return;
    }

    await fetchRequests(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* 1. En-tête de la page d'Audit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Registre des Absences
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Historique complet et immuable des congés de l&apos;entreprise.
          </p>
        </div>

        {/* Boutons d'export ou d'action globale */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
            <CalendarDays className="w-4 h-4" />
            Année 2026
          </button>

          {/* Bouton de rafraîchissement lié au Store */}
          <button
            onClick={handleRefresh}
            className={clsx(
              "px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm",
              isCooldown
                ? "bg-danger-50 border-danger-100 text-danger-600 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
            )}
          >
            <RefreshCw
              className={clsx("w-4 h-4", isLoading && "animate-spin")}
            />
            {isCooldown ? "Trop rapide !" : "Actualiser"}
          </button>
        </div>
      </div>

      {/* 2. Barre d'outils (Filtres et Recherche) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un collaborateur..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            disabled // Désactivé pour le moment, le rendu est juste visuel
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Tous les statuts
          </button>
          <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
            Type de congé
          </button>
        </div>
      </div>

      {/* 3. Le Registre (Lecture seule pure via le Store) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden relative">
        {/* Overlay visuel très léger pendant le chargement du Store */}
        {isLoading && requests.length > 0 && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 transition-all" />
        )}

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Date de la demande</th>
              <th className="px-6 py-4 font-semibold">Collaborateur</th>
              <th className="px-6 py-4 font-semibold">Type & Période</th>
              <th className="px-6 py-4 font-semibold text-right">
                Statut final
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* On map directement les données en cache dans Zustand */}
            {requests.map((req) => {
              const start = new Date(req.start_date);
              const end = new Date(req.end_date);
              // Fallback au cas où created_at est undefined
              const created = req.created_at
                ? new Date(req.created_at)
                : new Date();
              const totalDays =
                Math.round(
                  (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
                ) + 1;

              return (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Date de création de la demande */}
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {created.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Employé */}
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {req.employee?.first_name} {req.employee?.last_name}
                  </td>

                  {/* Détails du congé */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">
                      {req.leave_type}{" "}
                      <span className="text-slate-400 font-normal">
                        ({totalDays} jours)
                      </span>
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Du {start.toLocaleDateString("fr-FR")} au{" "}
                      {end.toLocaleDateString("fr-FR")}
                    </div>
                  </td>

                  {/* Statut */}
                  <td className="px-6 py-4 text-right">
                    <StatusBadge status={req.status as LeaveStatus} />
                  </td>
                </tr>
              );
            })}

            {!isLoading && requests.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Aucun historique disponible pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  if (status === "approuve") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        <CheckCircle className="w-3.5 h-3.5" /> Approuvé
      </span>
    );
  }
  if (status === "refuse") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-danger-50 text-danger-700 border border-danger-100">
        <XCircle className="w-3.5 h-3.5" /> Refusé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <Clock className="w-3.5 h-3.5" /> En attente
    </span>
  );
}
