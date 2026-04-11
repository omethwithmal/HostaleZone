import React from 'react';

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  caption,
  colorClass = 'bg-blue-100 text-blue-600',
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            {title}
          </p>
          <h3 className="break-words text-[clamp(1.7rem,2.4vw,2.6rem)] font-bold leading-tight text-slate-900">
            {value}
          </h3>
          {caption && (
            <p className="mt-2 text-sm text-slate-500">{caption}</p>
          )}
        </div>
        <div className={`shrink-0 rounded-2xl p-4 ${colorClass}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span
            className={`font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : '-'}
            {trend.value}
          </span>
          <span className="ml-2 text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}
