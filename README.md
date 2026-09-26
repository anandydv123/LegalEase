# LegalEase AI

## Challenge
AI for Legal Assistance & Access

## Problem Statement
Access to legal information is often hindered by complex jargon, high costs, and lack of clarity. Ordinary people struggle to understand their rights, identify the correct legal category for their issues, and know what steps to take next.

## Solution
LegalEase AI is an AI-powered assistant that translates complex legal situations into simple, structured information. It helps users:
- Identify the likely legal category.
- Understand their rights and protections.
- Explore possible legal options.
- Follow a clear roadmap of next steps.
- Prepare a checklist of necessary documents.
- Assess the urgency of their situation.

## Key Features
- **AI Category Detection:** Automatically detects the area of law (Consumer, Employment, Rental, etc.).
- **Contextual Follow-up:** Asks clarifying questions to provide a more accurate assessment.
- **Structured Roadmap:** Breaks down the journey into actionable steps.
- **Document Checklist:** Dynamically generates a list of evidence needed.
- **Urgency Assessment:** Flags matters requiring immediate attention (e.g., arrests, deadlines).
- **Authoritative Sources:** Provides references to official government portals (India Code, etc.).
- **Follow-up Chat:** Maintains context for further inquiries.

## How It Works
1. **User Input:** The user describes their issue in plain language.
2. **AI Analysis:** The system identifies key facts, jurisdiction, and legal categories.
3. **Structured Response:** AI generates a comprehensive analysis across 10+ sections.
4. **Follow-up:** The user can ask further questions in the integrated chat.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, TypeScript.
- **Backend:** Express.js (Node.js).
- **AI:** Google Gemini 3.8 Flash (Server-side implementation).
- **Testing:** Vitest.

## Environment Variables
Create a `.env` file in the root:
```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

## Running the Application
```bash
npm install
npm run dev
```

## Running Tests
```bash
npm test
```

## Security & Privacy
- **Server-Side API Key:** GEMINI_API_KEY is never exposed to the client.
- **PII Protection:** Warns users against entering Aadhaar, PAN, or sensitive data.
- **No Persistence:** Conversations are session-based and not stored on the server.
- **Input Validation:** Basic checks for sensitive patterns.

## Hack 2 Skills Evaluation Alignment

| Parameter | Implementation |
|-----------|----------------|
| **Code Quality** | Clean, modular React components, typed with TypeScript, separate service layer for AI. |
| **Security** | Server-side proxy for AI calls, environment variable protection, PII warnings. |
| **Efficiency** | Lightweight dependencies, optimized prompts, immediate client-side validation. |
| **Testing** | Automated tests for validation logic and core utility functions. |
| **Accessibility** | Semantic HTML, high contrast (WCAG AA), screen-reader friendly controls, responsive design. |
| **Problem Statement Alignment** | Specifically built to improve legal access for the general public in India. |

## Legal Disclaimer
LegalEase AI provides general legal information for educational purposes. It is not a lawyer, law firm, or government authority. Always consult with a qualified legal professional for specific legal advice.
