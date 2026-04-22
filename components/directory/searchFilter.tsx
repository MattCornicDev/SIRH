"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("query")?.toString() || "",
  );

  useEffect(() => {
    // 🛡️ LE BOUCLIER EST ICI :
    // On regarde ce qui est ACTUELLEMENT dans l'URL
    const currentQuery = searchParams.get("query") || "";

    // Si ce qu'on a tapé est identique à l'URL, on annule tout !
    if (searchTerm === currentQuery) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // On clone les paramètres actuels proprement
      const params = new URLSearchParams(searchParams.toString());

      // On remet à la page 1 lors d'une nouvelle recherche
      params.set("page", "1");

      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }

      replace(`${pathname}?${params.toString()}`);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, replace, searchParams]); // Les dépendances restent correctes

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
        placeholder="Rechercher un nom, un rôle..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
