import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, HelpCircle, FileText, Scale } from 'lucide-react';

const Home = () => {
  const features = [
    {
      title: "Category Detection",
      description: "AI automatically identifies the legal area relevant to your problem.",
      icon: <SearchIcon className="h-6 w-6" />,
    },
    {
      title: "Structured Analysis",
      description: "Get organized information on rights, options, and recommended next steps.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Document Guidance",
      description: "Receive a personalized checklist of documents you may need to collect.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 py-24 md:py-32">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Understand Your Legal Options — <span className="text-primary">In Simple Language.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
              LegalEase AI helps you navigate legal information, organize your next steps, and prepare the right questions for a qualified professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/assistant"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Start Legal Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                How It Works
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Private & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Image / Decorative Element */}
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0 w-1/3 h-4/5 rounded-l-3xl overflow-hidden shadow-2xl">
          <img 
            src="/src/assets/images/hero_legal_ease_1790426058431.jpg" 
            alt="Law Library" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="container mx-auto px-6">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="flex items-start gap-4">
              <HelpCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Important Disclaimer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  LegalEase AI provides general legal information for educational and informational purposes. It is not a lawyer, law firm, court, or government authority and does not create an advocate-client relationship. Always consult with a qualified legal professional for specific legal advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Our AI assistant guides you through a structured process to clarify your situation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
               <img 
                src="/src/assets/images/feature_legal_analysis_1790426070015.jpg" 
                alt="AI Analysis" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Expert Guidance, Accessible to Everyone</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Legal terminology can be overwhelming. We break down complex concepts into actionable steps, helping you understand what to ask and what documents to gather before you meet with a lawyer.
              </p>
              <ul className="space-y-4">
                {[
                  "Clear, jargon-free explanations",
                  "Personalized next steps roadmap",
                  "Urgency assessment for timely action",
                  "Preparation for legal consultations"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="h-5 w-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="h-3 w-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to understand your options?</h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of people who have found clarity and direction with LegalEase AI.
          </p>
          <Link
            to="/assistant"
            className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary bg-white rounded-2xl hover:bg-slate-50 transition-all shadow-xl"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const SearchIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default Home;
