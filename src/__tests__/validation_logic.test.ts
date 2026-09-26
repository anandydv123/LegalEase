import { describe, it, expect } from 'vitest';
import { isValidProblem, MIN_PROBLEM_LENGTH, MAX_PROBLEM_LENGTH } from '../utils/validation';

describe('Validation Logic', () => {
  it('should accept valid problem length', () => {
    const validProblem = 'a'.repeat(MIN_PROBLEM_LENGTH);
    expect(isValidProblem(validProblem)).toBe(true);
  });

  it('should reject short problem', () => {
    const shortProblem = 'a'.repeat(MIN_PROBLEM_LENGTH - 1);
    expect(isValidProblem(shortProblem)).toBe(false);
  });

  it('should reject extremely long problem', () => {
    const longProblem = 'a'.repeat(MAX_PROBLEM_LENGTH + 1);
    expect(isValidProblem(longProblem)).toBe(false);
  });

  it('should reject whitespace-only problem', () => {
    expect(isValidProblem(' '.repeat(MIN_PROBLEM_LENGTH))).toBe(false);
  });
});
