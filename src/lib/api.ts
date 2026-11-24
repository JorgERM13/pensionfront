const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// ============ TIPOS ============
interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

// ============ FUNCIÓN BASE ============
async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const { params, ...restOptions } = options;

  // 👇 Construir query string si hay params
  let url = `${API_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...restOptions.headers,
  };

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  // 401 → redirigir al login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('No autorizado');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`);
  }

  return data;
}

// ============ API ============
export const api = {
  get: <T = any>(
    endpoint: string,
    options?: { params?: Record<string, any> }
  ): Promise<T> => {
    return fetchAPI(endpoint, { method: 'GET', params: options?.params });
  },

  post: <T = any>(endpoint: string, body?: any): Promise<T> => {
    return fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put: <T = any>(endpoint: string, body?: any): Promise<T> => {
    return fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  delete: <T = any>(endpoint: string): Promise<T> => {
    return fetchAPI(endpoint, { method: 'DELETE' });
  },
};