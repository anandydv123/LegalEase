import { describe, it, expect } from 'vitest';

const requiredFields = ["summary", "category", "jurisdiction", "urgency", "disclaimer"];

const validateResponseSchema = (data: any) => {
  for (const field of requiredFields) {
    if (data[field] === undefined) return false;
  }
  if (!Array.isArray(data.rights)) return false;
  if (!Array.isArray(data.options)) return false;
  if (!Array.isArray(data.nextSteps)) return false;
  return true;
};

describe('Response Schema Validation', () => {
  it('should accept valid schema', () => {
    const validData = {
      summary: 'test',
      category: 'General',
      jurisdiction: 'India',
      urgency: 'LOW',
      disclaimer: 'test',
      rights: [],
      options: [],
      nextSteps: []
    };
    expect(validateResponseSchema(validData)).toBe(true);
  });

  it('should reject missing required field', () => {
    const invalidData = {
      summary: 'test',
      category: 'General'
      // missing jurisdiction
    };
    expect(validateResponseSchema(invalidData)).toBe(false);
  });

  it('should reject invalid types for arrays', () => {
    const invalidData = {
      summary: 'test',
      category: 'General',
      jurisdiction: 'India',
      urgency: 'LOW',
      disclaimer: 'test',
      rights: 'not an array'
    };
    expect(validateResponseSchema(invalidData)).toBe(false);
  });
});
