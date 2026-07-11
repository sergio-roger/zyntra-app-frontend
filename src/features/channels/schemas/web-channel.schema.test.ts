import { describe, expect, it } from 'vitest';
import {
  identityStepSchema,
  appearanceStepSchema,
  availabilityStepSchema,
  securityStepSchema,
  agentStepSchema,
  webChannelSchema,
  DAY_KEYS,
} from './web-channel.schema';

const buildSchedule = (overrides: Partial<Record<(typeof DAY_KEYS)[number], boolean>> = {}) =>
  DAY_KEYS.map((day) => ({
    day,
    enabled: overrides[day] ?? (day !== 'sat' && day !== 'sun'),
    from: '09:00',
    to: '18:00',
  }));

describe('identityStepSchema', () => {
  it('accepts a valid name with optional fields blank', () => {
    const result = identityStepSchema.safeParse({
      name: 'Chat Principal',
      greeting: '',
      assistantName: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const result = identityStepSchema.safeParse({
      name: '',
      greeting: '',
      assistantName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a name that is only whitespace', () => {
    const result = identityStepSchema.safeParse({
      name: '   ',
      greeting: '',
      assistantName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a name longer than 120 characters', () => {
    const result = identityStepSchema.safeParse({
      name: 'a'.repeat(121),
      greeting: '',
      assistantName: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('appearanceStepSchema', () => {
  it('accepts a valid hex color, position and theme', () => {
    const result = appearanceStepSchema.safeParse({
      primaryColor: '#6366f1',
      position: 'bottom-right',
      theme: 'auto',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a shorthand 3-digit hex color', () => {
    const result = appearanceStepSchema.safeParse({
      primaryColor: '#fff',
      position: 'bottom-left',
      theme: 'light',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-hex color', () => {
    const result = appearanceStepSchema.safeParse({
      primaryColor: 'indigo',
      position: 'bottom-right',
      theme: 'auto',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid position', () => {
    const result = appearanceStepSchema.safeParse({
      primaryColor: '#6366f1',
      position: 'top-right',
      theme: 'auto',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid theme', () => {
    const result = appearanceStepSchema.safeParse({
      primaryColor: '#6366f1',
      position: 'bottom-right',
      theme: 'sepia',
    });
    expect(result.success).toBe(false);
  });
});

describe('availabilityStepSchema', () => {
  const base = {
    availabilityMode: 'manual' as const,
    manualStatus: 'available' as const,
    businessHours: {
      timezone: 'America/Guayaquil',
      is24x7: false,
      schedule: buildSchedule(),
    },
  };

  it('accepts a valid manual status', () => {
    const result = availabilityStepSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('accepts a valid schedule configuration', () => {
    const result = availabilityStepSchema.safeParse({
      ...base,
      availabilityMode: 'schedule',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid manual status', () => {
    const result = availabilityStepSchema.safeParse({
      ...base,
      manualStatus: 'napping',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid time format', () => {
    const result = availabilityStepSchema.safeParse({
      ...base,
      businessHours: {
        ...base.businessHours,
        schedule: buildSchedule().map((d, i) => (i === 0 ? { ...d, from: '9am' } : d)),
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('securityStepSchema', () => {
  it('accepts an empty domain list', () => {
    const result = securityStepSchema.safeParse({ allowedDomains: [] });
    expect(result.success).toBe(true);
  });

  it('accepts a list of valid domains', () => {
    const result = securityStepSchema.safeParse({
      allowedDomains: ['example.com', 'app.example.com'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects a list containing an invalid domain', () => {
    const result = securityStepSchema.safeParse({
      allowedDomains: ['example.com', 'not a domain'],
    });
    expect(result.success).toBe(false);
  });
});

describe('agentStepSchema', () => {
  it('accepts a null agentId', () => {
    const result = agentStepSchema.safeParse({ agentId: null });
    expect(result.success).toBe(true);
  });

  it('accepts a string agentId', () => {
    const result = agentStepSchema.safeParse({ agentId: 'agent-1' });
    expect(result.success).toBe(true);
  });
});

describe('webChannelSchema', () => {
  const validValues = {
    name: 'Chat Principal',
    greeting: '¡Hola!',
    assistantName: 'Asistente',
    primaryColor: '#6366f1',
    position: 'bottom-right' as const,
    theme: 'auto' as const,
    availabilityMode: 'manual' as const,
    manualStatus: 'available' as const,
    businessHours: {
      timezone: 'America/Guayaquil',
      is24x7: false,
      schedule: buildSchedule(),
    },
    allowedDomains: ['example.com'],
    agentId: null,
  };

  it('accepts a fully valid payload combining all steps', () => {
    const result = webChannelSchema.safeParse(validValues);
    expect(result.success).toBe(true);
  });

  it('rejects when the identity step is invalid even if other steps are valid', () => {
    const result = webChannelSchema.safeParse({ ...validValues, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when the security step is invalid even if other steps are valid', () => {
    const result = webChannelSchema.safeParse({
      ...validValues,
      allowedDomains: ['bad domain'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts schedule mode with 24/7 and no active days', () => {
    const result = webChannelSchema.safeParse({
      ...validValues,
      availabilityMode: 'schedule',
      businessHours: {
        timezone: 'America/Guayaquil',
        is24x7: true,
        schedule: buildSchedule({ mon: false, tue: false, wed: false, thu: false, fri: false }),
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects schedule mode with no active days and no 24/7', () => {
    const result = webChannelSchema.safeParse({
      ...validValues,
      availabilityMode: 'schedule',
      businessHours: {
        timezone: 'America/Guayaquil',
        is24x7: false,
        schedule: buildSchedule({ mon: false, tue: false, wed: false, thu: false, fri: false }),
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects schedule mode when an active day has from >= to', () => {
    const result = webChannelSchema.safeParse({
      ...validValues,
      availabilityMode: 'schedule',
      businessHours: {
        timezone: 'America/Guayaquil',
        is24x7: false,
        schedule: buildSchedule().map((d, i) => (i === 0 ? { ...d, from: '18:00', to: '09:00' } : d)),
      },
    });
    expect(result.success).toBe(false);
  });
});
