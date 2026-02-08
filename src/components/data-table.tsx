import React from 'react';
import { cn } from "@/lib/utils";

interface DataTableProps {
  title?: string;
  columns: string[];
  rows: (string | number | boolean | null)[][];
  className?: string;
}

export function DataTable({ title, columns, rows, className }: DataTableProps) {
  if (!rows || rows.length === 0 || !columns || columns.length === 0) {
    return (
      <div className={cn("p-4 border rounded-md bg-gray-50 text-gray-500 text-center", className)}>
        No data available
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden border rounded-lg shadow-sm bg-white my-4", className)}>
      {title && (
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((header, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[colIndex] === null ? "" : String(row[colIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
        Showing {rows.length} records
      </div>
    </div>
  );
}
