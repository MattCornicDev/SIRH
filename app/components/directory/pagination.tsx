"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-900">{currentPage}</span>{" "}
        of <span className="font-medium text-slate-900">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => replace(createPageURL(currentPage - 1))}
          disabled={currentPage <= 1}
          className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => replace(createPageURL(currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
