import { z } from 'zod';
import { isValidDomain } from '@features/channels/utils/domain';

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}){1,2}$/;

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

export const securityStepSchema = z.object({
  allowedDomains: z.array(z.string().refine(isValidDomain, 'Dominio inválido.')),
});

export const agentStepSchema = z.object({
  agentId: z.string().nullable(),
});

export const webChannelSchema = identityStepSchema
  .extend(appearanceStepSchema.shape)
  .extend(securityStepSchema.shape)
  .extend(agentStepSchema.shape);

export type WebChannelFormValues = z.infer<typeof webChannelSchema>;

export const WEB_CHANNEL_STEP_FIELDS = {
  identity: Object.keys(identityStepSchema.shape) as (keyof WebChannelFormValues)[],
  appearance: Object.keys(appearanceStepSchema.shape) as (keyof WebChannelFormValues)[],
  security: Object.keys(securityStepSchema.shape) as (keyof WebChannelFormValues)[],
  agent: Object.keys(agentStepSchema.shape) as (keyof WebChannelFormValues)[],
  summary: [] as (keyof WebChannelFormValues)[],
} as const;
