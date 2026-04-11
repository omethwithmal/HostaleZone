import React from 'react';
import { motion } from 'framer-motion';
import { BellIcon, CheckCheckIcon } from 'lucide-react';
import { formatDate } from '../../utils/format';

const notificationStyles = {
  fee: 'border-sky-200 bg-sky-50 text-sky-700',
  payment: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  system: 'border-slate-200 bg-slate-100 text-slate-700',
};

export function NotificationsPage({
  notifications,
  notificationsLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_25%),linear-gradient(135deg,_#ffffff,_#eff6ff)] p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Notification Center
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Stay on top of fee and payment activity.
          </h2>
        </div>
        <button
          onClick={onMarkAllAsRead}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <CheckCheckIcon className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      {notificationsLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading notifications...
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-[24px] border p-5 shadow-soft transition-colors ${
                notification.isRead
                  ? 'border-slate-200 bg-white'
                  : 'border-cyan-200 bg-cyan-50/50'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        notificationStyles[notification.type] || notificationStyles.system
                      }`}
                    >
                      {notification.type}
                    </span>
                    {!notification.isRead && (
                      <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {notification.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {notification.link && (
                    <button
                      onClick={() => onNavigate(notification.link)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                    >
                      Open
                    </button>
                  )}
                  {!notification.isRead && (
                    <button
                      onClick={() => onMarkAsRead(notification.id)}
                      className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-soft">
          <BellIcon className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            No notifications yet.
          </p>
        </div>
      )}
    </motion.div>
  );
}
