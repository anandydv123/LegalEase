import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeIssue, sendMessage } from '../services/gemini';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Gemini Service', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should use cache for identical requests', async () => {
    const mockData = { summary: 'cached response' };
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => mockData
    });

    const res1 = await analyzeIssue('My problem is long enough.', 'General', 'India');
    expect(res1.data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const res2 = await analyzeIssue('My problem is long enough.', 'General', 'India');
    expect(res2.data).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should prevent duplicate in-flight requests', async () => {
    const mockData = { summary: 'single response' };
    let callCount = 0;
    
    fetchMock.mockImplementation(() => {
      callCount++;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            headers: new Map([['content-type', 'application/json']]),
            json: async () => mockData
          });
        }, 100);
      });
    });

    const p1 = analyzeIssue('Simultaneous problem description.', 'General', 'India');
    const p2 = analyzeIssue('Simultaneous problem description.', 'General', 'India');

    await vi.advanceTimersByTimeAsync(150);
    
    const [res1, res2] = await Promise.all([p1, p2]);

    expect(res1.data).toEqual(mockData);
    expect(res2.data).toEqual(mockData);
    expect(callCount).toBe(1);
  });

  it('should handle timeout correctly', async () => {
    fetchMock.mockImplementation((url, { signal }) => {
      return new Promise((resolve, reject) => {
        signal?.addEventListener('abort', () => {
          const err = new DOMException('Aborted', 'AbortError');
          reject(err);
        });
      });
    });

    const promise = analyzeIssue('This will time out hopefully.', 'General', 'India');
    
    await vi.advanceTimersByTimeAsync(31000);

    await expect(promise).rejects.toThrow('Analysis request timed out');
  });

  it('should NOT cache failed requests', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ error: { message: 'Failed' } })
    });

    await expect(analyzeIssue('Problem that fails.', 'General', 'India')).rejects.toThrow('Failed');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ summary: 'success' })
    });

    const res = await analyzeIssue('Problem that fails.', 'General', 'India');
    expect(res.data.summary).toBe('success');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  describe('sendMessage', () => {
    it('should send follow-up message correctly', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ text: 'AI response' })
      });

      const res = await sendMessage('Hello', []);
      expect(res).toBe('AI response');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should handle sendMessage timeout', async () => {
      fetchMock.mockImplementation((url, { signal }) => {
        return new Promise((resolve, reject) => {
          signal?.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        });
      });

      const promise = sendMessage('Wait for it...', []);
      await vi.advanceTimersByTimeAsync(21000);
      await expect(promise).rejects.toThrow('Chat request timed out');
    });
  });
});
