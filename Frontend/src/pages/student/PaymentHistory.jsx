import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SearchIcon, FilterIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { formatLKR, formatDate } from '../../utils/format';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

export function PaymentHistory({
  payments,
  paymentsLoading,
  onConfirmStripePayment,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stripeMessage, setStripeMessage] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [stripeLoading, setStripeLoading] = useState(false);

  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    const sessionId = searchParams.get('session_id');

    if (checkoutStatus !== 'success' || !sessionId) {
      return;
    }

    setStripeLoading(true);
    setStripeError('');
    setStripeMessage('');

    onConfirmStripePayment(sessionId)
      .then(() => {
        setStripeMessage('Stripe payment completed successfully.');
        setSearchParams({}, { replace: true });
      })
      .catch((error) => {
        setStripeError(error.message || 'Failed to confirm Stripe payment.');
      })
      .finally(() => {
        setStripeLoading(false);
      });
  }, [onConfirmStripePayment, searchParams, setSearchParams]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.feeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Date',
      accessor: (row) => formatDate(row.date),
    },
    {
      header: 'Fee Details',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.feeName}</p>
          <p className="text-xs text-slate-500">
            {row.paymentMethod === 'stripe' ? 'Stripe' : 'Bank Slip'} · Ref:{' '}
            {row.referenceNumber}
          </p>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => <span className="font-medium">{formatLKR(row.amount)}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} />,
    },
  ];

  const renderMobileCard = (row) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-900">{row.feeName}</p>
          <p className="text-xs text-slate-500">{formatDate(row.date)}</p>
        </div>
        <Badge status={row.status} />
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
        <div>
          <p className="text-xs text-slate-500">
            {row.paymentMethod === 'stripe' ? 'Stripe' : 'Bank Slip'}
          </p>
          <p className="text-xs text-slate-500">Ref: {row.referenceNumber}</p>
        </div>
        <p className="font-medium text-slate-900">{formatLKR(row.amount)}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {stripeLoading && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
          Confirming your Stripe payment...
        </div>
      )}
      {stripeMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {stripeMessage}
        </div>
      )}
      {stripeError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {stripeError}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by fee name or reference..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {paymentsLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading payment history...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredPayments}
          keyExtractor={(row) => row.id}
          renderMobileCard={renderMobileCard}
          emptyMessage="No payment history found."
        />
      )}
    </motion.div>
  );
}
