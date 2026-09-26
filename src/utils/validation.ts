export const isValidProblem = (problem: string): boolean => {
  return problem.trim().length >= 10;
};

export const containsSensitiveInfo = (text: string): boolean => {
  const sensitivePatterns = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Aadhaar (approx 12 digits, optional separators)
    /\b[A-Z]{5}\d{4}[A-Z]\b/i, // PAN (case insensitive)
    /\b\d{10}\b/, // Phone (10 digits)
    /\b\d{5}[-\s]?\d{5}\b/, // Phone (5+5 digits)
  ];
  return sensitivePatterns.some(pattern => pattern.test(text));
};
