import { LegalAnalysis, ChatMessage } from '../types';

export const analyzeIssue = async (
  problem: string,
  category: string,
  jurisdiction: string,
  history: ChatMessage[] = []
): Promise<{ data: LegalAnalysis; isDemo: boolean }> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, category, jurisdiction, history }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.error === 'DEMO_MODE') {
      return { data: errorData.demoData, isDemo: true };
    }
    throw new Error(errorData.message || 'Failed to analyze issue');
  }

  const data = await response.json();
  return { data, isDemo: false };
};

export const sendMessage = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  return data.text;
};
