import { createClient } from "@/utils/supabase/server";
import { Pagination } from "@/components/directory/pagination";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

export async function EmployeeTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const supabase = await createClient();

  // 1. 🛡️ IDENTIFICATION : On récupère l'utilisateur actuellement connecté
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return <div className="p-4 text-danger-500">Vous devez être connecté.</div>;
  }

  // 2. 🏢 CONTEXTE : On cherche à quelle entreprise appartient cet utilisateur
  const { data: currentUserProfile } = await supabase
    .from("employees")
    .select("company_id")
    .eq("user_id", user.id)
    .single();

  if (!currentUserProfile?.company_id) {
    return (
      <div className="p-4 text-danger-500">
        Aucune entreprise associée à ce profil.
      </div>
    );
  }

  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 3. 🔒 LE FILTRE : On ajoute .eq("company_id", ...) à la requête !
  let dbQuery = supabase
    .from("employees")
    .select("*", { count: "exact" })
    .eq("company_id", currentUserProfile.company_id) // LA SÉCURITÉ EST ICI !
    .order("last_name", { ascending: true })
    .range(from, to);

  if (query) {
    dbQuery = dbQuery.or(
      `first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,job_title.ilike.%${query}%`,
    );
  }

  const { data: employees, count, error } = await dbQuery;

  if (error) {
    console.error("Erreur Supabase:", error);
    return (
      <div className="p-4 text-danger-500 bg-white rounded-xl">
        Erreur de chargement.
      </div>
    );
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-semibold">Employé</th>
              <th className="px-6 py-4 font-semibold">Rôle & Département</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees?.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold shrink-0">
                      {emp.first_name?.[0]}
                      {emp.last_name?.[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {emp.first_name} {emp.last_name}
                      </div>
                      <div className="text-slate-500 text-xs">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900 font-medium">
                    {emp.job_title || "Non défini"}
                  </div>
                  <div className="text-slate-500">{emp.department || "-"}</div>
                </td>
                <td className="px-6 py-4">
                  {emp.status === "actif" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Actif
                    </span>
                  ) : emp.status === "en_pause" ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      En pause
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                      Inactif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/directory/${emp.id}/edit`}>
                    <button className="text-slate-400 hover:text-brand-600 font-medium text-sm transition-colors">
                      Éditer
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees?.length === 0 && (
        <div className="p-12 text-center text-slate-500">
          {query ? `Aucun résultat pour "${query}"` : "Aucun employé trouvé."}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}
