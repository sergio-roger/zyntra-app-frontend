import { ERROR_CODE_MESSAGES, ERROR_MESSAGES } from '@shared/constants/errorMessages';

export function getApiErrorMessage(error: unknown): string {
  const defaultError = 'Ocurrió un error inesperado. Intenta de nuevo';
  const data = (error as any)?.response?.data;

  if (!data) {
    return defaultError;
  }

  const firstError = data.errors?.[0];
  const description: string | undefined = firstError?.description;
  const code: string | undefined = firstError?.code;
  const rootMessage: string | undefined = data.message;

  if (description && ERROR_MESSAGES[description]) {
    return ERROR_MESSAGES[description];
  }

  if (code && ERROR_CODE_MESSAGES[code]) {
    return ERROR_CODE_MESSAGES[code];
  }

  if (rootMessage && ERROR_MESSAGES[rootMessage]) {
    return ERROR_MESSAGES[rootMessage];
  }

  if (rootMessage) {
    return rootMessage;
  }

  return defaultError;
}
