import { z } from 'zod';
import {
  HEX_COLOR_REGEX,
  MAX_ACTIVE_CHANNELS,
  MAX_AUDIENCE_AGE_RANGE_LENGTH,
  MAX_BRAND_VOICE_NOTES_LENGTH,
  MAX_CITY_LENGTH,
  MAX_COMPETITOR_LENGTH,
  MAX_COMPETITORS,
  MAX_COUNTRY_LENGTH,
  MAX_LOCALE_LENGTH,
  MAX_MISSION_LENGTH,
  MAX_NICHE_DETAIL_LENGTH,
  MAX_TARGET_AUDIENCE_LENGTH,
  MAX_VALUE_PROPOSITION_LENGTH,
  TEAM_SIZE_MAX,
  TEAM_SIZE_MIN,
} from '@features/settings/constants/business-profile.constants';

const optionalText = (max: number) =>
  z.string().max(max, `Máximo ${max} caracteres`).optional().or(z.literal(''));

const hexColor = z
  .string()
  .regex(HEX_COLOR_REGEX, 'Color inválido (ej. #6366f1)')
  .optional()
  .or(z.literal(''));

export const businessProfileSchema = z.object({
  industryId: z.string().uuid().nullable(),
  nicheDetail: optionalText(MAX_NICHE_DETAIL_LENGTH),
  valueProposition: optionalText(MAX_VALUE_PROPOSITION_LENGTH),
  mission: optionalText(MAX_MISSION_LENGTH),
  competitors: z
    .array(z.string().max(MAX_COMPETITOR_LENGTH))
    .max(MAX_COMPETITORS, `Máximo ${MAX_COMPETITORS} competidores`),

  targetAudience: optionalText(MAX_TARGET_AUDIENCE_LENGTH),
  audienceAgeRange: optionalText(MAX_AUDIENCE_AGE_RANGE_LENGTH),
  businessModel: z.enum(['b2b', 'b2c', 'b2b2c']),
  geographicScope: z.enum(['local', 'national', 'international']),
  country: optionalText(MAX_COUNTRY_LENGTH),
  city: optionalText(MAX_CITY_LENGTH),

  tone: z.enum([
    'friendly',
    'professional',
    'playful',
    'formal',
    'bold',
    'luxury',
    'minimalist',
  ]),
  brandVoiceNotes: optionalText(MAX_BRAND_VOICE_NOTES_LENGTH),
  locale: optionalText(MAX_LOCALE_LENGTH),
  brandColors: z.object({
    primary: hexColor,
    secondary: hexColor,
    accent: hexColor,
  }),

  primaryGoal: z.enum(['leads', 'sales', 'awareness', 'retention', 'support']),
  monthlyBudgetRange: z
    .enum([
      'under_500',
      'from_500_to_1000',
      'from_1000_to_5000',
      'from_5000_to_10000',
      'over_10000',
    ])
    .nullable(),
  activeChannels: z
    .array(z.string())
    .max(MAX_ACTIVE_CHANNELS, `Máximo ${MAX_ACTIVE_CHANNELS} canales`),
  teamSize: z
    .number()
    .int()
    .min(TEAM_SIZE_MIN, `Mínimo ${TEAM_SIZE_MIN}`)
    .max(TEAM_SIZE_MAX, `Máximo ${TEAM_SIZE_MAX}`)
    .nullable(),
});

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
