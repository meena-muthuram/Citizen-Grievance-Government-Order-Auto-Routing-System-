import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Citizen AI Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { message, language = 'en', complaintContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getAI();
  if (!ai) {
    // Graceful fallback response when API key is not yet set
    return res.json({
      reply: `Namaste! I am LokSeva Citizen AI Assistant. To assist you regarding: "${message}":
- If you have an urgent civic complaint (e.g. pothole, water leak, garbage), use the "File Citizen Complaint" tab.
- You can track past status under "Track Status".
- Check resolution times under "Service Level Agreement (SLA)".
Feel free to ask about any department or civic procedure!`,
    });
  }

  try {
    const systemPrompt = `You are LokSeva Citizen AI Assistant, an empathetic, official, highly knowledgeable Indian civic governance virtual officer.
You help citizens file complaints, understand administrative wards/zones, explain SLA resolution timelines (e.g., garbage collection 12h, streetlight repair 24h, water leaks 24h, pothole repair 48h), draft well-structured complaints, and track government orders.
Respond naturally in the user's selected language: ${language}.
Keep answers concise, actionable, and formatted with bullet points if helpful.
${complaintContext ? `Current complaint context: ${JSON.stringify(complaintContext)}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text || 'How can I assist your civic grievance today?' });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.json({
      reply: `Namaste! I am here to help you file and monitor your civic grievances. Please let me know the issue (e.g. water leakage, broken street lights, pothole) and your administrative ward so I can guide you.`,
    });
  }
});

// AI Smart Re-routing & Complaint Analyzer
app.post('/api/ai/analyze-complaint', async (req, res) => {
  const { title, description } = req.body;
  const ai = getAI();

  if (!ai) {
    return res.json({
      summary: `${title}: Civic concern reported.`,
      urgency: 'Medium',
      primaryCategory: 'Civic Infrastructure',
    });
  }

  try {
    const prompt = `Analyze this citizen complaint for an Indian municipal governance portal:
Title: "${title}"
Description: "${description}"

Provide a JSON output with:
{
  "summary": "1 concise sentence summary",
  "urgency": "High" | "Medium" | "Low",
  "suggestedKeywords": ["keyword1", "keyword2"],
  "departments": ["Department Name 1", "Department Name 2"],
  "estimatedSLA": "e.g. 24-48 Hours"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.json({
      summary: `${title}: Civic issue identified`,
      urgency: 'Medium',
      departments: ['Municipal Corporation'],
      estimatedSLA: '48 Hours',
    });
  }
});

// Start server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
