export const ERROR_CODE_MAP: Record<string, string> = {
  E0001: 'Credenciales inválidas. Por favor, inténtalo de nuevo.', // Unauthorized / Invalid credentials
  E0002: 'Los datos ingresados ya existen o están en conflicto.', // Conflict (e.g., email already registered)
  E0003: 'Los datos enviados son inválidos. Revisa el formulario.', // Bad Request
  E0004: 'Pago requerido o suscripción expirada.', // Payment Required
  E0005: 'No tienes permisos para realizar esta acción.', // Forbidden
  E0006: 'El recurso solicitado no fue encontrado.', // Not Found
  E0007:
    'Demasiados intentos. Por favor, espera unos minutos antes de volver a intentar.', // Too Many Requests
  E5000: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
  E5001: 'Error en la conexión con el servidor (Bad Gateway).',
  E5002: 'El servicio no está disponible temporalmente.',
  E9999: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
};

export interface ApiError {
  code: string;
  description: string;
}

export const getFriendlyErrorMessage = (
  code: string,
  defaultDescription?: string,
): string => {
  // Traducir mensajes comunes del backend si vienen en inglés o con descripciones estándar
  const descLower = defaultDescription?.toLowerCase() || '';

  if (
    code === 'E0001' ||
    descLower === 'unauthorized' ||
    descLower.includes('credentials')
  ) {
    return ERROR_CODE_MAP.E0001;
  }

  if (ERROR_CODE_MAP[code]) {
    return ERROR_CODE_MAP[code];
  }

  // Traducciones rápidas para descripciones genéricas del backend
  if (descLower.includes('conflict') || descLower.includes('already exists')) {
    return ERROR_CODE_MAP.E0002;
  }
  if (descLower.includes('not found') || descLower.includes('cannot find')) {
    return ERROR_CODE_MAP.E0006;
  }

  return defaultDescription || ERROR_CODE_MAP.E9999;
};
