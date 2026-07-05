import { describe, expect, it } from 'vitest';
import { isValidDomain } from './domain';

describe('isValidDomain', () => {
  it('accepts a plain domain', () => {
    expect(isValidDomain('example.com')).toBe(true);
  });

  it('accepts a subdomain', () => {
    expect(isValidDomain('app.example.com')).toBe(true);
  });

  it('accepts a domain with a port', () => {
    expect(isValidDomain('example.com:3000')).toBe(true);
  });

  it('accepts localhost with a port', () => {
    expect(isValidDomain('localhost:5173')).toBe(true);
  });

  it('accepts bare localhost', () => {
    expect(isValidDomain('localhost')).toBe(true);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(isValidDomain('  example.com  ')).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(isValidDomain('')).toBe(false);
  });

  it('rejects a string with only whitespace', () => {
    expect(isValidDomain('   ')).toBe(false);
  });

  it('rejects a value without a TLD', () => {
    expect(isValidDomain('example')).toBe(false);
  });

  it('rejects a value with a leading hyphen label', () => {
    expect(isValidDomain('-example.com')).toBe(false);
  });

  it('rejects a value with a trailing hyphen label', () => {
    expect(isValidDomain('example-.com')).toBe(false);
  });

  it('rejects a value with spaces inside it', () => {
    expect(isValidDomain('exa mple.com')).toBe(false);
  });

  it('rejects a full URL instead of a bare domain', () => {
    expect(isValidDomain('https://example.com')).toBe(false);
  });

  it('rejects a domain with an invalid port', () => {
    expect(isValidDomain('example.com:abc')).toBe(false);
  });
});
