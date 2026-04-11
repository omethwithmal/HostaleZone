import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  Loader2Icon,
  LandmarkIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  LockIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatLKR } from '../../utils/format';
import { validateBankSlipPayment } from '../../utils/validation';
import { FileUpload, fileToBase64 } from '../../components/ui/FileUpload';

export function PaymentSubmission({
  fee,
  fees = [],
  onSelectFee,
  onSubmit, // Handles bank slip
  onCancel,
}) {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('bank_slip');
  const [reference, setReference] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Credit Card Form State
  const [cardData, setCardData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const payableFees = useMemo(
    () => fees.filter((item) => item.status !== 'paid' && item.status !== 'pending'),
    [fees]
  );

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setCardData((prev) => ({ ...prev, [name]: formatCardNumber(value).substring(0, 19) }));
    } else if (name === 'expiry') {
      let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
      setCardData((prev) => ({ ...prev, [name]: v.substring(0, 5) }));
    } else if (name === 'cvv') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      setCardData((prev) => ({ ...prev, [name]: v.substring(0, 4) }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // If no fee selected
  if (!fee) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Select Fee to Pay
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Choose a fee first, then select Bank Slip Upload or Secure Credit Card Checkout.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {payableFees.length > 0 ? (
              payableFees.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Due: {new Date(item.dueDate).toLocaleDateString()} &middot; <span className="text-cyan-600">{formatLKR(item.amount)}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectFee?.(item.id)}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-all hover:bg-slate-800 shadow-md hover:shadow-lg"
                  >
                    Select & Pay
                  </button>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <CheckCircleIcon className="h-8 w-8" />
                </div>
                <p className="mb-4 font-bold text-slate-900 text-lg">You're all caught up!</p>
                <p className="mb-6 text-slate-500 font-medium">No payable fees available right now.</p>
                <button
                  onClick={onCancel}
                  className="font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  &larr; Go back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  const handleBankSlipSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateBankSlipPayment({ reference, file });
    if (validationError) {
      setError(validationError); return;
    }

    setIsSubmitting(true);
    try {
      const proofImageUrl = await fileToBase64(file);
      await onSubmit(fee.id, reference, proofImageUrl);
      setIsSuccess(true);
      setTimeout(() => { window.location.href = '/payment/student/history'; }, 2500);
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCreditCardSubmit = async (e) => {
    e.preventDefault();
    if (cardData.cardNumber.length < 19 || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
      setError("Please fill in all card details correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('studentToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${API_URL}/payments/mock-fee-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feeId: fee.id })
      });
      
      if (!res.ok) throw new Error('Payment processing failed');

      setIsSuccess(true);
      setTimeout(() => { window.location.href = '/payment/student/history'; }, 2000);
    } catch (checkoutError) {
      setError('Error connecting to the payment gateway. ' + checkoutError.message);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto mt-16 max-w-md rounded-[24px] border border-slate-100 bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
      >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"
        >
          <CheckCircleIcon className="h-12 w-12" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Payment Successful!
        </h2>
        <p className="mb-8 text-slate-500 font-medium leading-relaxed">
          {paymentMethod === 'bank_slip' 
            ? `Your bank slip for ${fee.title} has been submitted & is pending review.`
            : `Your fee payment for ${fee.title} was completed successfully.`}
          <br/>Redirecting to history...
        </p>
        <div className="flex justify-center">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: paymentMethod === 'bank_slip' ? 2.3 : 1.8 }} className="h-full bg-emerald-500" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-[550px] pb-12"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={onCancel}
            className="group mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-cyan-600"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Submit Payment</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100">
          <ShieldCheckIcon className="h-4 w-4" />
          SSL Encrypted
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
        
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 translate-y-1/3 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex justify-between items-center px-8">
           <div>
             <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Paying For</p>
             <p className="text-base font-bold text-slate-800">{fee.title}</p>
           </div>
           <div className="text-right">
             <p className="text-2xl font-black text-slate-900">{formatLKR(fee.amount)}</p>
           </div>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8">
             <button
              type="button"
              onClick={() => { setPaymentMethod('bank_slip'); setError(''); }}
              className={`flex-1 rounded-xl p-4 transition-all border-2 relative flex flex-col items-center justify-center text-center group ${
                paymentMethod === 'bank_slip'
                  ? 'border-slate-900 bg-slate-50 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`mb-2 p-2 rounded-full border ${paymentMethod === 'bank_slip' ? 'bg-slate-900 text-white border-transparent' : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-100'}`}>
                <LandmarkIcon className="h-5 w-5" />
              </div>
              <p className={`font-extrabold text-sm ${paymentMethod === 'bank_slip' ? 'text-slate-900' : 'text-slate-600'}`}>Bank Slip</p>
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod('credit_card'); setError(''); }}
              className={`flex-1 rounded-xl p-4 transition-all border-2 relative flex flex-col items-center justify-center text-center group ${
                paymentMethod === 'credit_card'
                  ? 'border-cyan-500 bg-cyan-50/30 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              {paymentMethod === 'credit_card' && <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-cyan-500/20" />}
              <div className={`mb-2 p-2 rounded-full border ${paymentMethod === 'credit_card' ? 'bg-cyan-500 text-white border-transparent' : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-100'}`}>
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <p className={`font-extrabold text-sm ${paymentMethod === 'credit_card' ? 'text-slate-900' : 'text-slate-600'}`}>Credit Card</p>
            </button>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 font-medium text-sm text-red-600 flex items-start gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {paymentMethod === 'bank_slip' ? (
            <motion.form key="bank-slip" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleBankSlipSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Bank Reference / Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. BOC-12345678"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Payment Proof (Receipt) <span className="text-red-500">*</span>
                </label>
                <FileUpload onFileSelect={setFile} error={error} />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-4 text-sm font-bold tracking-wide text-white shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-90"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div key="submitting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-center gap-2">
                        <Loader2Icon className="h-5 w-5 animate-spin" /> Submitting...
                      </motion.div>
                    ) : (
                      <motion.div key="submit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        Submit Document Verification
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form key="credit-card" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleCreditCardSubmit} className="space-y-6">
              
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={cardData.cardName}
                  onChange={handleCardInputChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  placeholder="JOHN DOE"
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    required
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-bold tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                  <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  {cardData.cardNumber.startsWith('4') && (
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="absolute right-4 top-1/2 -translate-y-1/2 h-4" />
                  )}
                  {(cardData.cardNumber.startsWith('5') || cardData.cardNumber.startsWith('2')) && (
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="absolute right-4 top-1/2 -translate-y-1/2 h-5" />
                  )}
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardInputChange}
                    required
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                    CVV <LockIcon className="h-3 w-3" />
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    required
                    placeholder="•••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full overflow-hidden rounded-xl bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)] py-4 text-sm font-bold tracking-wide text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all hover:bg-[linear-gradient(135deg,#08abc6,#0284c7)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] disabled:cursor-not-allowed disabled:opacity-90"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-center gap-2">
                        <Loader2Icon className="h-5 w-5 animate-spin text-white" /> Processing...
                      </motion.div>
                    ) : (
                      <motion.div key="pay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        Pay Seamlessly &mdash; {formatLKR(fee.amount)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
