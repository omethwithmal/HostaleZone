import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CalendarRangeIcon,
  Building2Icon,
  WavesIcon,
  AlertTriangleIcon,
  BellOffIcon,
  UsersIcon,
  ReceiptIcon,
} from 'lucide-react';
import { formatLKR, formatDate } from '../../utils/format';
import { validateFeeForm } from '../../utils/validation';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';

const categoryOptions = [
  {
    id: 'hostel_fee',
    label: 'Monthly, Annual hostel fee',
    icon: CalendarRangeIcon,
    description: 'Create recurring hostel rent or annual billing items.',
  },
  {
    id: 'room_flow',
    label: 'Room-flow based total fee',
    icon: Building2Icon,
    description: 'Create fees based on room allocation or flow rules.',
  },
  {
    id: 'utilities',
    label: 'Electricity and water charges',
    icon: WavesIcon,
    description: 'Track utility-specific charges separately.',
  },
  {
    id: 'late_payment',
    label: 'Due date & late payment',
    icon: AlertTriangleIcon,
    description: 'Configure due dates and late payment penalties.',
  },
];

const deleteOptions = [
  {
    id: 'incorrect-payments',
    label: 'Incorrect payment entries',
    icon: ReceiptIcon,
    description: 'Remove rejected, duplicated, or wrong payment records.',
  },
  {
    id: 'duplicate-bills',
    label: 'Duplicate bills',
    icon: Building2Icon,
    description: 'Delete repeated fee setups before students are affected.',
  },
  {
    id: 'outdated-reports',
    label: 'Outdated fee notification and report',
    icon: BellOffIcon,
    description: 'Reports are generated live, so no old PDF files are stored.',
  },
  {
    id: 'cancelled-bills',
    label: 'Cancelled bills',
    icon: TrashIcon,
    description: 'Use bill deletion to remove fee setups you no longer need.',
  },
  {
    id: 'inactive-accounts',
    label: 'Remove inactive accounts',
    icon: UsersIcon,
    description: 'Clean up student accounts inactive for at least 30 days.',
  },
];

const emptyForm = {
  title: '',
  category: 'hostel_fee',
  billingCycle: 'monthly',
  roomFlowBasis: '',
  utilityType: '',
  description: '',
  amount: '',
  lateFeeAmount: '',
  dueDate: '',
};

const formatCategoryLabel = (category) =>
  ({
    hostel_fee: 'Hostel Fee',
    room_flow: 'Room-flow Fee',
    utilities: 'Utility Charge',
    late_payment: 'Late Payment Rule',
  }[category] || 'Fee');

const buildDuplicateKey = (fee) =>
  [
    fee.title?.trim().toLowerCase(),
    fee.category,
    Number(fee.amount || 0),
    fee.dueDate ? new Date(fee.dueDate).toISOString().slice(0, 10) : '',
  ].join('|');

export function FeeManagement({
  fees,
  payments,
  users,
  feesLoading,
  usersLoading,
  feeError,
  onAddFee,
  onUpdateFee,
  onDeleteFee,
  onDeletePayment,
  onDeleteUser,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formState, setFormState] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [cleanupError, setCleanupError] = useState('');

  const isEditing = useMemo(() => Boolean(editingFee), [editingFee]);

  const flaggedPayments = useMemo(
    () => payments.filter((payment) => payment.status !== 'approved').slice(0, 6),
    [payments]
  );

  const duplicateFees = useMemo(() => {
    const buckets = new Map();

    fees.forEach((fee) => {
      const key = buildDuplicateKey(fee);
      const current = buckets.get(key) || [];
      current.push(fee);
      buckets.set(key, current);
    });

    return [...buckets.values()]
      .filter((bucket) => bucket.length > 1)
      .flatMap((bucket) => bucket.slice(1))
      .slice(0, 6);
  }, [fees]);

  const inactiveUsers = useMemo(
    () => users.filter((user) => user.role === 'student' && user.isInactive).slice(0, 6),
    [users]
  );

  const openCreateModal = () => {
    setEditingFee(null);
    setFormState(emptyForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (fee) => {
    setEditingFee(fee);
    setFormState({
      title: fee.title || '',
      category: fee.category || 'hostel_fee',
      billingCycle: fee.billingCycle || 'one_time',
      roomFlowBasis: fee.roomFlowBasis || '',
      utilityType: fee.utilityType || '',
      description: fee.description || '',
      amount: String(fee.amount ?? ''),
      lateFeeAmount: String(fee.lateFeeAmount ?? ''),
      dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().slice(0, 10) : '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFee(null);
    setFormState(emptyForm);
    setFormError('');
  };

  const updateForm = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const validationError = validateFeeForm(formState);
      if (validationError) {
        throw new Error(validationError);
      }

      const payload = {
        title: formState.title.trim(),
        category: formState.category,
        billingCycle:
          formState.category === 'hostel_fee' ? formState.billingCycle : 'one_time',
        roomFlowBasis:
          formState.category === 'room_flow' ? formState.roomFlowBasis.trim() : '',
        utilityType:
          formState.category === 'utilities' ? formState.utilityType.trim() : '',
        description: formState.description.trim(),
        amount: Number(formState.amount),
        lateFeeAmount:
          formState.category === 'late_payment'
            ? Number(formState.lateFeeAmount || 0)
            : 0,
        dueDate: formState.dueDate,
      };

      if (isEditing) {
        await onUpdateFee(editingFee.id, payload);
      } else {
        await onAddFee(payload);
      }

      closeModal();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (feeId) => {
    try {
      setCleanupError('');
      await onDeleteFee(feeId);
    } catch (error) {
      setCleanupError(error.message);
    }
  };

  const handleDeletePaymentEntry = async (paymentId) => {
    try {
      setCleanupError('');
      await onDeletePayment(paymentId);
    } catch (error) {
      setCleanupError(error.message);
    }
  };

  const handleDeleteUserAccount = async (userId) => {
    try {
      setCleanupError('');
      await onDeleteUser(userId);
    } catch (error) {
      setCleanupError(error.message);
    }
  };

  const columns = [
    {
      header: 'Fee Setup',
      accessor: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.title}</p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{formatCategoryLabel(row.category)}</span>
            {row.billingCycle && row.billingCycle !== 'one_time' && (
              <span className="capitalize">{row.billingCycle}</span>
            )}
            {row.utilityType && <span>{row.utilityType}</span>}
            {row.roomFlowBasis && <span>{row.roomFlowBasis}</span>}
            <span>Status: {row.status}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <div>
          <p>{formatLKR(row.amount)}</p>
          {row.lateFeeAmount > 0 && (
            <p className="text-xs text-slate-500">
              Late fee: {formatLKR(row.lateFeeAmount)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Due Date',
      accessor: (row) => formatDate(row.dueDate),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileCard = (row) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-slate-900">{row.title}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{formatCategoryLabel(row.category)}</span>
          <span>{formatLKR(row.amount)}</span>
          <span>Due: {formatDate(row.dueDate)}</span>
          {row.lateFeeAmount > 0 && <span>Late: {formatLKR(row.lateFeeAmount)}</span>}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => openEditModal(row)}
          className="rounded-lg bg-slate-50 p-2 text-slate-400 hover:text-primary-600"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleDelete(row.id)}
          className="rounded-lg bg-slate-50 p-2 text-slate-400 hover:text-red-600"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(135deg,_#f8fafc,_#eff6ff)] p-6 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Create
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                Configure hostel billing with structured fee templates.
              </h2>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <PlusIcon className="h-4 w-4" />
              Create Fee Setup
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {categoryOptions.map((option) => (
              <div
                key={option.id}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 backdrop-blur"
              >
                <option.icon className="mb-3 h-5 w-5 text-sky-700" />
                <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_bottom_left,_rgba(248,113,113,0.18),_transparent_32%),linear-gradient(135deg,_#fff7ed,_#fff1f2)] p-6 shadow-soft">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">
            Delete
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
            Clean billing mistakes before they spread through the dashboard.
          </h3>
          <div className="mt-5 space-y-3">
            {deleteOptions.map((option) => (
              <div
                key={option.id}
                className="rounded-2xl border border-white/60 bg-white/85 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <option.icon className="mt-0.5 h-4 w-4 text-rose-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(feeError || cleanupError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {feeError || cleanupError}
        </div>
      )}

      {feesLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading fees...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={fees}
          keyExtractor={(row) => row.id}
          renderMobileCard={renderMobileCard}
          emptyMessage="No fees found in the database."
        />
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
                Incorrect Entries
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">
                Payment cleanup
              </h3>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {flaggedPayments.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {flaggedPayments.length > 0 ? (
              flaggedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {payment.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {payment.feeName} · {payment.status} · {formatDate(payment.date)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePaymentEntry(payment.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {formatLKR(payment.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No flagged payment entries right now.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                Duplicate Bills
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">
                Repeated fee setups
              </h3>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {duplicateFees.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {duplicateFees.length > 0 ? (
              duplicateFees.map((fee) => (
                <div
                  key={fee.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{fee.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatCategoryLabel(fee.category)} · Due {formatDate(fee.dueDate)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(fee.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {formatLKR(fee.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No duplicate bill patterns detected from current fee data.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                Accounts
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">
                Inactive student cleanup
              </h3>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {inactiveUsers.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {usersLoading ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                Loading accounts...
              </p>
            ) : inactiveUsers.length > 0 ? (
              inactiveUsers.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {account.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{account.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUserAccount(account.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Last active: {formatDate(account.lastActiveAt || account.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No inactive student accounts found for the 30-day rule.
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,_#f8fafc,_#fff7ed)] p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Report Notice
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">
              Outdated fee notifications and reports
            </h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            Generated Live
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Admin PDF reports are generated on demand from the latest fee and payment
          data. There is no stored report file bucket in this build, so outdated
          report files do not need a separate delete action.
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditing ? 'Edit Fee Setup' : 'Create New Fee Setup'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Fee Category
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateForm('category', option.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    formState.category === option.id
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white hover:border-slate-400'
                  }`}
                >
                  <option.icon className="mb-3 h-5 w-5" />
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className="mt-1 text-xs opacity-80">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Fee Title
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(event) => updateForm('title', event.target.value)}
                placeholder="e.g. Annual Hostel Fee 2026"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Amount (LKR)
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={formState.amount}
                onChange={(event) => updateForm('amount', event.target.value)}
                placeholder="e.g. 15000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {formState.category === 'hostel_fee' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Billing Cycle
              </label>
              <div className="grid gap-3 md:grid-cols-3">
                {['monthly', 'annual', 'one_time'].map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => updateForm('billingCycle', cycle)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
                      formState.billingCycle === cycle
                        ? 'border-sky-600 bg-sky-50 text-sky-700'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cycle.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {formState.category === 'room_flow' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Room-flow Basis
              </label>
              <input
                type="text"
                required
                value={formState.roomFlowBasis}
                onChange={(event) => updateForm('roomFlowBasis', event.target.value)}
                placeholder="e.g. Deluxe room, shared block, floor-based total"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          {formState.category === 'utilities' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Utility Type
              </label>
              <input
                type="text"
                required
                value={formState.utilityType}
                onChange={(event) => updateForm('utilityType', event.target.value)}
                placeholder="e.g. Electricity, Water, Electricity + Water"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formState.dueDate}
                onChange={(event) => updateForm('dueDate', event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Late Payment Amount (LKR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formState.lateFeeAmount}
                onChange={(event) => updateForm('lateFeeAmount', event.target.value)}
                placeholder="e.g. 1000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description / Notes
            </label>
            <textarea
              rows="3"
              value={formState.description}
              onChange={(event) => updateForm('description', event.target.value)}
              placeholder="Add billing notes, room logic, or late payment instructions."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Fee Setup'}
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
