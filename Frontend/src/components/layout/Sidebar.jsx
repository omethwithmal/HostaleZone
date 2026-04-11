import React from 'react';
import {
  LayoutDashboardIcon,
  CreditCardIcon,
  HistoryIcon,
  SettingsIcon,
  FileCheckIcon,
  LogOutIcon,
  XIcon,
  BuildingIcon,
  BellIcon,
} from 'lucide-react';

export function Sidebar({
  role,
  user,
  currentView,
  onNavigate,
  onLogout,
  isOpen,
  onClose,
}) {
  const studentLinks = [
    { id: 'main-dashboard', label: '⬅ Back to Main Dashboard', path: '/dashboard', icon: LayoutDashboardIcon },
    { id: 'dashboard', label: 'Payment Dashboard', path: '/payment/student/dashboard', icon: LayoutDashboardIcon },
    { id: 'submit-payment', label: 'Submit Payment', path: '/payment/student/submit-payment', icon: CreditCardIcon },
    { id: 'history', label: 'Payment History', path: '/payment/student/history', icon: HistoryIcon },
    { id: 'notifications', label: 'Notifications', path: '/payment/student/notifications', icon: BellIcon },
  ];

  const adminLinks = [
    { id: 'dashboard', label: 'Overview', path: '/payment/admin/dashboard', icon: LayoutDashboardIcon },
    { id: 'fees', label: 'Fee Management', path: '/payment/admin/fees', icon: SettingsIcon },
    { id: 'verifications', label: 'Verifications', path: '/payment/admin/verifications', icon: FileCheckIcon },
    { id: 'notifications', label: 'Notifications', path: '/payment/admin/notifications', icon: BellIcon },
  ];

  const links = role === 'student' ? studentLinks : adminLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <BuildingIcon className="h-6 w-6 text-cyan-400" />
            <span>HostelPay</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 md:hidden"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.path)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-slate-950' : 'text-slate-400'
                    }`}
                  />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-2xl bg-slate-800 p-4">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              {role}
            </p>
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600"
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
