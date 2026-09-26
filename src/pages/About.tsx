import React from 'react';
import { Shield, Target, Users, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">About LegalEase AI</h1>
      
      <div className="prose prose-slate max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Our Mission
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our mission is to bridge the gap between complex legal jargon and everyday understanding. We believe that everyone deserves to know their rights and the steps they can take when facing legal challenges, regardless of their background or financial status.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Empowerment
            </h3>
            <p className="text-slate-600">
              We empower individuals by providing them with structured information that helps them feel more confident and prepared.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Clarity
            </h3>
            <p className="text-slate-600">
              We strive for absolute clarity, translating dense legal codes into simple, actionable steps that anyone can follow.
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Who is this for?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            LegalEase AI is designed for ordinary people facing common legal issues—be it a dispute with a landlord, a consumer rights concern, or workplace challenges. While it's not a substitute for a human lawyer, it's a powerful first step in understanding the legal landscape.
          </p>
        </section>

        <section className="bg-primary/5 rounded-3xl p-10 border border-primary/10">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">A Note on Technology</h2>
          <p className="text-slate-600 leading-relaxed">
            LegalEase AI utilizes advanced generative AI models to parse information and provide structured guidance. We continuously update our knowledge base to reflect the current legal environment in India, but always recommend verifying with an official source or a qualified professional.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
