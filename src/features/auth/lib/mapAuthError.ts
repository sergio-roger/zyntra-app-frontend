import { AxiosError } from 'axios';
import { ApiErrorResponse, ApiError } from '@features/auth/types/auth.types';
import { getFriendlyErrorMessage } from '@shared/utils/errorMapper';
import { ConnectivityAxiosError } from '@shared/api/axios';

/**
 * Extracts structured errors from the API error response.
 * Returns the array of `{ code, description }` if available,
 * otherwise falls back to a generic error.
 */
export const extractApiErrors = (error: unknown): ApiError[] => {
  if (error instanceof AxiosError) {
    const connectivityCode = (error as ConnectivityAxiosError).connectivityCode;
    if (connectivityCode) {
      return [
        {
          code: connectivityCode,
          description: getFriendlyErrorMessage(connectivityCode),
        },
      ];
    }

    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.errors?.length) {
      return data.errors.map((err) => ({
        code: err.code,
        description: getFriendlyErrorMessage(err.code, err.description),
      }));
    }

    // Fallback: build a synthetic error from the old `message` field
    const status = error.response?.status ?? 500;
    const message = data?.message || error.message;

    let code = `E${status}`;
    if (status === 401) code = 'E0001';
    else if (status === 409) code = 'E0002';
    else if (status === 400) code = 'E0003';
    else if (status === 402) code = 'E0004';
    else if (status === 403) code = 'E0005';
    else if (status === 404) code = 'E0006';
    else if (status === 429) code = 'E0007';
    else if (status === 500) code = 'E5000';

    return [
      {
        code,
        description: getFriendlyErrorMessage(code, message),
      },
    ];
  }

  if (error instanceof Error) {
    return [{ code: 'E9999', description: error.message }];
  }

  return [{ code: 'E9999', description: 'Error desconocido.' }];
};

/**
 * @deprecated Use `extractApiErrors` for structured error handling.
 * Kept for backward compatibility with components that expect a single string.
 */
export const mapAuthError = (error: unknown): string => {
  const errors = extractApiErrors(error);
  return errors.map((e) => e.description).join('. ');
};
