import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XIcon, EyeIcon, TrashIcon } from 'lucide-react';
import { formatLKR, formatDate } from '../../utils/format';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function PaymentVerification({ payments, onVerify, onDeletePayment }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('pending');

  const filteredPayments = payments.filter(
    (payment) => filter === 'all' || payment.status === 'pending'
  );

  const handleApprove = (id) => {
    onVerify(id, 'approved');
  };

  const handleReject = (id) => {
    onVerify(
      id,
      'rejected',
      'Invalid payment proof or reference number mismatch.'
    );
  };

  const handleDelete = (id) => {
    onDeletePayment(id);
  };

  const columns = [
    {
      header: 'Student',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-xs text-slate-500">{row.studentId}</p>
        </div>
      ),
    },
    {
      header: 'Payment Details',
      accessor: (row) => (
        <div>
          <p className="text-sm text-slate-900">{row.feeName}</p>
          <p className="text-xs text-slate-500">
            Ref: {row.referenceNumber} &middot; {formatDate(row.date)}
          </p>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => <span className="font-medium">{formatLKR(row.amount)}</span>,
    },
    {
      header: 'Proof',
      accessor: (row) => (
        <button
          onClick={() => setSelectedImage(row.proofImageUrl)}
          className="flex items-center gap-1 rounded bg-primary-50 px-2 py-1 text-xs font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          <EyeIcon className="h-3 w-3" /> View
        </button>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) =>
        row.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApprove(row.id)}
              className="rounded p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
              title="Approve"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleReject(row.id)}
              className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50"
              title="Reject"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete Entry"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete Entry"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        ),
    },
  ];

  const renderMobileCard = (row) => (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-xs text-slate-500">{row.feeName}</p>
        </div>
        <Badge status={row.status} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{formatLKR(row.amount)}</span>
        <button
          onClick={() => setSelectedImage(row.proofImageUrl)}
          className="flex items-center gap-1 text-xs font-medium text-primary-600"
        >
          <EyeIcon className="h-3 w-3" /> View Proof
        </button>
      </div>

      {row.status === 'pending' && (
        <div className="flex gap-2 border-t border-slate-100 pt-2">
          <button
            onClick={() => handleApprove(row.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <CheckIcon className="h-4 w-4" /> Approve
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
          >
            <XIcon className="h-4 w-4" /> Reject
          </button>
        </div>
      )}

      <button
        onClick={() => handleDelete(row.id)}
        className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" /> Delete Entry
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Payment Verification
          </h2>
          <p className="text-sm text-slate-500">
            Review and approve submitted payment proofs.
          </p>
        </div>
        <div className="flex rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setFilter('pending')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All History
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPayments}
        keyExtractor={(row) => row.id}
        renderMobileCard={renderMobileCard}
        emptyMessage={
          filter === 'pending'
            ? 'All caught up! No pending verifications.'
            : 'No payment records found.'
        }
      />

      <Modal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        title="Payment Proof"
        maxWidth="max-w-3xl"
      >
        {selectedImage && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <img
              src={selectedImage}
              alt="Payment Proof"
              className="max-h-[70vh] max-w-full object-contain"
            />
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
