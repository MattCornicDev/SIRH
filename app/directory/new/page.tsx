"use client";
import { useRouter } from "next/navigation";
import { EmployeeForm } from "@components/directory/employeeForm";

export default function NewEmployeePage() {
  const router = useRouter();

  return (
    <div className="bg-slate-50 p-8 font-sans min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 inline-flex items-center gap-2"
          >
            &larr; Retour à l&apos;annuaire
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Nouvel Employé
          </h1>
          <p className="text-slate-500 mt-1">
            Créez le dossier d&apos;un nouveau collaborateur.
          </p>
        </div>

        <EmployeeForm />
      </div>
    </div>
  );
}
