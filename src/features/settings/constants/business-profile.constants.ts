// Keep in sync with backend/src/modules/auth/constants/business-profile.constants.ts
export const MAX_NICHE_DETAIL_LENGTH = 150;
export const MAX_VALUE_PROPOSITION_LENGTH = 600;
export const MAX_MISSION_LENGTH = 600;

export const MAX_COMPETITORS = 10;
export const MAX_COMPETITOR_LENGTH = 100;

export const MAX_TARGET_AUDIENCE_LENGTH = 800;
export const MAX_AUDIENCE_AGE_RANGE_LENGTH = 20;
export const MAX_COUNTRY_LENGTH = 100;
export const MAX_CITY_LENGTH = 100;

export const MAX_BRAND_VOICE_NOTES_LENGTH = 500;
export const MAX_LOCALE_LENGTH = 10;

export const MAX_ACTIVE_CHANNELS = 10;

export const TEAM_SIZE_MIN = 1;
export const TEAM_SIZE_MAX = 100000;

export const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

export const BUSINESS_MODEL_OPTIONS = [
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
  { value: 'b2b2c', label: 'B2B2C' },
] as const;

export const GEOGRAPHIC_SCOPE_OPTIONS = [
  { value: 'local', label: 'Local' },
  { value: 'national', label: 'Nacional' },
  { value: 'international', label: 'Internacional' },
] as const;

export const BRAND_TONE_OPTIONS = [
  { value: 'friendly', label: 'Amigable' },
  { value: 'professional', label: 'Profesional' },
  { value: 'playful', label: 'Divertido' },
  { value: 'formal', label: 'Formal' },
  { value: 'bold', label: 'Audaz' },
  { value: 'luxury', label: 'Lujo' },
  { value: 'minimalist', label: 'Minimalista' },
] as const;

export const PRIMARY_GOAL_OPTIONS = [
  { value: 'leads', label: 'Generar leads' },
  { value: 'sales', label: 'Ventas' },
  { value: 'awareness', label: 'Reconocimiento de marca' },
  { value: 'retention', label: 'Retención' },
  { value: 'support', label: 'Soporte' },
] as const;

export const BUDGET_RANGE_OPTIONS = [
  { value: 'under_500', label: 'Menos de $500' },
  { value: 'from_500_to_1000', label: '$500 - $1,000' },
  { value: 'from_1000_to_5000', label: '$1,000 - $5,000' },
  { value: 'from_5000_to_10000', label: '$5,000 - $10,000' },
  { value: 'over_10000', label: 'Más de $10,000' },
] as const;

// Mirrors CHANNEL_TYPES_SEED keys (backend channels/seeds/seed-channel-types.ts).
export const ACTIVE_CHANNEL_OPTIONS = [
  { value: 'web_chat', label: 'Chat web' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
] as const;
