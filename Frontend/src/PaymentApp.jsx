import React, { useEffect, useState } from 'react';
import {
  
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './pages/auth/AuthPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { PaymentSubmission } from './pages/student/PaymentSubmission';
import { PaymentHistory } from './pages/student/PaymentHistory';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { FeeManagement } from './pages/admin/FeeManagement';
import { PaymentVerification } from './pages/admin/PaymentVerification';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { fetchCurrentUser, loginUser, registerUser } from './services/auth';
import {
  createFee as createFeeRequest,
  deleteFee as deleteFeeRequest,
  getFees as getFeesRequest,
  updateFee as updateFeeRequest,
} from './services/fees';
import {
  confirmStripeCheckout as confirmStripeCheckoutRequest,
  createPayment as createPaymentRequest,
  createStripeCheckoutSession as createStripeCheckoutSessionRequest,
  deletePayment as deletePaymentRequest,
  getPayments as getPaymentsRequest,
  verifyPayment as verifyPaymentRequest,
} from './services/payments';
import { downloadReport as downloadReportRequest } from './services/reports';
import {
  getNotifications as getNotificationsRequest,
  markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
  markNotificationAsRead as markNotificationAsReadRequest,
} from './services/notifications';
import {
  deleteUser as deleteUserRequest,
  getUsers as getUsersRequest,
} from './services/users';

const getToken = () => localStorage.getItem('studentToken') || localStorage.getItem('adminToken');

const pageMeta = {
  '/payment/student/dashboard': { title: 'Student Dashboard', currentView: 'dashboard' },
  '/payment/student/submit-payment': {
    title: 'Submit Payment',
    currentView: 'submit-payment',
  },
  '/payment/student/history': { title: 'Payment History', currentView: 'history' },
  '/payment/student/notifications': {
    title: 'Notifications',
    currentView: 'notifications',
  },
  '/payment/admin/dashboard': { title: 'Admin Dashboard', currentView: 'dashboard' },
  '/payment/admin/fees': { title: 'Fee Management', currentView: 'fees' },
  '/payment/admin/verifications': {
    title: 'Payment Verification',
    currentView: 'verifications',
  },
  '/payment/admin/notifications': {
    title: 'Notifications',
    currentView: 'notifications',
  },
};

const getHomePath = (role) =>
  role === 'admin' ? '/payment/admin/dashboard' : '/payment/student/dashboard';

function ProtectedPage({
  user,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  children,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const { title, currentView } = pageMeta[location.pathname] || {
    title: 'Dashboard',
    currentView: 'dashboard',
  };

  return (
    <AppLayout
      role={user.role}
      user={user}
      title={title}
      currentView={currentView}
      notifications={notifications}
      unreadCount={notifications.filter((item) => !item.isRead).length}
      onNavigate={(path) => navigate(path)}
      onLogout={onLogout}
      onMarkNotificationRead={onMarkNotificationRead}
      onMarkAllNotificationsRead={onMarkAllNotificationsRead}
    >
      {children}
    </AppLayout>
  );
}

import { MockPaymentGateway } from './pages/student/MockPaymentGateway';

function StudentRoutes({
  user,
  fees,
  payments,
  paymentsLoading,
  notifications,
  notificationsLoading,
  selectedFeeId,
  setSelectedFeeId,
  onSubmitPayment,
  onStripeCheckout,
  onConfirmStripePayment,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const navigate = useNavigate();
  const feeToPay = fees.find((fee) => fee.id === selectedFeeId) ?? null;

  return (
    <Routes>
      <Route
        path="gateway"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <MockPaymentGateway />
          </ProtectedPage>
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <StudentDashboard
              fees={fees}
              onPayNow={(feeId) => {
                setSelectedFeeId(feeId);
                navigate('/payment/student/submit-payment');
              }}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="submit-payment"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <PaymentSubmission
              fee={feeToPay}
              fees={fees}
              onSelectFee={setSelectedFeeId}
              onSubmit={async (...args) => {
                await onSubmitPayment(...args);
                navigate('/payment/student/history');
              }}
              onStripeCheckout={onStripeCheckout}
              onCancel={() => navigate('/payment/student/dashboard')}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="history"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <PaymentHistory
              payments={payments}
              paymentsLoading={paymentsLoading}
              onConfirmStripePayment={onConfirmStripePayment}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="notifications"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <NotificationsPage
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              onMarkAsRead={onMarkNotificationRead}
              onMarkAllAsRead={onMarkAllNotificationsRead}
              onNavigate={(path) => navigate(path)}
            />
          </ProtectedPage>
        }
      />
      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
    </Routes>
  );
}

function AdminRoutes({
  user,
  payments,
  fees,
  users,
  notifications,
  notificationsLoading,
  feesLoading,
  usersLoading,
  feeError,
  onAddFee,
  onUpdateFee,
  onDeleteFee,
  onDeletePayment,
  onDeleteUser,
  onVerifyPayment,
  onDownloadReport,
  onLogout,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <AdminDashboard
              payments={payments}
              fees={fees}
              onNavigate={(path) => navigate(path)}
              onDownloadReport={onDownloadReport}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="fees"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <FeeManagement
              fees={fees}
              payments={payments}
              users={users}
              feesLoading={feesLoading}
              usersLoading={usersLoading}
              feeError={feeError}
              onAddFee={onAddFee}
              onUpdateFee={onUpdateFee}
              onDeleteFee={onDeleteFee}
              onDeletePayment={onDeletePayment}
              onDeleteUser={onDeleteUser}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="verifications"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <PaymentVerification
              payments={payments}
              onVerify={onVerifyPayment}
              onDeletePayment={onDeletePayment}
            />
          </ProtectedPage>
        }
      />
      <Route
        path="notifications"
        element={
          <ProtectedPage
            user={user}
            onLogout={onLogout}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          >
            <NotificationsPage
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              onMarkAsRead={onMarkNotificationRead}
              onMarkAllAsRead={onMarkAllNotificationsRead}
              onNavigate={(path) => navigate(path)}
            />
          </ProtectedPage>
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

function AppRoutes({
  user,
  authLoading,
  onLogin,
  onRegister,
  onLogout,
  fees,
  feesLoading,
  feeError,
  payments,
  paymentsLoading,
  users,
  usersLoading,
  notifications,
  notificationsLoading,
  selectedFeeId,
  setSelectedFeeId,
  onSubmitPayment,
  onStripeCheckout,
  onConfirmStripePayment,
  onAddFee,
  onUpdateFee,
  onDeleteFee,
  onDeletePayment,
  onDeleteUser,
  onVerifyPayment,
  onDownloadReport,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) {
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading session...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="login"
        element={
          user ? (
            <Navigate to={getHomePath(user.role)} replace />
          ) : (
            <AuthPage mode="login" onSubmit={onLogin} />
          )
        }
      />
      <Route
        path="register"
        element={
          user ? (
            <Navigate to={getHomePath(user.role)} replace />
          ) : (
            <AuthPage mode="register" onSubmit={onRegister} />
          )
        }
      />
      <Route
        path="student/*"
        element={
          user?.role === 'student' ? (
            <StudentRoutes
              user={user}
              fees={fees}
              payments={payments}
              paymentsLoading={paymentsLoading}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              selectedFeeId={selectedFeeId}
              setSelectedFeeId={setSelectedFeeId}
              onSubmitPayment={onSubmitPayment}
              onStripeCheckout={onStripeCheckout}
              onConfirmStripePayment={onConfirmStripePayment}
              onLogout={onLogout}
              onMarkNotificationRead={onMarkNotificationRead}
              onMarkAllNotificationsRead={onMarkAllNotificationsRead}
            />
          ) : user ? (
            <Navigate to={getHomePath(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="admin/*"
        element={
          user?.role === 'admin' ? (
            <AdminRoutes
              user={user}
              payments={payments}
              fees={fees}
              users={users}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              feesLoading={feesLoading}
              usersLoading={usersLoading}
              feeError={feeError}
              onAddFee={onAddFee}
              onUpdateFee={onUpdateFee}
              onDeleteFee={onDeleteFee}
              onDeletePayment={onDeletePayment}
              onDeleteUser={onDeleteUser}
              onVerifyPayment={onVerifyPayment}
              onDownloadReport={onDownloadReport}
              onLogout={onLogout}
              onMarkNotificationRead={onMarkNotificationRead}
              onMarkAllNotificationsRead={onMarkAllNotificationsRead}
            />
          ) : user ? (
            <Navigate to={getHomePath(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={user ? getHomePath(user.role) : '/payment/login'} replace />
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={user ? getHomePath(user.role) : '/payment/login'} replace />
        }
      />
    </Routes>
  );
}

export function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [feeError, setFeeError] = useState('');
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);

  const refreshNotifications = async (token) => {
    if (!token) {
      setNotifications([]);
      return;
    }

    setNotificationsLoading(true);

    try {
      const { notifications: nextNotifications } = await getNotificationsRequest(token);
      setNotifications(nextNotifications);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setAuthLoading(false);
      return;
    }

    fetchCurrentUser(token)
      .then(({ user: currentUser }) => {
        setUser(currentUser);
      })
      .catch((error) => {
        console.error("PaymentApp auth check failed:", error);
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!user || !token) {
      setFees([]);
      setPayments([]);
      setUsers([]);
      setNotifications([]);
      setFeesLoading(false);
      setPaymentsLoading(false);
      setUsersLoading(false);
      setNotificationsLoading(false);
      setFeeError('');
      return;
    }

    setFeesLoading(true);
    setPaymentsLoading(true);
    setFeeError('');

    getFeesRequest(token)
      .then(({ fees: nextFees }) => {
        setFees(nextFees);
      })
      .catch((error) => {
        setFeeError(error.message);
      })
      .finally(() => {
        setFeesLoading(false);
      });

    getPaymentsRequest(token)
      .then(({ payments: nextPayments }) => {
        setPayments(nextPayments);
      })
      .catch((error) => {
        setFeeError(error.message);
      })
      .finally(() => {
        setPaymentsLoading(false);
      });

    refreshNotifications(token).catch((error) => {
      setFeeError(error.message);
    });

    if (user.role === 'admin') {
      setUsersLoading(true);

      getUsersRequest(token)
        .then(({ users: nextUsers }) => {
          setUsers(nextUsers);
        })
        .catch((error) => {
          setFeeError(error.message);
        })
        .finally(() => {
          setUsersLoading(false);
        });
    } else {
      setUsers([]);
      setUsersLoading(false);
    }
  }, [user]);

  const handleAuthSuccess = ({ token, user: nextUser }) => {
    if (nextUser.role === 'admin') {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.setItem('studentToken', token);
    }
    setUser(nextUser);
  };

  const handleLogin = async (formData) => {
    const result = await loginUser({
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    handleAuthSuccess(result);
  };

  const handleRegister = async (formData) => {
    const result = await registerUser(formData);
    handleAuthSuccess(result);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('adminToken');
    setUser(null);
    setSelectedFeeId(null);
    setFees([]);
    setPayments([]);
    setUsers([]);
    setNotifications([]);
    setFeeError('');
  };

  const handleSubmitPayment = async (feeId, referenceNumber, proofImageUrl) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { payment } = await createPaymentRequest(token, {
      feeId,
      referenceNumber,
      proofImageUrl,
    });

    setPayments((current) => [payment, ...current]);
    setFees((current) =>
      current.map((item) =>
        item.id === feeId ? { ...item, status: 'pending' } : item
      )
    );
    await refreshNotifications(token);
    setFeeError('');
  };

  const handleStripeCheckout = async (feeId) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { url } = await createStripeCheckoutSessionRequest(token, { feeId });

    if (!url) {
      throw new Error('Stripe checkout URL was not returned');
    }

    window.location.assign(url);
  };

  const handleConfirmStripePayment = async (sessionId) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { payment } = await confirmStripeCheckoutRequest(token, sessionId);

    setPayments((current) => {
      const exists = current.some((item) => item.id === payment.id);
      if (exists) {
        return current.map((item) => (item.id === payment.id ? payment : item));
      }

      return [payment, ...current];
    });

    setFees((current) =>
      current.map((fee) =>
        fee.id === payment.feeId ? { ...fee, status: 'paid' } : fee
      )
    );

    await refreshNotifications(token);

    return payment;
  };

  const handleAddFee = async (newFeeData) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { fee } = await createFeeRequest(token, newFeeData);
    setFees((current) => [fee, ...current]);
    await refreshNotifications(token);
    setFeeError('');
  };

  const handleUpdateFee = async (id, payload) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { fee } = await updateFeeRequest(token, id, payload);
    setFees((current) =>
      current.map((item) => (item.id === id ? fee : item))
    );
    setFeeError('');
  };

  const handleDeleteFee = async (id) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    await deleteFeeRequest(token, id);
    setFees((current) => current.filter((item) => item.id !== id));
    setFeeError('');
  };

  const handleVerifyPayment = async (paymentId, status, reason) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { payment } = await verifyPaymentRequest(token, paymentId, {
      status,
      reason,
    });

    setPayments((current) =>
      current.map((item) => (item.id === paymentId ? payment : item))
    );

    setFees((current) =>
      current.map((fee) =>
        fee.id === payment.feeId
          ? { ...fee, status: status === 'approved' ? 'paid' : 'overdue' }
          : fee
      )
    );

    await refreshNotifications(token);
  };

  const handleDeletePayment = async (paymentId) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { feeId, feeStatus } = await deletePaymentRequest(token, paymentId);

    setPayments((current) => current.filter((item) => item.id !== paymentId));

    if (feeId) {
      setFees((current) =>
        current.map((fee) =>
          fee.id === feeId ? { ...fee, status: feeStatus || 'overdue' } : fee
        )
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    await deleteUserRequest(token, userId);
    setUsers((current) => current.filter((item) => item.id !== userId));
    setPayments((current) => current.filter((item) => item.studentId !== userId));
  };

  const handleDownloadReport = async (reportType) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    await downloadReportRequest(token, reportType);
  };

  const handleMarkNotificationRead = async (notificationId) => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { notification } = await markNotificationAsReadRequest(token, notificationId);
    setNotifications((current) =>
      current.map((item) => (item.id === notificationId ? notification : item))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    const token = getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    await markAllNotificationsAsReadRequest(token);
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true }))
    );
  };

  return (
    <>
      <AppRoutes
        user={user}
        authLoading={authLoading}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        fees={fees}
        feesLoading={feesLoading}
        feeError={feeError}
        payments={payments}
        paymentsLoading={paymentsLoading}
        users={users}
        usersLoading={usersLoading}
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        selectedFeeId={selectedFeeId}
        setSelectedFeeId={setSelectedFeeId}
        onSubmitPayment={handleSubmitPayment}
        onStripeCheckout={handleStripeCheckout}
        onConfirmStripePayment={handleConfirmStripePayment}
        onAddFee={handleAddFee}
        onUpdateFee={handleUpdateFee}
        onDeleteFee={handleDeleteFee}
        onDeletePayment={handleDeletePayment}
        onDeleteUser={handleDeleteUser}
        onVerifyPayment={handleVerifyPayment}
        onDownloadReport={handleDownloadReport}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />
    </>
  );
}
