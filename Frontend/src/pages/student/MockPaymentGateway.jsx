import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  LockIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from 'lucide-react';

export function MockPaymentGateway() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      setFormData((prev) => ({ ...prev, [name]: formatCardNumber(value).substring(0, 19) }));
    } else if (name === 'expiry') {
      let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length >= 2) {
        v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
      }
      setFormData((prev) => ({ ...prev, [name]: v.substring(0, 5) }));
    } else if (name === 'cvv') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      setFormData((prev) => ({ ...prev, [name]: v.substring(0, 4) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.cardNumber.length < 19 || formData.expiry.length < 5 || formData.cvv.length < 3) {
      alert("Please fill in all card details correctly.");
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('studentToken');
      // Replace localhost:5000 with dynamic API URL if available
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${API_URL}/payments/mock-room-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Payment processing failed');
      }

      setIsProcessing(false);
      setIsSuccess(true);
      
      // Navigate to Dashboard after showing success animation
      setTimeout(() => {
        window.location.href = '/payment/student/dashboard';
      }, 2000);
      
    } catch (error) {
      alert('Error connecting to the payment gateway. ' + error.message);
      setIsProcessing(false);
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
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"
        >
          <CheckCircleIcon className="h-12 w-12" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Payment Successful!
        </h2>
        <p className="mb-8 text-slate-500 font-medium">
          Your room fee has been paid successfully. 
          Generating your receipt...
        </p>
        <div className="flex justify-center">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8 }}
              className="h-full bg-emerald-500"
            />
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
      {/* Header aligned with style */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="group mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Secure Checkout</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
          <ShieldCheckIcon className="h-4 w-4" />
          SSL Encrypted
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200/60 bg-white shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
        
        {/* Absolute Background Gradients corresponding to project theme */}
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 translate-y-1/3 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl" />

        {/* Order Summary Strip */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex justify-between items-center">
           <div>
             <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Paying For</p>
             <p className="text-base font-semibold text-slate-800">Room Booking Fee</p>
           </div>
           <div className="text-right">
             <p className="text-2xl font-black text-slate-900">LKR 20,000</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6 space-y-5">
            {/* Payment Method Cards purely cosmetic */}
            <div className="flex gap-3 mb-8">
              <div className="flex-1 rounded-xl border-2 border-cyan-500 bg-cyan-50/30 p-4 relative cursor-pointer">
                <div className="absolute right-3 top-3 h-4 w-4 rounded-full border-4 border-cyan-500 bg-white" />
                <div className="flex gap-2 items-center mb-2 h-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">Credit / Debit Card</p>
              </div>
              <div className="flex-1 rounded-xl border-2 border-slate-100 bg-white p-4 cursor-not-allowed">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 mb-2" />
                <p className="font-semibold text-slate-500 text-sm">PayPal</p>
              </div>
            </div>

            {/* Name on Card */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Name on Card
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                placeholder="JOHN DOE"
              />
            </div>

            {/* Card Number */}
            <div className="relative">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="0000 0000 0000 0000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm font-bold tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
                <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                {/* Visa / Master Logo Dummies based on card start */}
                {formData.cardNumber.startsWith('4') && (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="absolute right-4 top-1/2 -translate-y-1/2 h-4" />
                )}
                {(formData.cardNumber.startsWith('5') || formData.cardNumber.startsWith('2')) && (
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="absolute right-4 top-1/2 -translate-y-1/2 h-5" />
                )}
              </div>
            </div>

            {/* Exp & CVV */}
            <div className="flex gap-5">
              <div className="flex-1">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
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
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  placeholder="•••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold tracking-widest text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="group relative w-full overflow-hidden rounded-xl bg-slate-900 py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-90"
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </motion.div>
              ) : (
                <motion.div
                  key="pay"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  Confirm Payment - LKR 20,000
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          <p className="mt-4 text-center text-xs text-slate-400 font-medium">
            Payments are processed securely via our internal gateway.
          </p>
        </form>
      </div>
    </motion.div>
  );
}
