import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Routes
  const LEGAL_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      category: { type: Type.STRING },
      jurisdiction: { type: Type.STRING },
      clarifyingQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      keyFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
      legalInformation: { type: Type.ARRAY, items: { type: Type.STRING } },
      rights: { type: Type.ARRAY, items: { type: Type.STRING } },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
      documents: { type: Type.ARRAY, items: { type: Type.STRING } },
      urgency: { type: Type.STRING },
      warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
      sources: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING }
          }
        }
      },
      disclaimer: { type: Type.STRING }
    },
    required: ["summary", "category", "jurisdiction", "urgency", "disclaimer"]
  };

  app.post('/api/analyze', async (req, res) => {
    const { problem, category, jurisdiction } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({ 
        error: "DEMO_MODE",
        message: "API key not configured. Using demo mode.",
        demoData: getDemoResponse(category || 'General')
      });
    }

    try {
      const systemInstruction = `You are LegalEase AI, a legal information assistant for India. 
      Your purpose is to help users understand general legal information and possible next steps.
      You are NOT a lawyer. Never fabricate laws, citations, or URLs.
      If facts are missing, ask max 3-5 concise clarifying questions.
      If info is sufficient, provide the full structured analysis.
      Use simple language. Explain legal jargon.
      Prioritize safety and privacy.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: `Jurisdiction: ${jurisdiction}\nCategory: ${category}\nProblem: ${problem}` }] }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: LEGAL_RESPONSE_SCHEMA,
        },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: "ANALYSIS_FAILED", message: "Failed to analyze legal issue." });
    }
  });

  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ text: "I'm in demo mode. Please configure GEMINI_API_KEY for live follow-up." });
    }

    try {
      const chatHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
      });
      res.json({ text: response.text });
    } catch (error) {
      res.status(500).json({ error: "CHAT_FAILED" });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

function getDemoResponse(category: string) {
  return {
    summary: "It looks like you're dealing with a " + category + " issue. This is a demo response.",
    category: category,
    jurisdiction: "India",
    clarifyingQuestions: ["Have you received any formal notice?", "Do you have a written agreement?"],
    keyFacts: ["User reported an issue.", "Demo mode active."],
    legalInformation: ["In India, such matters are often governed by specific consumer or civil laws."],
    rights: ["Right to information", "Right to seek compensation"],
    options: ["Send a formal notice", "File a complaint in the appropriate forum"],
    nextSteps: ["Collect all evidence", "Consult a legal professional"],
    documents: ["Invoice", "Contract", "Correspondence"],
    urgency: "MEDIUM",
    warnings: ["Limitation periods may apply. Act promptly."],
    sources: [{ title: "National Consumer Helpline", url: "https://consumerhelpline.gov.in/" }],
    disclaimer: "LegalEase AI provides general info. This is NOT legal advice."
  };
}

startServer();

