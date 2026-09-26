import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Scale, Shield, Info, BookOpen, Menu, X, ArrowRight } from 'lucide-react';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import About from './pages/About';
import Privacy from './pages/Privacy';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Legal Assistant', path: '/assistant' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-slate-900">LegalEase AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary" : "text-slate-600"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/assistant"
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Assessment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-base font-medium text-slate-600"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/assistant"
            className="w-full text-center px-5 py-3 text-base font-medium text-white bg-primary rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            Start Assessment
          </Link>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-50 py-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-slate-900">LegalEase AI</span>
          </Link>
          <p className="text-slate-500 max-w-sm mb-6">
            Understand your legal options in simple language. We help you prepare for professional consultations.
          </p>
          <div className="flex gap-4">
            {/* Social icons could go here */}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li><Link to="/assistant">Legal Assistant</Link></li>
            <li><Link to="/#how-it-works">How It Works</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-slate-600 text-sm">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2026 LegalEase AI. All rights reserved.</p>
        <p className="text-center md:text-right">
          LegalEase AI is for informational purposes only and is not a substitute for professional legal advice.
        </p>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans antialiased text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
