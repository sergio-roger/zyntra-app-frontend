import { describe, it, expect } from 'vitest';
import { canMutateCompanyScope } from '@features/drive/utils/permissions';

describe('canMutateCompanyScope', () => {
  it.each(['admin', 'manager', 'superAdmin'])('allows role %s', (role) => {
    expect(canMutateCompanyScope(role)).toBe(true);
  });

  it.each(['agent', null, undefined, ''])('blocks role %s', (role) => {
    expect(canMutateCompanyScope(role)).toBe(false);
  });
});
