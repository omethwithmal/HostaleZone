import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2Icon, ShieldCheckIcon, GraduationCapIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { validateAuthForm } from '../../utils/validation';

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'student',
};

export function AuthPage({ mode, onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateAuthForm(mode, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData(initialState);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.15),_transparent_35%),linear-gradient(135deg,_#f8fafc,_#e2e8f0)] px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] bg-slate-950 px-8 py-10 text-white shadow-2xl"
        >
          <div className="mb-10 flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <Building2Icon className="h-7 w-7 text-cyan-300" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                MERN Stack
              </p>
              <h1 className="text-3xl font-semibold">HostelPay Portal</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300">
                Access Control
              </p>
              <h2 className="max-w-xl text-4xl font-semibold leading-tight">
                Student and admin access with direct dashboard redirects.
              </h2>
            </div>

            <p className="max-w-xl text-slate-300">
              Register a new account or sign in to continue. Students land on the
              student dashboard. Admin accounts land on the admin dashboard.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <GraduationCapIcon className="mb-3 h-6 w-6 text-cyan-300" />
                <h3 className="mb-2 text-lg font-medium">Student Access</h3>
                <p className="text-sm text-slate-300">
                  Submit hostel payments, track status, and review payment history.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <ShieldCheckIcon className="mb-3 h-6 w-6 text-emerald-300" />
                <h3 className="mb-2 text-lg font-medium">Admin Access</h3>
                <p className="text-sm text-slate-300">
                  Create fees, verify payments, and monitor the overall system.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[32px] border border-slate-200 bg-white px-6 py-8 shadow-xl sm:px-8"
        >
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">
              {isRegister ? 'Register' : 'Login'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange('email', event.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => handleChange('password', event.target.value)}
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleChange('role', role)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition ${
                      formData.role === role
                        ? 'border-slate-950 bg-slate-950 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? isRegister
                  ? 'Creating account...'
                  : 'Signing in...'
                : isRegister
                  ? 'Register and Continue'
                  : 'Login and Continue'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link
              to={isRegister ? '/login' : '/register'}
              className="font-medium text-cyan-700 hover:text-cyan-900"
            >
              {isRegister ? 'Login here' : 'Register here'}
            </Link>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
