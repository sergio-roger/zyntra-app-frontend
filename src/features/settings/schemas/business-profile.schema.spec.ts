import { describe, it, expect } from 'vitest';
import { businessProfileSchema } from '@features/settings/schemas/business-profile.schema';

const validPayload = {
  industryId: null,
  nicheDetail: 'SaaS para agencias',
  valueProposition: 'Automatizamos marketing con IA',
  mission: '',
  competitors: ['Acme', 'Globex'],
  targetAudience: 'Agencias de marketing',
  audienceAgeRange: '25-34',
  businessModel: 'b2b' as const,
  geographicScope: 'international' as const,
  country: 'Ecuador',
  city: 'Quito',
  tone: 'professional' as const,
  brandVoiceNotes: '',
  locale: 'es',
  brandColors: { primary: '#6366f1', secondary: '', accent: '' },
  primaryGoal: 'leads' as const,
  monthlyBudgetRange: 'from_1000_to_5000' as const,
  activeChannels: ['web_chat', 'facebook'],
  teamSize: 8,
};

describe('businessProfileSchema', () => {
  it('acepta un payload completo válido', () => {
    const result = businessProfileSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('acepta industryId, monthlyBudgetRange y teamSize en null', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      industryId: null,
      monthlyBudgetRange: null,
      teamSize: null,
    });
    expect(result.success).toBe(true);
  });

  it('rechaza un businessModel fuera del enum', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      businessModel: 'not-a-model',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza un color de marca con formato inválido', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      brandColors: { primary: 'not-a-hex', secondary: '', accent: '' },
    });
    expect(result.success).toBe(false);
  });

  it('rechaza más de 10 competitors', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      competitors: Array.from({ length: 11 }, (_, i) => `Competitor ${i}`),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza un teamSize fuera de rango', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      teamSize: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza un nicheDetail que supera el largo máximo', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      nicheDetail: 'a'.repeat(151),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza un industryId que no es un UUID válido', () => {
    const result = businessProfileSchema.safeParse({
      ...validPayload,
      industryId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});
