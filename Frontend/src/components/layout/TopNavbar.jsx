import React, { useMemo, useState } from 'react';
import { MenuIcon, BellIcon, SearchIcon, CheckCheckIcon } from 'lucide-react';
import { formatDate } from '../../utils/format';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

export function TopNavbar({
  onMenuClick,
  title,
  role,
  user,
  notifications = [],
  unreadCount = 0,
  onNavigate,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="-ml-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
            {role}
          </p>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden items-center md:flex">
          <SearchIcon className="absolute left-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((current) => !current)}
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 min-w-[18px] rounded-full bg-red-500 px-1.5 text-center text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <p className="text-xs text-slate-500">{unreadCount} unread</p>
                </div>
                <button
                  onClick={onMarkAllNotificationsRead}
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-700 hover:text-cyan-800"
                >
                  <CheckCheckIcon className="h-3.5 w-3.5" />
                  Mark all
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkNotificationRead(notification.id);
                        }
                        setIsNotificationOpen(false);
                        if (notification.link) {
                          onNavigate(notification.link);
                        }
                      }}
                      className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        notification.isRead ? 'bg-white' : 'bg-cyan-50/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                        )}
                      </div>
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                        {formatDate(notification.createdAt)}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No notifications yet.
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsNotificationOpen(false);
                  onNavigate(role === 'admin' ? '/admin/notifications' : '/student/notifications');
                }}
                className="w-full bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-200 bg-cyan-100 text-sm font-semibold text-cyan-800">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
}
