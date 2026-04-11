import React from 'react';

export function Badge({ status, className = '' }) {
  const getStyles = () => {
    switch (status) {
      case 'paid':
      case 'approved':
        return 'border-emerald-200 bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'border-amber-200 bg-amber-100 text-amber-700';
      case 'overdue':
      case 'rejected':
        return 'border-red-200 bg-red-100 text-red-700';
      default:
        return 'border-slate-200 bg-slate-100 text-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStyles()} ${className}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
