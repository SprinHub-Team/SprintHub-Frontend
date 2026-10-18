import axios from 'axios';
import { env } from '@/config/env';
import { getAuthToken } from './tokenStore';

type UnauthorizedHandler = () => void;

const unauthorizedHandlers = new Set<UnauthorizedHandler>();

export function onUnauthorized(handler: UnauthorizedHandler): () => void {
  unauthorizedHandlers.add(handler);
  return () => {
    unauthorizedHandlers.delete(handler);
  };
}

export const apiClient = axios.create({
  baseURL: `${env.apiUrl}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    config.headers['Content-Type'] = undefined as unknown as string;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { status?: unknown } }).response?.status === 'number' &&
      (error as { response: { status: number } }).response.status === 401
    ) {
      unauthorizedHandlers.forEach((handler) => handler());
    }
    return Promise.reject(error);
  },
);
