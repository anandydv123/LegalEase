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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "Consumer Rights",
  "Employment / Workplace",
  "Rental / Landlord-Tenant",
  "Family / Personal Matters",
  "Cyber Crime / Online Fraud",
  "Banking / Financial",
  "Property",
  "Traffic / Motor Vehicles",
  "Criminal Matters",
  "Civil Disputes",
  "Government Services",
  "Digital Privacy / Data",
  "Education",
  "Other"
];

const Assistant = () => {
  const [problem, setProblem] = useState('');
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setHistory([]);

    try {
      const { data, isDemo: demoMode } = await analyzeIssue(problem, category, jurisdiction);
      setAnalysis(data);
      setIsDemo(demoMode);
      
      // If there are clarifying questions, add them to chat history
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
    } catch (err) {
      setError('Failed to send message. Please try again.');
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
    `;
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Assistant</h1>
          <p className="text-slate-600">Describe your issue to get structured information and next steps.</p>
        </div>

        {/* Input Form */}
        {!analysis && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Jurisdiction</label>
                  <select 
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Legal Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option>Let AI detect the category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Describe Your Legal Issue</label>
                <textarea 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="Describe your legal issue in your own words. Avoid sharing sensitive IDs like Aadhaar or PAN numbers."
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>
                  <strong>Privacy Notice:</strong> Do not enter passwords, OTPs, bank details, or government IDs. Your information is processed for analysis purposes only.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="px-6 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Clear
                </button>
                <button 
                  type="submit"
                  disabled={!problem.trim()}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  Analyze My Issue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Analyzing Your Case...</h3>
              <p className="text-slate-500">Detecting category and identifying key facts.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4 text-red-800">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <div className="flex-grow">
              <h3 className="font-bold">Analysis Error</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={handleAnalyze} className="px-4 py-2 bg-white border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50">
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Urgency and Demo Banner */}
            <div className="flex flex-col gap-4">
              {isDemo && (
                <div className="bg-amber-100 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-900">
                  <Info className="h-5 w-5" />
                  <span className="text-sm font-medium">DEMO MODE: This response is for demonstration purposes only.</span>
                </div>
              )}
              
              <div className={cn(
                "p-6 rounded-2xl border flex items-center justify-between",
                analysis.urgency === 'URGENT' ? "bg-red-50 border-red-200 text-red-900" :
                analysis.urgency === 'HIGH' ? "bg-orange-50 border-orange-200 text-orange-900" :
                "bg-blue-50 border-blue-200 text-blue-900"
              )}>
                <div className="flex items-center gap-4">
                  <Clock className="h-6 w-6" />
                  <div>
                    <h3 className="font-bold">Urgency Level: {analysis.urgency}</h3>
                    <p className="text-sm opacity-80">Assessment based on your provided details.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => window.print()} className="p-2 hover:bg-black/5 rounded-lg transition-colors"><Printer className="h-5 w-5" /></button>
                   <button onClick={handleCopy} className="p-2 hover:bg-black/5 rounded-lg transition-colors"><Copy className="h-5 w-5" /></button>
                   <button onClick={handleClear} className="p-2 hover:bg-black/5 rounded-lg transition-colors text-red-600"><Trash2 className="h-5 w-5" /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Analysis Sections */}
              <div className="lg:col-span-2 space-y-6">
                <Section title="What I Understand" icon={<Scale className="h-5 w-5" />}>
                  <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
                </Section>

                {analysis.keyFacts && analysis.keyFacts.length > 0 && (
                  <Section title="Key Facts Identified" icon={<CheckCircle2 className="h-5 w-5" />}>
                    <ul className="space-y-2">
                      {analysis.keyFacts.map((fact, i) => (
                        <li key={i} className="text-sm text-slate-600 flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <Section title="General Legal Information" icon={<BookOpen className="h-5 w-5" />}>
                  <ul className="space-y-3">
                    {analysis.legalInformation?.map((info, i) => (
                      <li key={i} className="flex gap-3 text-slate-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {info}
                      </li>
                    ))}
                  </ul>
                </Section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Section title="Rights & Protections" icon={<Shield className="h-5 w-5" />}>
                    <ul className="space-y-3">
                      {analysis.rights?.map((r, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Section>
                  <Section title="Possible Options" icon={<Zap className="h-5 w-5" />}>
                    <ul className="space-y-3">
                      {analysis.options?.map((o, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>

                <Section title="Recommended Next Steps" icon={<ChevronRight className="h-5 w-5" />}>
                   <div className="space-y-4">
                    {analysis.nextSteps?.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0 tabular-nums">
                          {i + 1}
                        </div>
                        <p className="text-slate-600 pt-1">{step}</p>
                      </div>
                    ))}
                   </div>
                </Section>

                {analysis.warnings && analysis.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 font-bold text-amber-900 mb-4">
                      <AlertTriangle className="h-5 w-5" />
                      Important Warnings
                    </h3>
                    <ul className="space-y-2">
                      {analysis.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-amber-800 flex gap-2">
                          <span className="shrink-0">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Checklist & Sources */}
              <div className="space-y-6">
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
                            className="text-sm text-primary hover:underline flex items-center gap-2"
                          >
                            <BookOpen className="h-3 w-3" />
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                   <h3 className="font-bold mb-2 text-sm">Disclaimer</h3>
                   <p className="text-[10px] leading-relaxed opacity-70">
                     {analysis.disclaimer}
                   </p>
                </div>
              </div>
            </div>

            {/* Follow-up Chat */}
            <div className="border-t border-slate-200 pt-12">
               <div className="flex items-center gap-2 mb-6">
                 <MessageSquare className="h-6 w-6 text-primary" />
                 <h2 className="text-2xl font-bold">Follow-up Questions</h2>
               </div>

               <div className="bg-slate-50 rounded-2xl border border-slate-200 flex flex-col h-[500px]">
                  <div className="flex-grow overflow-y-auto p-6 space-y-4">
                    {history.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-12">
                        <MessageSquare className="h-12 w-12 mb-2" />
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
                      <div className="bg-white border border-slate-200 text-slate-700 self-start mr-auto rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!chatInput.trim() || chatLoading}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </form>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default Assistant;
