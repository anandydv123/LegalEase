import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Clock, 
  BookOpen, 
  MessageSquare,
  Printer,
  Copy,
  Trash2,
  RefreshCw,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import { analyzeIssue, sendMessage } from '../services/gemini';
import { LegalAnalysis, ChatMessage } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LEGAL_CATEGORIES, JURISDICTIONS } from '../constants';
import { isValidProblem, containsSensitiveInfo } from '../utils/validation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Assistant = () => {
  const [problem, setProblem] = useState('');
  const [showPiiWarning, setShowPiiWarning] = useState(false);
  const [category, setCategory] = useState('Let AI detect the category');
  const [jurisdiction, setJurisdiction] = useState('India');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    setShowPiiWarning(containsSensitiveInfo(problem));
  }, [problem]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setHistory([]);

    try {
      const { data, isDemo: demoMode } = await analyzeIssue(problem, category, jurisdiction);
      setAnalysis(data);
      setIsDemo(demoMode);
      
      if (data.clarifyingQuestions && data.clarifyingQuestions.length > 0) {
        setHistory([
          { role: 'ai', content: "Based on your description, I need a few more details to give you a better assessment:" },
          ...data.clarifyingQuestions.map(q => ({ role: 'ai' as const, content: q }))
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    const newHistory: ChatMessage[] = [...history, { role: 'user', content: userMsg }];
    setHistory(newHistory);
    setChatLoading(true);

    try {
      const response = await sendMessage(userMsg, newHistory);
      setHistory([...newHistory, { role: 'ai', content: response }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleClear = () => {
    setProblem('');
    setAnalysis(null);
    setHistory([]);
    setError(null);
  };

  const handleCopy = () => {
    if (!analysis) return;
    const text = `
Legal Assessment Summary:
${analysis.summary}

Category: ${analysis.category}
Jurisdiction: ${analysis.jurisdiction}
Urgency: ${analysis.urgency}

Next Steps:
${analysis.nextSteps?.join('\n')}

Documents Needed:
${analysis.documents?.join('\n')}

Disclaimer: ${analysis.disclaimer}
    `;
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="container mx-auto px-6 py-12 max-w-5xl" aria-labelledby="assistant-title">
      <div className="flex flex-col gap-8">
        <header>
          <h1 id="assistant-title" className="text-3xl font-bold text-slate-900 mb-2">Legal Assistant</h1>
          <p className="text-slate-600">Describe your issue to get structured information and next steps.</p>
        </header>

        {/* Input Form */}
        {!analysis && !loading && (
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm" aria-label="Legal issue input">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jurisdiction-select" className="block text-sm font-semibold text-slate-700 mb-2">Jurisdiction</label>
                  <select 
                    id="jurisdiction-select"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    {JURISDICTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="category-select" className="block text-sm font-semibold text-slate-700 mb-2">Legal Category</label>
                  <select 
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option>Let AI detect the category</option>
                    {LEGAL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="problem-description" className="block text-sm font-semibold text-slate-700 mb-2">Describe Your Legal Issue</label>
                <textarea 
                  id="problem-description"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe your legal issue in your own words. Minimum 10 characters."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  required
                  aria-required="true"
                />
                <p className="mt-2 text-xs text-slate-500">Provide as much relevant context as possible for a better assessment.</p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                <AlertTriangle className={cn("h-5 w-5 shrink-0 transition-colors", showPiiWarning && "text-red-600 animate-pulse")} aria-hidden="true" />
                <div>
                  <p>
                    <strong>Privacy Notice:</strong> Do not enter passwords, OTPs, Aadhaar numbers, PAN numbers, bank account details, or government IDs. Your information is processed for informational analysis only.
                  </p>
                  {showPiiWarning && (
                    <p className="mt-2 text-red-700 font-bold animate-in fade-in slide-in-from-top-1">
                      ⚠️ Potential sensitive personal information detected. Please remove any IDs or contact details for your privacy.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none rounded-lg"
                >
                  Clear
                </button>
                <button 
                  type="submit"
                  disabled={problem.trim().length < 10 || loading}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                >
                  {loading ? 'Analyzing...' : 'Analyze My Issue'}
                  {!loading && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4" aria-live="polite">
            <Loader2 className="h-12 w-12 text-primary animate-spin" aria-hidden="true" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Analyzing Your Legal Issue...</h3>
              <p className="text-slate-500">Categorizing situation and identifying rights.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div 
            ref={errorRef}
            tabIndex={-1}
            className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 text-red-800 outline-none focus:ring-2 focus:ring-red-500" 
            role="alert"
          >
            <AlertTriangle className="h-6 w-6 shrink-0" aria-hidden="true" />
            <div className="flex-grow">
              <h3 className="font-bold">Error</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="px-4 py-2 bg-white border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Urgency and Demo Banner */}
            <div className="flex flex-col gap-4">
              {isDemo && (
                <div className="bg-amber-100 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-900" role="status">
                  <Info className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium">DEMO MODE: This response is for demonstration purposes only.</span>
                </div>
              )}
              
              <div className={cn(
                "p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
                analysis.urgency === 'URGENT' ? "bg-red-50 border-red-200 text-red-900" :
                analysis.urgency === 'HIGH' ? "bg-orange-50 border-orange-200 text-orange-900" :
                "bg-blue-50 border-blue-200 text-blue-900"
              )}>
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                  <div>
                    <h2 className="font-bold text-lg">Urgency Assessment: {analysis.urgency}</h2>
                    <p className="text-sm opacity-80">Based on identified facts and potential deadlines.</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <button 
                    onClick={() => window.print()} 
                    className="flex-1 md:flex-none p-3 bg-white/50 hover:bg-white border border-black/5 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
                    aria-label="Print assessment"
                   >
                    <Printer className="h-5 w-5 mx-auto" />
                   </button>
                   <button 
                    onClick={handleCopy} 
                    className="flex-1 md:flex-none p-3 bg-white/50 hover:bg-white border border-black/5 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 outline-none"
                    aria-label="Copy assessment to clipboard"
                   >
                    <Copy className="h-5 w-5 mx-auto" />
                   </button>
                   <button 
                    onClick={handleClear} 
                    className="flex-1 md:flex-none p-3 bg-white/50 hover:bg-white border border-black/5 rounded-xl transition-colors text-red-600 focus-visible:ring-2 focus-visible:ring-red-400 outline-none"
                    aria-label="Clear session and start over"
                   >
                    <Trash2 className="h-5 w-5 mx-auto" />
                   </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Analysis Sections */}
              <div className="lg:col-span-2 space-y-6">
                <Section title="Issue Summary" icon={<Scale className="h-5 w-5" />}>
                  <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
                </Section>

                {analysis.keyFacts && analysis.keyFacts.length > 0 && (
                  <Section title="Key Facts Identified" icon={<CheckCircle2 className="h-5 w-5" />}>
                    <ul className="space-y-2">
                      {analysis.keyFacts.map((fact, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-primary font-bold" aria-hidden="true">•</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Section title="Relevant Legal Information" icon={<BookOpen className="h-5 w-5" />}>
                  <ul className="space-y-3">
                    {analysis.legalInformation?.map((info, i) => (
                      <li key={i} className="flex gap-3 text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" aria-hidden="true" />
                        {info}
                      </li>
                    ))}
                  </ul>
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Section title="Your Rights" icon={<Shield className="h-5 w-5" />}>
                    <ul className="space-y-3">
                      {analysis.rights?.map((r, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Section>
                  <Section title="Available Options" icon={<Zap className="h-5 w-5" />}>
                    <ul className="space-y-3">
                      {analysis.options?.map((o, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>

                <Section title="Actionable Next Steps" icon={<ChevronRight className="h-5 w-5" />}>
                   <ol className="space-y-4">
                    {analysis.nextSteps?.map((step, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 tabular-nums" aria-hidden="true">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 pt-1">{step}</p>
                      </li>
                    ))}
                   </ol>
                </Section>

                {analysis.warnings && analysis.warnings.length > 0 && (
                  <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6" aria-labelledby="warnings-title">
                    <h3 id="warnings-title" className="flex items-center gap-2 font-bold text-amber-900 mb-4">
                      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      Important Warnings
                    </h3>
                    <ul className="space-y-2">
                      {analysis.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-amber-800 flex gap-2">
                          <span className="shrink-0" aria-hidden="true">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Right Column: Checklist & Sources */}
              <aside className="space-y-6">
                <Section title="Document Checklist" icon={<FileText className="h-5 w-5" />}>
                  <div className="space-y-2">
                    {analysis.documents?.map((doc, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-slate-700">{doc}</span>
                      </label>
                    ))}
                    {(!analysis.documents || analysis.documents.length === 0) && (
                      <p className="text-sm text-slate-400 italic">No specific documents identified.</p>
                    )}
                  </div>
                </Section>

                {analysis.sources && analysis.sources.length > 0 && (
                  <Section title="Sources & References" icon={<Search className="h-5 w-5" />}>
                    <ul className="space-y-3">
                      {analysis.sources.map((s, i) => (
                        <li key={i}>
                          <a 
                            href={s.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary outline-none rounded"
                          >
                            <BookOpen className="h-3 w-3" aria-hidden="true" />
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                   <h3 className="font-bold mb-2 text-sm">Legal Disclaimer</h3>
                   <p className="text-[10px] leading-relaxed opacity-70">
                     {analysis.disclaimer}
                   </p>
                </div>
              </aside>
            </div>

            {/* Follow-up Chat */}
            <section className="border-t border-slate-200 pt-12" aria-labelledby="chat-title">
               <div className="flex items-center gap-2 mb-6">
                 <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />
                 <h2 id="chat-title" className="text-2xl font-bold">Follow-up Questions</h2>
               </div>

               <div className="bg-slate-50 rounded-2xl border border-slate-200 flex flex-col h-[500px]">
                  <div className="flex-grow overflow-y-auto p-6 space-y-4" role="log" aria-live="polite">
                    {history.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-12">
                        <MessageSquare className="h-12 w-12 mb-2" aria-hidden="true" />
                        <p className="text-sm">Ask any follow-up questions about the assessment or next steps.</p>
                      </div>
                    )}
                    {history.map((msg, i) => (
                      <div key={i} className={cn(
                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-primary text-white self-end ml-auto rounded-tr-none" 
                          : "bg-white border border-slate-200 text-slate-700 self-start mr-auto rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-white border border-slate-200 text-slate-700 self-start mr-auto rounded-2xl rounded-tl-none p-4 max-w-[80%] flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />
                        <span className="text-xs text-slate-400">Assistant is typing...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
                    <div className="flex gap-2">
                      <label htmlFor="chat-input" className="sr-only">Ask a question</label>
                      <input 
                        id="chat-input"
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                        disabled={chatLoading}
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                      >
                        Send
                      </button>
                    </div>
                  </form>
               </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
      <div className="text-primary" aria-hidden="true">{icon}</div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </section>
);

export default Assistant;
