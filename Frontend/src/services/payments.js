const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, token, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const getPayments = (token) => request('/payments', token);

export const createPayment = (token, payload) =>
  request('/payments', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createStripeCheckoutSession = (token, payload) =>
  request('/payments/checkout-session', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const confirmStripeCheckout = (token, sessionId) =>
  request(`/payments/checkout-session/${sessionId}/confirm`, token, {
    method: 'POST',
  });

export const verifyPayment = (token, id, payload) =>
  request(`/payments/${id}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const deletePayment = (token, id) =>
  request(`/payments/${id}`, token, {
    method: 'DELETE',
  });
