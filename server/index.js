import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKey: !!process.env.GEMINI_API_KEY });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, studentContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(500).json({
      error: 'GEMINI_API_KEY not configured. Add it to your .env file.',
      reply: "⚠️ I'm not connected yet! Please add your Gemini API key to the `.env` file:\n\n```\nGEMINI_API_KEY=your_actual_key\n```\n\nGet a free key at: https://aistudio.google.com/app/apikey",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are UniSync AI, a friendly and intelligent academic assistant for college students. 
You have access to the student's real-time academic data.
Your responses should be:
- Short and actionable (2-4 sentences max unless detail is requested)
- Encouraging and supportive in tone
- Specific to their actual data (attendance percentages, deadlines, etc.)
- Formatted with emojis for readability
- Practical with concrete next steps

STUDENT DATA:
${studentContext}`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'System context: ' + systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: "Got it! I have full context on this student's academic data. Ready to help! 🎓" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini API error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      error: errorMsg,
      reply: `Sorry, I encountered an error: ${errorMsg}. Please check your API key and try again.`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 UniSync AI Server running at http://localhost:${PORT}`);
  console.log(`📊 API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing — add to .env'}`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat\n`);
});
