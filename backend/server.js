import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// DB + Routes
import connectDB from './config/db.js';
import universityRoutes from './routes/universityRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Load .env from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'] }));
app.use(express.json());

// ──────────────────────────────────────────────
// Multi-University Routes
// ──────────────────────────────────────────────
app.use('/api/university', universityRoutes);
app.use('/api/student', studentRoutes);

// ──────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiKey: !!process.env.GEMINI_API_KEY });
});

// ──────────────────────────────────────────────
// Gemini AI Chat Endpoint (preserved)
// ──────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, studentContext } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(500).json({
      error: 'GEMINI_API_KEY not configured.',
      reply: "⚠️ I'm not connected yet! Please add your Gemini API key to the `.env` file.",
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

// ──────────────────────────────────────────────
// 404 Handler
// ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 UniSync AI Server running at http://localhost:${PORT}`);
  console.log(`🗄️  MongoDB: ${process.env.MONGODB_URI ? '✅ URI set' : '❌ Missing MONGODB_URI in .env'}`);
  console.log(`📊 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`\n📌 Available Endpoints:`);
  console.log(`   POST   /api/university/register`);
  console.log(`   GET    /api/university/:id/students`);
  console.log(`   POST   /api/student/join`);
  console.log(`   GET    /api/student/:id`);
  console.log(`   POST   /api/chat`);
  console.log(`   GET    /api/health\n`);
});
