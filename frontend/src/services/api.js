/**
 * NyayaSetu — Axios API Client
 * Central HTTP client with Clerk JWT injection and error handling.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Clerk token injector — set by the auth store once Clerk is ready.
 * Call setTokenProvider(getToken) from your auth feature.
 */
let _getToken = null;
export function setTokenProvider(fn) {
  _getToken = fn;
}

// ─── Request interceptor: attach JWT ────────────────────────────────────────
apiClient.interceptors.request.use(async (config) => {
  if (_getToken) {
    try {
      const token = await _getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token fetch failed — request proceeds without auth header
    }
  }
  return config;
});

// ─── Response interceptor: normalize errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Construct a normalized error
    const normalized = {
      status,
      message,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      raw:  error,
    };

    if (status === 401) {
      // Unauthenticated — redirect to sign-in
      window.location.href = '/sign-in';
    }

    if (status === 403) {
      normalized.message = 'You do not have permission to perform this action.';
    }

    return Promise.reject(normalized);
  }
);

export default apiClient;
