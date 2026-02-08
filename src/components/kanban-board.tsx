// src/components/kanban-board.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface KanbanCard {
  id: string | number;
  title: string;
  tag?: string;
  description?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanCard[];
  color?: string; // e.g., "bg-blue-500"
}

interface KanbanBoardProps {
  title?: string;
  columns: KanbanColumn[];
  className?: string;
}

export function KanbanBoard({ title, columns, className }: KanbanBoardProps) {
  const safeColumns = Array.isArray(columns) ? columns : [];

  return (
    <div className={cn("w-full overflow-x-auto my-6", className)}>
      {title && <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">{title}</h2>}
      <div className="flex gap-4 min-w-max pb-4">
        {safeColumns.map((col) => {
          const items = Array.isArray(col.items) ? col.items : [];
          return (
            <div key={col.id} className="w-72 flex-shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-200/60">
              <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-semibold text-gray-700 text-sm">{col.title}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full">{items.length}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default">
                      {item.tag && (
                          <div className="mb-2">
                               <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.tag}</span>
                          </div>
                      )}
                    <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1">{item.title}</h4>
                    {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
                  </div>
                ))}
                {items.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xs">
                        Empty
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
