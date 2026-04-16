import Link from "next/link";
import { Suspense } from "react";
import { SearchFilter } from "@components/directory/searchFilter";
import { EmployeeTable } from "@components/directory/employeeTable";
import { TableSkeleton } from "@components/directory/tableSkeleton";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="bg-slate-50 p-8 font-sans min-h-full">
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

        {/* Toolbar: Search */}
        <div className="flex items-center justify-between">
          <SearchFilter />
        </div>

        {/* 🪄 LA MAGIE EST ICI : Le Suspense avec la Key dynamique */}
        <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
          <EmployeeTable query={query} currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
