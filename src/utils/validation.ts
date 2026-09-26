export const isValidProblem = (problem: string): boolean => {
  return problem.trim().length >= 10;
};

export const containsSensitiveInfo = (text: string): boolean => {
  const sensitivePatterns = [
    /\b\d{12}\b/, // Aadhaar (approx)
    /\b[A-Z]{5}\d{4}[A-Z]\b/, // PAN
    /\b\d{10}\b/, // Phone (approx)
  ];
  return sensitivePatterns.some(pattern => pattern.test(text));
};
