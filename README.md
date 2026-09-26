# LegalEase AI

AI-powered legal information assistant helping people understand legal issues in simple language, with structured guidance and next steps.

## Challenge
AI for Legal Assistance & Access

## Problem Statement
Access to legal information is often hindered by complex jargon, high costs, and lack of clarity. Ordinary people struggle to understand their rights, identify the correct legal category for their issues, and know what steps to take next. This tool aims to bridge that gap by providing accessible, structured, and jargon-free legal information.

## Solution
LegalEase AI translates complex legal situations into simple, actionable information. It helps users:
- **Describe** their legal problem in plain language.
- **Identify** the likely legal category and jurisdiction.
- **Understand** the core issue and relevant legal information.
- **Explore** their potential rights and available options.
- **Follow** a clear roadmap of practical next steps.
- **Prepare** with a checklist of necessary documents.
- **Assess** the urgency of their situation to prioritize action.

## Key Features
- **Contextual AI Analysis:** Deep understanding of legal issues using Gemini 3.8 Flash.
- **Structured Roadmap:** Clear, step-by-step guidance.
- **Urgency Assessment:** Flags matters requiring immediate attention.
- **Document Checklist:** Tailored lists of evidence needed for consultations.
- **Contextual Follow-up:** Maintain a conversation to clarify specific details.
- **Authoritative Sources:** References to official government portals and legal resources.
- **Privacy First:** Automatic detection of sensitive PII (Aadhaar, PAN, etc.) and explicit warnings.

## Technology Stack
- **Frontend:** React (Vite), Tailwind CSS (v4), Lucide Icons, TypeScript.
- **Backend:** Express.js (Node.js).
- **AI Integration:** Google Gemini 3.8 Flash (Server-side).
- **Testing:** Vitest for automated unit testing.
- **Accessibility:** Radix-inspired UI patterns, semantic HTML5, and ARIA compliance.

## Environment Setup
1. Clone the repository.
2. Create a `.env` file in the root based on `.env.example`:
```env
GEMINI_API_KEY=your_actual_key_here
PORT=3000
NODE_ENV=development
```
3. Install dependencies: `npm install`
4. Run in development: `npm run dev`

## Security Practices
- **Server-Side API Keys:** The Gemini API key is managed exclusively on the server.
- **Input Sanitization:** All user inputs are trimmed and validated for length and content.
- **Rate Limiting:** Lightweight server-side rate limiting prevents request flooding.
- **Safe Error Handling:** Internal stack traces and environment details are never exposed to the client.
- **PII Protection:** Real-time warnings against entering sensitive personal identifiers.

## API Endpoint: `/api/legal/analyze`
- **Method:** POST
- **Payload:** `{ problem: string, category: string, jurisdiction: string }`
- **Response Structure:**
```json
{
  "summary": "...",
  "category": "...",
  "jurisdiction": "...",
  "clarifyingQuestions": ["..."],
  "keyFacts": ["..."],
  "legalInformation": ["..."],
  "rights": ["..."],
  "options": ["..."],
  "nextSteps": ["..."],
  "documents": ["..."],
  "urgency": "LOW|MEDIUM|HIGH|URGENT",
  "warnings": ["..."],
  "sources": [{ "title": "...", "url": "..." }],
  "disclaimer": "..."
}
```

## Testing Instructions
Run automated tests using:
```bash
npm test
```
The test suite covers:
- Core validation logic for legal problem descriptions.
- PII detection patterns for Aadhaar, PAN, and phone numbers.
- UI state transitions and error handling mocks.

## Accessibility Features
- **Semantic Structure:** Proper use of `<main>`, `<header>`, `<section>`, and `<form>` tags.
- **Form Accessibility:** All inputs have explicit labels and associated descriptions.
- **Keyboard Navigation:** Full focus management and visible focus indicators.
- **Screen Reader Support:** ARIA live regions for loading states and role-based error alerts.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewports.

## Privacy Considerations
LegalEase AI does not store user legal descriptions or personal information permanently. All analysis is session-based. Users are explicitly warned against sharing highly sensitive PII.

## Legal Disclaimer
LegalEase AI provides general legal information and is not a substitute for advice from a qualified lawyer. It does not create an advocate-client relationship. Never rely solely on AI for legal decisions. Always consult a qualified professional.

## Known Limitations
- AI may occasionally be uncertain about specific local regulations.
- The tool is focused on general legal information and cannot provide definitive legal advice or represent users in court.
