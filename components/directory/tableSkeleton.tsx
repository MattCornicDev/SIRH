export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </th>
              <th className="px-6 py-4 flex justify-end">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse shrink-0"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 w-48 bg-slate-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                </td>
                <td className="px-6 py-4 flex justify-end">
                  <div className="h-4 w-12 bg-slate-200 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
