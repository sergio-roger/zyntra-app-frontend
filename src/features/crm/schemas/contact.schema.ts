import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(120),
  email: z
    .string()
    .max(160)
    .refine(
      (v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      'Email inválido',
    )
    .optional(),
  phone: z.string().max(40).optional(),
  channelId: z.string().uuid().nullable().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  ownerId: z.string().uuid().nullable().optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
