"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useLeaveStore } from "@/store/useLeaveStore";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export function LeaveApprovals() {
  // 1. On récupère les données et fonctions du store global
  const { requests, isLoading, fetchRequests } = useLeaveStore();
  const supabase = createClient();

  // 2. Le composant demande les données au montage (le store gère le cache)
  useEffect(() => {
    fetchRequests(false);
  }, [fetchRequests]);

  // 3. On filtre UNIQUEMENT les demandes en attente pour ce composant
  const pendingRequests = requests.filter((req) => req.status === "en_attente");

  // 4. Fonction pour Approuver ou Refuser
  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    const { error } = await supabase
      .from("time_off_requests")
      .update({ status: newStatus })
      .eq("id", requestId);

    if (!error) {
      // 5. Magie du Store : On force le rafraîchissement global !
      // Cela mettra à jour ce composant ET la page d'historique en même temps.
      await fetchRequests(true);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  // Affichage du chargement seulement s'il n'y a rien en cache
  if (isLoading && requests.length === 0)
    return <div className="p-4">Chargement des demandes...</div>;

  if (!isLoading && pendingRequests.length === 0)
    return (
      <div className="p-4 text-slate-500">Aucune demande en attente 🎉</div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-2">
        <Clock className="w-5 h-5 text-brand-500" />
        <h2 className="text-lg font-semibold text-slate-800">
          Demandes en attente
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {/* ATTENTION : On boucle bien sur pendingRequests, pas sur requests */}
        {pendingRequests.map((req) => (
          <div
            key={req.id}
            className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            {/* Infos de la demande */}
            <div>
              <p className="font-medium text-slate-900">
                {req.employee?.first_name} {req.employee?.last_name}
              </p>
              <p className="text-sm text-slate-500">
                {req.leave_type} • Du{" "}
                {new Date(req.start_date).toLocaleDateString("fr-FR")} au{" "}
                {new Date(req.end_date).toLocaleDateString("fr-FR")}
              </p>
            </div>

            {/* Actions (Approuver / Refuser) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateStatus(req.id, "refuse")}
                className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <XCircle className="w-5 h-5" /> Refuser
              </button>
              <button
                onClick={() => handleUpdateStatus(req.id, "approuve")}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <CheckCircle className="w-5 h-5" /> Approuver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
