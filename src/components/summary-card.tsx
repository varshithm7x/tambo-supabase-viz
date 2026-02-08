// src/components/summary-card.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: string;
  className?: string;
}

export function SummaryCard({ title, value, trend, trendLabel, className }: SummaryCardProps) {
  return (
    <div className={cn("p-6 bg-white rounded-xl border border-gray-100 shadow-sm", className)}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center mt-4 gap-2">
            {trend !== undefined && (
                <span className={cn(
                    "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                    trend > 0 ? "bg-green-50 text-green-700" : trend < 0 ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"
                )}>
                    {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : trend < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                    {trend > 0 ? "+" : ""}{trend}%
                </span>
            )}
            {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
