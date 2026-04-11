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

export const getFees = (token) => request('/fees', token);

export const createFee = (token, payload) =>
  request('/fees', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateFee = (token, id, payload) =>
  request(`/fees/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteFee = (token, id) =>
  request(`/fees/${id}`, token, {
    method: 'DELETE',
  });
