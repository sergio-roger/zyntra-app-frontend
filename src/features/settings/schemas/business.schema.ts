import { z } from 'zod';

export const updateBusinessSchema = z.object({
  name: z.string().max(150, 'Máximo 150 caracteres').optional().or(z.literal('')),
  email: z
    .string()
    .email('Correo inválido')
    .optional()
    .or(z.literal('')),
  phone: z.string().max(30, 'Máximo 30 caracteres').optional().or(z.literal('')),
  address: z
    .string()
    .max(255, 'Máximo 255 caracteres')
    .optional()
    .or(z.literal('')),
  taxId: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
  website: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
});

export type UpdateBusinessFormValues = z.infer<typeof updateBusinessSchema>;
