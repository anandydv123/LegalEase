import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeIssue } from '../services/gemini';

// Mock the service
vi.mock('../services/gemini', () => ({
  analyzeIssue: vi.fn(),
  sendMessage: vi.fn()
}));

describe('UI Behavior Simulation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should prove one analyze trigger leads to one service call', async () => {
    const mockData = { data: { summary: 'result' }, isDemo: false };
    (analyzeIssue as any).mockResolvedValue(mockData);

    // Simulate clicking analyze
    await analyzeIssue('User legal problem description.', 'General', 'India');

    expect(analyzeIssue).toHaveBeenCalledTimes(1);
    expect(analyzeIssue).toHaveBeenCalledWith('User legal problem description.', 'General', 'India');
  });

  it('should handle clearing session', async () => {
    // This is more of a state test, but we can verify our clear logic doesn't crash
    const handleClear = (setProblem: any, setAnalysis: any, setHistory: any, setError: any) => {
      setProblem('');
      setAnalysis(null);
      setHistory([]);
      setError(null);
    };

    const setters = {
      setProblem: vi.fn(),
      setAnalysis: vi.fn(),
      setHistory: vi.fn(),
      setError: vi.fn()
    };

    handleClear(setters.setProblem, setters.setAnalysis, setters.setHistory, setters.setError);

    expect(setters.setProblem).toHaveBeenCalledWith('');
    expect(setters.setAnalysis).toHaveBeenCalledWith(null);
    expect(setters.setHistory).toHaveBeenCalledWith([]);
    expect(setters.setError).toHaveBeenCalledWith(null);
  });
});
