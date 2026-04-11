import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSignIcon,
  FileCheckIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  FileDownIcon,
  ArrowUpRightIcon,
  ReceiptTextIcon,
  WalletCardsIcon,
  CalendarRangeIcon,
  ClipboardListIcon,
  Building2Icon,
} from 'lucide-react';
import { formatCompactLKR, formatLKR, formatDate } from '../../utils/format';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';

const reportItems = [
  {
    id: 'student-payment-history',
    title: 'Student payment history',
    description: 'Latest payment records grouped for audit review.',
    icon: ReceiptTextIcon,
    accent: 'from-cyan-500/15 to-sky-500/10 border-cyan-200',
  },
  {
    id: 'outstanding-balances',
    title: 'Outstanding balances',
    description: 'Track overdue totals and unpaid fee exposure.',
    icon: WalletCardsIcon,
    accent: 'from-amber-500/15 to-orange-500/10 border-amber-200',
  },
  {
    id: 'monthly-yearly-income',
    title: 'Monthly and yearly income report',
    description: 'Revenue snapshots for monthly and annual reporting.',
    icon: CalendarRangeIcon,
    accent: 'from-emerald-500/15 to-teal-500/10 border-emerald-200',
  },
  {
    id: 'paid-unpaid-bills',
    title: 'Paid and unpaid bills list',
    description: 'Clean export of completed and open billing items.',
    icon: ClipboardListIcon,
    accent: 'from-violet-500/15 to-fuchsia-500/10 border-violet-200',
  },
  {
    id: 'overdue-payments',
    title: 'Overdue payment reports',
    description: 'Focused PDF for delayed or missed fee payments.',
    icon: AlertCircleIcon,
    accent: 'from-rose-500/15 to-red-500/10 border-rose-200',
  },
  {
    id: 'room-flow-income',
    title: 'Room and flow income',
    description: 'Room-related and general payment flow summary.',
    icon: Building2Icon,
    accent: 'from-indigo-500/15 to-blue-500/10 border-indigo-200',
  },
];

export function AdminDashboard({
  payments,
  fees,
  onNavigate,
  onDownloadReport,
}) {
  const [downloadingReportId, setDownloadingReportId] = useState('');

  const totalCollected = payments
    .filter((payment) => payment.status === 'approved')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingVerifications = payments.filter(
    (payment) => payment.status === 'pending'
  ).length;
  const overdueCount = fees.filter((fee) => fee.status === 'overdue').length;
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleDownload = async (reportId) => {
    setDownloadingReportId(reportId);
    try {
      await onDownloadReport(reportId);
    } finally {
      setDownloadingReportId('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Collected"
          value={formatCompactLKR(totalCollected)}
          caption={formatLKR(totalCollected)}
          icon={TrendingUpIcon}
          colorClass="bg-emerald-100 text-emerald-600"
          trend={{ value: '12%', isPositive: true }}
        />
        <StatsCard
          title="Pending Verifications"
          value={pendingVerifications.toString()}
          icon={FileCheckIcon}
          colorClass="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Overdue Fees"
          value={overdueCount.toString()}
          icon={AlertCircleIcon}
          colorClass="bg-red-100 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">Recent Payments</h2>
            <button
              onClick={() => onNavigate('/admin/verifications')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/50 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600">
                    {payment.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {payment.studentName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {payment.feeName} &middot; {formatDate(payment.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {formatLKR(payment.amount)}
                  </p>
                  <Badge status={payment.status} className="mt-1" />
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <div className="p-8 text-center text-slate-500">No recent activity.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate('/admin/fees')}
                className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-primary-500 hover:bg-primary-50"
              >
                <div className="rounded-md bg-slate-100 p-2 transition-colors group-hover:bg-primary-100 group-hover:text-primary-600">
                  <DollarSignIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Create New Fee</p>
                  <p className="text-xs text-slate-500">Assign a new fee to students</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('/admin/verifications')}
                className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-amber-500 hover:bg-amber-50"
              >
                <div className="relative rounded-md bg-slate-100 p-2 transition-colors group-hover:bg-amber-100 group-hover:text-amber-600">
                  <FileCheckIcon className="h-5 w-5" />
                  {pendingVerifications > 0 && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Verify Payments</p>
                  <p className="text-xs text-slate-500">
                    {pendingVerifications} pending reviews
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(135deg,_#f8fafc,_#eff6ff)] px-6 py-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-slate-950 p-2.5 text-white shadow-sm">
                  <FileDownIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Report Center
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">PDF Downloads</h2>
                </div>
              </div>
              <p className="max-w-sm text-sm text-slate-600">
                Export the current hostel finance data as polished PDF reports for
                reviews, audits, and management updates.
              </p>
            </div>

            <div className="grid gap-3 p-4">
              {reportItems.map((report) => (
                <button
                  key={report.id}
                  onClick={() => handleDownload(report.id)}
                  disabled={downloadingReportId === report.id}
                  className={`group flex w-full items-start justify-between gap-4 rounded-2xl border bg-gradient-to-br px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 ${report.accent}`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-xl bg-white/80 p-2 text-slate-800 shadow-sm">
                      <report.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {report.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-xl bg-white/85 px-3 py-2 text-slate-800 shadow-sm">
                    {downloadingReportId === report.id ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                        Preparing
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                          PDF
                        </span>
                        <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
