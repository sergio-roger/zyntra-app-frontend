import { AxiosError } from 'axios';
import type { ApiErrorResponse, ApiError } from '@features/auth/types/auth.types';

/**
 * Extracts structured errors from the API error response.
 * Returns the array of `{ code, description }` if available,
 * otherwise falls back to a generic error.
 */
export const extractApiErrors = (error: unknown): ApiError[] => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.errors?.length) {
      return data.errors;
    }

    // Fallback: build a synthetic error from the old `message` field
    const status = error.response?.status ?? 500;
    const message = data?.message || error.message;

    return [
      {
        code: `E${status}`,
        description: mapStatusMessage(status, message),
      },
    ];
  }

  if (error instanceof Error) {
    return [{ code: 'E9999', description: error.message }];
  }

  return [{ code: 'E9999', description: 'Error desconocido.' }];
};

function mapStatusMessage(status: number, fallback: string): string {
  switch (status) {
    case 400:
      return fallback || 'Datos inválidos. Revisa el formulario.';
    case 401:
      return 'Credenciales incorrectas.';
    case 402:
      return 'Tu plan ha expirado. Actualiza tu suscripción para continuar.';
    case 409:
      return fallback || 'Este email ya está registrado.';
    case 429:
      return 'Demasiados intentos. Espera unos minutos antes de volver a probar.';
    case 500:
    case 502:
    case 503:
      return 'Error del servidor. Inténtalo de nuevo en unos momentos.';
    default:
      return fallback || 'Algo salió mal. Inténtalo de nuevo.';
  }
}

/**
 * @deprecated Use `extractApiErrors` for structured error handling.
 * Kept for backward compatibility with components that expect a single string.
 */
export const mapAuthError = (error: unknown): string => {
  const errors = extractApiErrors(error);
  return errors.map((e) => e.description).join('. ');
};
