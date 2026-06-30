import axios from 'axios';

/**
 * Pre-configured axios instance that automatically targets the correct API host.
 * - In production (Vercel build): VITE_API_BASE_URL = https://how-cooked-am-i.onrender.com
 * - In local dev: falls back to '' (empty), so Vite's dev-proxy to localhost:5000 takes over.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

// Attach JWT from localStorage on every request so callers don't have to
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('cooked_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (_) {}
  }
  return config;
});

export default api;
