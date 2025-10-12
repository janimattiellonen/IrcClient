import { describe, it, expect } from 'vitest';
import { formatTimestamp, isValidNickname } from './formatters';

describe('formatTimestamp', () => {
  it('should format a timestamp to a localized date string', () => {
    const timestamp = new Date('2025-10-12').getTime();
    const result = formatTimestamp(timestamp);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle epoch timestamp', () => {
    const result = formatTimestamp(0);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('isValidNickname', () => {
  it('should accept valid nicknames starting with a letter', () => {
    expect(isValidNickname('Alice')).toBe(true);
    expect(isValidNickname('Bob123')).toBe(true);
    expect(isValidNickname('user_name')).toBe(true);
  });

  it('should reject nicknames starting with a number', () => {
    expect(isValidNickname('1user')).toBe(false);
    expect(isValidNickname('999')).toBe(false);
  });

  it('should reject empty or null nicknames', () => {
    expect(isValidNickname('')).toBe(false);
  });

  it('should reject nicknames longer than 30 characters', () => {
    const longNickname = 'a'.repeat(31);
    expect(isValidNickname(longNickname)).toBe(false);
  });

  it('should accept nicknames with special IRC characters', () => {
    expect(isValidNickname('user[away]')).toBe(true);
    expect(isValidNickname('user{test}')).toBe(true);
    expect(isValidNickname('user|idle')).toBe(true);
  });

  it('should reject nicknames with invalid characters', () => {
    expect(isValidNickname('user name')).toBe(false); // space
    expect(isValidNickname('user@host')).toBe(false); // @
    expect(isValidNickname('user#tag')).toBe(false); // #
  });
});
