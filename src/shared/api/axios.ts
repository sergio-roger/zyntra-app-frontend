import axios, { AxiosError } from 'axios';
import { toastManager } from '@shared/components/toast/toastManager';

const getBaseURL = () => {
  return import.meta.env.VITE_API_URL || '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ConnectivityErrorCode = 'E_NETWORK' | 'E_TIMEOUT';

export interface ConnectivityAxiosError extends AxiosError {
  connectivityCode?: ConnectivityErrorCode;
}

// El backend nunca respondió (sin conexión, DNS caído, CORS, timeout): no confundir
// con un error real del servidor, que sí trae error.response.
const isConnectivityError = (error: AxiosError) =>
  !error.response && error.code !== 'ERR_CANCELED';

// Evita saturar de toasts cuando varias requests fallan a la vez (p. ej. un
// dashboard disparando varios fetch en paralelo mientras no hay internet).
const CONNECTIVITY_TOAST_COOLDOWN_MS = 4000;
let lastConnectivityToastAt = 0;

const notifyConnectivityError = (isTimeout: boolean) => {
  const now = Date.now();
  if (now - lastConnectivityToastAt < CONNECTIVITY_TOAST_COOLDOWN_MS) return;
  lastConnectivityToastAt = now;

  toastManager.add({
    title: isTimeout ? 'Tiempo de espera agotado' : 'Sin conexión',
    description: isTimeout
      ? 'El servidor tardó demasiado en responder. Inténtalo de nuevo.'
      : 'No se pudo conectar con el servidor. Revisa tu conexión a internet.',
    type: 'error',
  });
};

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: ConnectivityAxiosError) => {
    if (isConnectivityError(error)) {
      const isTimeout = error.code === 'ECONNABORTED';
      error.connectivityCode = isTimeout ? 'E_TIMEOUT' : 'E_NETWORK';
      notifyConnectivityError(isTimeout);
    }
    return Promise.reject(error);
  },
);

export default api;
