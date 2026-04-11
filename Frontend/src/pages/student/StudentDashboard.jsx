import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSignIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import { formatCompactLKR, formatLKR, formatDate } from '../../utils/format';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';

export function StudentDashboard({ fees, onPayNow }) {
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidFees = fees
    .filter((fee) => fee.status === 'paid')
    .reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = fees
    .filter((fee) => fee.status === 'pending')
    .reduce((sum, fee) => sum + fee.amount, 0);
  const overdueFees = fees
    .filter((fee) => fee.status === 'overdue')
    .reduce((sum, fee) => sum + fee.amount, 0);
  const payableFeesCount = fees.filter((fee) => fee.status === 'overdue').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#0f172a,_#1e293b)] px-6 py-7 text-white shadow-soft">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Student Payments
        </p>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Keep your fee status clean and pay outstanding balances on time.
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              {payableFeesCount > 0
                ? `${payableFeesCount} fee${payableFeesCount > 1 ? 's are' : ' is'} ready for payment right now.`
                : 'No overdue fees right now. You are caught up.'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur">
            <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
              Outstanding Now
            </span>
            <span className="mt-1 block text-2xl font-semibold text-white">
              {formatLKR(overdueFees)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Fees"
          value={formatCompactLKR(totalFees)}
          caption={formatLKR(totalFees)}
          icon={DollarSignIcon}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Paid"
          value={formatCompactLKR(paidFees)}
          caption={formatLKR(paidFees)}
          icon={CheckCircleIcon}
          colorClass="bg-emerald-100 text-emerald-600"
        />
        <StatsCard
          title="Pending Approval"
          value={formatCompactLKR(pendingFees)}
          caption={formatLKR(pendingFees)}
          icon={ClockIcon}
          colorClass="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Overdue"
          value={formatCompactLKR(overdueFees)}
          caption={formatLKR(overdueFees)}
          icon={AlertCircleIcon}
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-900">My Fees</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="flex flex-col justify-between gap-4 p-6 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {fee.title}
                  </h3>
                  <Badge status={fee.status} />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>Due: {formatDate(fee.dueDate)}</span>
                  <span className="hidden sm:inline">&middot;</span>
                  <span className="font-medium text-slate-700">
                    {formatLKR(fee.amount)}
                  </span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => onPayNow(fee.id)}
                  disabled={fee.status === 'paid' || fee.status === 'pending'}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-all sm:w-auto ${
                    fee.status === 'paid' || fee.status === 'pending'
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow'
                  }`}
                >
                  {fee.status === 'paid'
                    ? 'Paid'
                    : fee.status === 'pending'
                      ? 'Processing'
                      : 'Pay Now'}
                </button>
              </div>
            </div>
          ))}

          {fees.length === 0 && (
            <div className="p-8 text-center text-slate-500">No fees found.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
