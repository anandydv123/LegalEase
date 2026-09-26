export interface LegalAnalysis {
  summary: string;
  category: string;
  jurisdiction: string;
  clarifyingQuestions?: string[];
  keyFacts?: string[];
  legalInformation?: string[];
  rights?: string[];
  options?: string[];
  nextSteps?: string[];
  documents?: string[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  warnings?: string[];
  sources?: { title: string; url: string }[];
  disclaimer: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface AssessmentState {
  problem: string;
  category: string;
  jurisdiction: string;
  analysis: LegalAnalysis | null;
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  history: ChatMessage[];
}
