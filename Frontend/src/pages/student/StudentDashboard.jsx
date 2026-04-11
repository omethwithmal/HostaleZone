import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSignIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ArrowRightIcon
} from 'lucide-react';
import { formatCompactLKR, formatLKR, formatDate } from '../../utils/format';

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
  const payableFeesCount = fees.filter((fee) => fee.status === 'overdue' || fee.status === 'unpaid').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'overdue': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* ── TOP HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-[32px] border-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 px-8 py-10 text-white shadow-2xl">
        {/* Animated Background Blurs */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md border border-white/10">
                <CreditCardIcon className="h-3.5 w-3.5" />
                Student Payments
              </span>
            </motion.div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              Manage your hostel fees seamlessly.
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed font-medium">
              {payableFeesCount > 0
                ? `You have ${payableFeesCount} outstanding fee${payableFeesCount > 1 ? 's' : ''} ready to be processed.`
                : "You are all caught up! No overdue fees right now."}
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl shadow-inner min-w-[200px]"
          >
            <span className="block text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <AlertCircleIcon className="h-3 w-3" />
              Outstanding Now
            </span>
            <span className="mt-2 block text-3xl font-black text-white tracking-tight">
              {formatLKR(overdueFees)}
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Total Fees', val: formatCompactLKR(totalFees), sub: formatLKR(totalFees), icon: DollarSignIcon, colors: 'from-blue-500/20 to-blue-600/5 text-blue-600', iconBg: 'bg-blue-600 text-white shadow-blue-500/30' },
          { title: 'Total Paid', val: formatCompactLKR(paidFees), sub: formatLKR(paidFees), icon: CheckCircleIcon, colors: 'from-emerald-500/20 to-emerald-600/5 text-emerald-600', iconBg: 'bg-emerald-500 text-white shadow-emerald-500/30' },
          { title: 'Pending Approval', val: formatCompactLKR(pendingFees), sub: formatLKR(pendingFees), icon: ClockIcon, colors: 'from-amber-500/20 to-amber-600/5 text-amber-600', iconBg: 'bg-amber-500 text-white shadow-amber-500/30' },
          { title: 'Overdue Amount', val: formatCompactLKR(overdueFees), sub: formatLKR(overdueFees), icon: AlertCircleIcon, colors: 'from-red-500/20 to-red-600/5 text-red-600', iconBg: 'bg-red-500 text-white shadow-red-500/30' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i + 0.2 }}
            className={`relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-gradient-to-br ${stat.colors} p-6 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm bg-white/80`}
          >
            <div className="flex items-start justify-between">
              <div className="z-10 relative">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-black tracking-tight text-slate-800">
                  {stat.val}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">{stat.sub}</p>
              </div>
              <div className={`shrink-0 rounded-2xl p-3 shadow-lg ${stat.iconBg} relative z-10`}>
                <stat.icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── MY FEES SECTION ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-8 py-6">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
            Current Fee Breakdown
          </h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {fees.length} Records
          </span>
        </div>

        <div className="divide-y divide-slate-100/60 p-4">
          {fees.map((fee, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx + 0.3 }}
              key={fee.id}
              className="group relative flex flex-col justify-between gap-4 rounded-xl p-5 transition-all duration-300 ease-out hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 sm:flex-row sm:items-center hover:-translate-y-1 mb-2 border border-transparent hover:border-slate-100 overflow-hidden"
            >
              {/* Add a dynamic left border ribbon based on status */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                fee.status === 'paid' ? 'bg-emerald-400' :
                fee.status === 'pending' ? 'bg-amber-400' :
                fee.status === 'overdue' ? 'bg-red-400' : 'bg-blue-400'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex-1 pl-2">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {fee.title}
                  </h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                    <ClockIcon className="h-3.5 w-3.5" />
                    Due: {formatDate(fee.dueDate)}
                  </span>
                  <span className="text-lg font-black tracking-tight text-slate-700">
                    {formatLKR(fee.amount)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 z-10 pr-2">
                <button
                  onClick={() => onPayNow(fee.id)}
                  disabled={fee.status === 'paid' || fee.status === 'pending'}
                  className={`relative overflow-hidden w-full rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 sm:w-auto flex items-center justify-center gap-2 ${
                    fee.status === 'paid' || fee.status === 'pending'
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 border border-blue-500/20'
                  }`}
                >
                  {fee.status === 'paid' ? (
                    <><CheckCircleIcon className="h-4 w-4" /> Paid</>
                  ) : fee.status === 'pending' ? (
                    <><ClockIcon className="h-4 w-4" /> Processing</>
                  ) : (
                    <>Pay Now <ArrowRightIcon className="h-4 w-4 stroke-[3px]" /></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}

          {fees.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <DollarSignIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No Fees Found</h3>
              <p className="text-sm font-medium text-slate-500">You do not have any fee records assigned.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
