import React from 'react';

export function DataTable({
  columns,
  data,
  keyExtractor,
  renderMobileCard,
  emptyMessage = 'No data available',
}) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
      <div className={`overflow-x-auto ${renderMobileCard ? 'hidden md:block' : 'block'}`}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="transition-colors hover:bg-slate-50/50"
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`whitespace-nowrap px-6 py-4 text-sm text-slate-700 ${column.className || ''}`}
                  >
                    {column.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderMobileCard && (
        <div className="divide-y divide-slate-100 md:hidden">
          {data.map((row) => (
            <div key={keyExtractor(row)} className="p-4">
              {renderMobileCard(row)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
