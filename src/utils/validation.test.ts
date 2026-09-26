import { describe, it, expect } from 'vitest';
import { isValidProblem, containsSensitiveInfo } from './validation';

describe('Validation Utils', () => {
  describe('isValidProblem', () => {
    it('should return false for strings shorter than 10 characters', () => {
      expect(isValidProblem('')).toBe(false);
      expect(isValidProblem('Too short')).toBe(false);
      expect(isValidProblem('  spaces  ')).toBe(false);
    });

    it('should return true for strings with 10 or more characters', () => {
      expect(isValidProblem('This is exactly ten.')).toBe(true);
      expect(isValidProblem('This is a long enough description of a legal problem.')).toBe(true);
    });
  });

  describe('containsSensitiveInfo', () => {
    it('should detect potential Aadhaar numbers', () => {
      expect(containsSensitiveInfo('My ID is 123456789012')).toBe(true);
      expect(containsSensitiveInfo('Contact: 1234-5678-9012')).toBe(true);
    });

    it('should detect potential PAN numbers', () => {
      expect(containsSensitiveInfo('My PAN is ABCDE1234F')).toBe(true);
      expect(containsSensitiveInfo('ID: abcde1234f')).toBe(true);
    });

    it('should detect potential phone numbers', () => {
      expect(containsSensitiveInfo('Call me at 9876543210')).toBe(true);
      expect(containsSensitiveInfo('98765-43210 is my number')).toBe(true);
    });

    it('should return false for non-sensitive text', () => {
      expect(containsSensitiveInfo('No sensitive info here.')).toBe(false);
      expect(containsSensitiveInfo('The law says 123 items are required.')).toBe(false);
      expect(containsSensitiveInfo('Consumer Protection Act 2019')).toBe(false);
    });
  });
});
