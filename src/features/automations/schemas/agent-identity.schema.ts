import { z } from 'zod';
import { ChatbotLocale, ChatbotTone } from '../types/automations';

export const agentIdentitySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  systemPrompt: z
    .string()
    .min(1, 'El prompt del sistema es obligatorio')
    .max(8000, 'Máximo 8000 caracteres'),
  model: z.string().min(1, 'Elegí un modelo').max(100),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().int().min(1).max(1024),
  tone: z.nativeEnum(ChatbotTone).nullable(),
  locale: z.nativeEnum(ChatbotLocale).nullable(),
  isActive: z.boolean(),
});

export type AgentIdentityFormValues = z.infer<typeof agentIdentitySchema>;
