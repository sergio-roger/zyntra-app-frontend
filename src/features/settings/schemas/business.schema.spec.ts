import { describe, it, expect } from 'vitest';
import { updateBusinessSchema } from '@features/settings/schemas/business.schema';

describe('updateBusinessSchema', () => {
  it('acepta un payload válido', () => {
    const result = updateBusinessSchema.safeParse({
      name: 'Acme',
      email: 'contact@acme.com',
      phone: '+593 99 999 9999',
      address: 'Av. Siempre Viva 123',
      taxId: '1791234567001',
      website: 'https://acme.com',
    });

    expect(result.success).toBe(true);
  });

  it('acepta strings vacíos como valores opcionales', () => {
    const result = updateBusinessSchema.safeParse({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      website: '',
    });

    expect(result.success).toBe(true);
  });

  it('rechaza un email inválido', () => {
    const result = updateBusinessSchema.safeParse({ email: 'not-an-email' });

    expect(result.success).toBe(false);
  });

  it('rechaza un website que no es una URL válida', () => {
    const result = updateBusinessSchema.safeParse({ website: 'not-a-url' });

    expect(result.success).toBe(false);
  });

  it('rechaza un name que supera el largo máximo', () => {
    const result = updateBusinessSchema.safeParse({ name: 'a'.repeat(151) });

    expect(result.success).toBe(false);
  });

  it('rechaza un taxId que supera el largo máximo', () => {
    const result = updateBusinessSchema.safeParse({ taxId: '1'.repeat(51) });

    expect(result.success).toBe(false);
  });
});
