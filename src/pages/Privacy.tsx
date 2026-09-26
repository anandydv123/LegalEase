import React from 'react';
import { ShieldCheck, Eye, Lock, RefreshCw } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none space-y-10">
        <section className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl flex items-start gap-4">
          <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-emerald-900 mb-2 mt-0">Your Privacy is Paramount</h2>
            <p className="text-emerald-800 text-sm mb-0">
              LegalEase AI is built with privacy-first principles. We do not store your personal legal descriptions or conversations on our servers once your session is closed.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Lock className="h-6 w-6 text-primary" />
            Data Handling
          </h2>
          <p className="text-slate-600 leading-relaxed">
            When you use our Legal Assistant, the text you enter is sent to our AI processing partner (Google Gemini) for analysis. We do not request and strongly advise against entering any sensitive personal identifiers such as:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {[
              "Aadhaar or PAN numbers",
              "Bank account or card details",
              "Passwords or OTPs",
              "Sensitive private messages",
              "Exact addresses",
              "Phone numbers"
            ].map((item, i) => (
              <li key={i} className="bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 text-sm text-slate-700 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Eye className="h-6 w-6 text-primary" />
            Information Usage
          </h2>
          <p className="text-slate-600 leading-relaxed">
            The information you provide is used solely to:
          </p>
          <ul className="space-y-4 list-disc pl-6 text-slate-600">
            <li>Analyze your legal situation and provide structured information.</li>
            <li>Detect the relevant legal category.</li>
            <li>Generate a personalized document checklist.</li>
            <li>Maintain session-based follow-up conversations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-primary" />
            Policy Updates
          </h2>
          <p className="text-slate-600 leading-relaxed">
            We may update this policy periodically to reflect changes in our technology or legal requirements. We encourage you to review this page whenever you use the service.
          </p>
        </section>

        <div className="pt-10 border-t border-slate-200 text-slate-500 text-sm">
          Last updated: September 2026
        </div>
      </div>
    </div>
  );
};

export default Privacy;
