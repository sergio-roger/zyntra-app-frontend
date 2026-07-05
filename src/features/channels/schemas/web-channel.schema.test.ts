import { describe, expect, it } from 'vitest';
import {
  identityStepSchema,
  appearanceStepSchema,
  securityStepSchema,
  agentStepSchema,
  webChannelSchema,
} from './web-channel.schema';

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
});
