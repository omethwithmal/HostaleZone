import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function AppLayout({
  role,
  user,
  title,
  currentView,
  notifications,
  unreadCount,
  onNavigate,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  children,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        role={role}
        user={user}
        currentView={currentView}
        onNavigate={(path) => {
          onNavigate(path);
          setIsSidebarOpen(false);
        }}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar
          user={user}
          role={role}
          title={title}
          notifications={notifications}
          unreadCount={unreadCount}
          onMenuClick={() => setIsSidebarOpen(true)}
          onNavigate={onNavigate}
          onMarkNotificationRead={onMarkNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
