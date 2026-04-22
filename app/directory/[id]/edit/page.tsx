// 1. Ajoutez l'import de Link tout en haut
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/directory/employeeForm";
import { Employee } from "@/types";

export default async function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: employee } = (await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single()) as { data: Employee | null };

  if (!employee) notFound();

  return (
    <div className="bg-slate-50 p-8 font-sans min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* L'en-tête avec le lien de retour ! */}
        <div>
          <Link
            href="/directory"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-2"
          >
            &larr; Retour à l&apos;annuaire
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Modifier le profil
          </h1>
          <p className="text-slate-500 mt-1">
            Mise à jour des informations de {employee.first_name}{" "}
            {employee.last_name}
          </p>
        </div>

        {/* Le formulaire */}
        <EmployeeForm initialData={employee} isEditing={true} />
      </div>
    </div>
  );
}
