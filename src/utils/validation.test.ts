import { describe, it, expect } from 'vitest';
import { isValidProblem, containsSensitiveInfo } from './validation';

describe('Validation Utils', () => {
  it('should validate problem length', () => {
    expect(isValidProblem('Too short')).toBe(false);
    expect(isValidProblem('This is a long enough description of a legal problem.')).toBe(true);
  });

  it('should detect sensitive patterns', () => {
    expect(containsSensitiveInfo('My PAN is ABCDE1234F')).toBe(true);
    expect(containsSensitiveInfo('My Aadhaar is 123456789012')).toBe(true);
    expect(containsSensitiveInfo('No sensitive info here.')).toBe(false);
  });
});
