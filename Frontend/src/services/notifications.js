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

export const getNotifications = (token) => request('/notifications', token);

export const markNotificationAsRead = (token, id) =>
  request(`/notifications/${id}/read`, token, {
    method: 'PATCH',
  });

export const markAllNotificationsAsRead = (token) =>
  request('/notifications/read-all', token, {
    method: 'PATCH',
  });
