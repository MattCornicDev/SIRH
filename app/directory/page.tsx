import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
// import { createClient } from '@/utils/supabase/server';
const getEmployees = async () => {
  const supabase = createClient();
  const { data } = await (await supabase)
    .from("employees")
    .select("*")
    .order("last_name", { ascending: true });
  // Données factices pour l'UI en attendant la connexion DB
  return data || [];
};

export default async function DirectoryPage(props: {
  user: object;
  profile: object;
}) {
  const employees = await getEmployees();

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header de la page */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Annuaire des employés
            </h1>
            <p className="text-slate-500 mt-1">
              Gérez les accès et les profils de votre équipe.
            </p>
          </div>
          <Link href={"/directory/new"}>
            <button className="px-4 py-2 bg-brand-500 text-white font-semibold rounded-lg shadow-sm hover:bg-brand-600 transition-colors flex items-center gap-2">
              + Ajouter un collaborateur
            </button>
          </Link>
        </div>

        {/* Tableau des employés */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Employé</th>
                <th className="px-6 py-4 font-semibold">Rôle & Département</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        {emp.first_name[0]}
                        {emp.last_name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {emp.first_name} {emp.last_name}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">
                      {emp.job_title}
                    </div>
                    <div className="text-slate-500">{emp.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    {emp.status === "actif" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-700">
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-700">
                        En pause
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-brand-600 font-medium text-sm transition-colors">
                      Éditer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {employees.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Aucun employé trouvé. Commencez par en ajouter un.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
