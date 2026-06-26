import { z } from 'zod';
import { SOURCES } from '@crm/types/crm';

export const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(120),
  email: z
    .string()
    .max(160)
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email inválido')
    .optional(),
  phone: z.string().max(40).optional(),
  source: z.enum(SOURCES as [string, ...string[]]).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  ownerId: z.string().uuid().nullable().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
