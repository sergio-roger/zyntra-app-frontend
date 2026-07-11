import { z } from 'zod';
import { isValidDomain } from '@features/channels/utils/domain';

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const WIDGET_STATUSES = ['available', 'busy', 'offline'] as const;
export type WidgetStatus = (typeof WIDGET_STATUSES)[number];

export const identityStepSchema = z.object({
  name: z.string().trim().min(1, 'El nombre del canal es requerido.').max(120),
  greeting: z.string().max(500),
  assistantName: z.string().max(60),
});

export const appearanceStepSchema = z.object({
  primaryColor: z
    .string()
    .regex(HEX_COLOR_REGEX, 'El color debe ser un código hexadecimal válido (ej. #6366f1).'),
  position: z.enum(['bottom-left', 'bottom-right']),
  theme: z.enum(['light', 'dark', 'auto']),
});

const dayScheduleSchema = z.object({
  day: z.enum(DAY_KEYS),
  enabled: z.boolean(),
  from: z.string().regex(TIME_REGEX, 'Hora inválida.'),
  to: z.string().regex(TIME_REGEX, 'Hora inválida.'),
});

export const availabilityStepSchema = z.object({
  availabilityMode: z.enum(['manual', 'schedule']),
  manualStatus: z.enum(WIDGET_STATUSES),
  businessHours: z.object({
    timezone: z.string().min(1, 'Selecciona una zona horaria.'),
    is24x7: z.boolean(),
    schedule: z.array(dayScheduleSchema).length(7),
  }),
});

export const securityStepSchema = z.object({
  allowedDomains: z.array(z.string().refine(isValidDomain, 'Dominio inválido.')),
});

export const agentStepSchema = z.object({
  agentId: z.string().nullable(),
});

export const webChannelSchema = identityStepSchema
  .extend(appearanceStepSchema.shape)
  .extend(availabilityStepSchema.shape)
  .extend(securityStepSchema.shape)
  .extend(agentStepSchema.shape)
  .superRefine((values, ctx) => {
    if (values.availabilityMode !== 'schedule' || values.businessHours.is24x7) {
      return;
    }
    const { schedule } = values.businessHours;
    const activeDays = schedule.filter((d) => d.enabled);

    if (activeDays.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecciona al menos un día de atención o activa 24/7.',
        path: ['businessHours', 'schedule'],
      });
      return;
    }

    schedule.forEach((d, i) => {
      if (d.enabled && d.from >= d.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La hora de inicio debe ser anterior a la de cierre.',
          path: ['businessHours', 'schedule', i, 'to'],
        });
      }
    });
  });

export type WebChannelFormValues = z.infer<typeof webChannelSchema>;
export type DaySchedule = z.infer<typeof dayScheduleSchema>;

export const WEB_CHANNEL_STEP_FIELDS = {
  identity: [
    ...Object.keys(identityStepSchema.shape),
    ...Object.keys(appearanceStepSchema.shape),
  ] as (keyof WebChannelFormValues)[],
  availability: Object.keys(availabilityStepSchema.shape) as (keyof WebChannelFormValues)[],
  security: Object.keys(securityStepSchema.shape) as (keyof WebChannelFormValues)[],
  agent: Object.keys(agentStepSchema.shape) as (keyof WebChannelFormValues)[],
  summary: [] as (keyof WebChannelFormValues)[],
} as const;

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Lunes',
  tue: 'Martes',
  wed: 'Miércoles',
  thu: 'Jueves',
  fri: 'Viernes',
  sat: 'Sábado',
  sun: 'Domingo',
};

export const WIDGET_STATUS_LABELS: Record<WidgetStatus, string> = {
  available: 'Disponible',
  busy: 'Ocupado',
  offline: 'Fuera de servicio',
};
