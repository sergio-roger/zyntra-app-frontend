export const ERROR_MESSAGES: Record<string, string> = {
  // --- Validación (class-validator) ---
  "email must be an email": "El correo electrónico no tiene un formato válido",
  "name should not be empty": "El nombre no puede estar vacío",
  "name must be a string": "El nombre debe ser texto",
  "should not be empty": "Este campo es obligatorio",
  "must be a string": "El valor debe ser texto",
  "must be a boolean value": "El valor debe ser verdadero o falso",
  "must be an array": "El valor debe ser una lista",
  "must be an object": "El valor debe ser un objeto",
  "must be a UUID": "El identificador no es válido",
  "must be one of the following values": "El valor seleccionado no es válido",
  "must be longer than or equal to 6 characters":
    "Debe tener al menos 6 caracteres",
  "must be shorter than or equal to 120 characters":
    "No puede superar los 120 caracteres",
  "must be shorter than or equal to 40 characters":
    "No puede superar los 40 caracteres",

  // --- Auth ---
  "Credenciales incorrectas": "Correo o contraseña incorrectos",
  "Invalid or expired reset token":
    "El enlace de recuperación es inválido o ha expirado",

  // --- Usuarios / Settings ---
  "Email already registered": "Este correo ya está registrado",
  "Email already registered for this business":
    "Este correo ya está registrado en tu organización",
  "User not found": "Usuario no encontrado",

  // --- Roles ---
  "Role not found or not editable": "El rol no existe o no puede editarse",
  "Role not found or not deletable": "El rol no existe o no puede eliminarse",
  "Invalid role name": "El nombre del rol no es válido",

  // --- Contactos ---
  "Contact not found": "Contacto no encontrado",

  // --- Deals / Pipelines ---
  "Deal not found": "Negocio no encontrado",
  "Pipeline not found": "Pipeline no encontrado",
  "Stage not found": "Etapa no encontrada",
  "Team not found": "Equipo no encontrado",

  // --- Servidor / Gateway ---
  "AI service error": "El servicio de IA no está disponible en este momento",
  "OpenRouter API not configured": "El servicio de IA no está configurado",
  "Error al procesar mensaje":
    "No se pudo procesar el mensaje. Intenta de nuevo",
};

export const ERROR_CODE_MESSAGES: Record<string, string> = {
  E0001:
    "Tu sesión ha expirado o no tienes autorización. Inicia sesión de nuevo",
  E0002: "Ya existe un registro con estos datos",
  E0003: "Los datos enviados no son válidos. Revisa el formulario",
  E0004: "Has alcanzado el límite de tu plan actual",
  E0005: "No tienes permiso para realizar esta acción",
  E0006: "El recurso solicitado no fue encontrado",
  E0007: "Demasiadas solicitudes. Espera unos segundos e intenta de nuevo",
  E5000:
    "Error interno del servidor. Contacta a soporte si el problema persiste",
  E5001: "Error de conexión con un servicio externo",
  E5002: "El servicio no está disponible temporalmente. Intenta más tarde",
};
