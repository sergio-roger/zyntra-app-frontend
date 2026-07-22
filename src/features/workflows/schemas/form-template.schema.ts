import { z } from 'zod';
import { FormStatus, FormSubmitAction } from '../types/forms';

export const formTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(120, 'Máximo 120 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .max(120, 'Máximo 120 caracteres')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Usá minúsculas, números y guiones'),
  description: z.string().max(1000).optional().or(z.literal('')),
  status: z.nativeEnum(FormStatus),
  submitAction: z.nativeEnum(FormSubmitAction),
  successMessage: z.string().max(500).optional().or(z.literal('')),
});

export type FormTemplateFormValues = z.infer<typeof formTemplateSchema>;
