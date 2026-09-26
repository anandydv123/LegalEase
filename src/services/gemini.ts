import { LegalAnalysis, ChatMessage } from '../types';

// Simple in-memory cache for the current session
const analysisCache: Record<string, { data: LegalAnalysis; isDemo: boolean }> = {};
// Guard to prevent duplicate active requests
const activeRequests: Record<string, Promise<{ data: LegalAnalysis; isDemo: boolean }>> = {};

export const analyzeIssue = async (
  problem: string,
  category: string,
  jurisdiction: string,
  history: ChatMessage[] = []
): Promise<{ data: LegalAnalysis; isDemo: boolean }> => {
  const cacheKey = `${jurisdiction}-${category}-${problem.trim()}`;
  
  if (analysisCache[cacheKey]) {
    return analysisCache[cacheKey];
  }

  // If a request for this exact content is already in progress, return it
  if (cacheKey in activeRequests) {
    return activeRequests[cacheKey];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  const requestPromise = (async () => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, category, jurisdiction, history }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response from server.');
      }

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error?.message || result.message || 'Failed to analyze issue';
        throw new Error(errorMessage);
      }

      if (result.demo) {
        return { data: result.data, isDemo: true };
      }

      const finalResult = { data: result, isDemo: false };
      analysisCache[cacheKey] = finalResult;
      return finalResult;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Analysis request timed out. Please try again.');
      }
      throw err;
    } finally {
      // Clean up active request tracker
      delete activeRequests[cacheKey];
    }
  })();

  activeRequests[cacheKey] = requestPromise;
  return requestPromise;
};

export const sendMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Received non-JSON response from server.');
    }

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result.error?.message || result.message || 'Failed to send message';
      throw new Error(errorMessage);
    }

    return result.text;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Chat request timed out.');
    }
    throw err;
  }
};
