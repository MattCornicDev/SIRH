import { EmployeeTable } from "@/components/directory/employeeTable";
import { LeaveApprovals } from "@/components/leaves/leaveApprovals";
import { Users, Calendar, Briefcase } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      {/* 1. En-tête avec quelques statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Employés"
          value="24"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Absents aujourd'hui"
          value="3"
          icon={Calendar}
          color="text-orange-600"
        />
        <StatCard
          title="Nouveaux ce mois"
          value="2"
          icon={Briefcase}
          color="text-emerald-600"
        />
      </div>

      {/* 2. La grille principale : Approbations + Annuaire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Colonne de gauche (Plus large) : Votre Annuaire actuel */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Annuaire de l&apos;équipe
          </h2>
          <EmployeeTable query="" currentPage={1} />
        </div>

        {/* Colonne de droite (Plus étroite) : Les demandes de congés */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Gestion des flux</h2>
          <LeaveApprovals />

          {/* Vous pourrez ajouter ici plus tard un bloc "Anniversaires" ou "Fin de contrats" */}
          <div className="p-6 bg-brand-50 border border-brand-100 rounded-xl">
            <p className="text-sm text-brand-800 font-medium">💡 Astuce RH</p>
            <p className="text-xs text-brand-600 mt-1">
              Pensez à valider les demandes de congés avant vendredi pour
              faciliter la paie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Petit composant utilitaire pour les cartes du haut
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className: string }>;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-slate-50 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
