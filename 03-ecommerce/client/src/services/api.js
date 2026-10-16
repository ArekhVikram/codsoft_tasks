const BASE_URL = '/api';

export function getStoredToken() {
  return localStorage.getItem('nova_auth_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('nova_auth_token', token);
  } else {
    localStorage.removeItem('nova_auth_token');
  }
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/health'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return request(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),
  getFeaturedProducts: () => request('/products/featured'),

  // Auth
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  logout: () => request('/auth/logout', {
    method: 'POST'
  }),

  getMe: () => request('/auth/me'),

  updateProfile: (data) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Orders
  createOrder: (orderPayload) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload)
  }),

  getMyOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),

  // Newsletter & Contact
  subscribeNewsletter: (email) => request('/contact/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  submitContact: (contactData) => request('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData)
  })
};
