import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  User,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateRiskScore, getAttendancePercentage } from '../utils/riskEngine';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "What should I do today?",
  "Am I at academic risk?",
  "Show my top priorities",
  "How can I improve my attendance?",
  "Motivate me to study!",
];

// Build student context string for Gemini
function buildContext(
  userName: string,
  subjects: ReturnType<typeof useApp>['subjects'],
  assignments: ReturnType<typeof useApp>['assignments'],
  gamification: ReturnType<typeof useApp>['gamification'],
  risk: ReturnType<typeof calculateRiskScore>
): string {
  const subjectStr = subjects
    .map((s) => `${s.name} (${s.code}): ${getAttendancePercentage(s).toFixed(1)}% attendance`)
    .join(', ');

  const pendingStr = assignments
    .filter((a) => a.status !== 'completed')
    .map((a) => {
      const hours = (new Date(a.deadline).getTime() - Date.now()) / 3600000;
      return `"${a.title}" (due in ${Math.ceil(hours)}h)`;
    })
    .join(', ');

  return `
Student: ${userName}
Course: B.Tech, Semester 4
Overall Attendance: ${(subjects.reduce((s, sub) => s + getAttendancePercentage(sub), 0) / subjects.length).toFixed(1)}%
Subjects & Attendance: ${subjectStr}
Pending Assignments: ${pendingStr || 'None'}
Study Streak: ${gamification.streak} days
Points: ${gamification.points}
Risk Level: ${risk.level} (Score: ${risk.score}/100)
Risk Reasons: ${risk.reasons.join('; ') || 'None'}
  `.trim();
}

export default function AIAssistantPage() {
  const { user, subjects, assignments, gamification } = useApp();
  const risk = calculateRiskScore(subjects, assignments);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hey ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your UniSync AI assistant powered by Groq.\n\nI can see your academic data and help you with:\n• Today's study plan\n• Risk assessment\n• Priority recommendations\n• Motivational advice\n\nWhat's on your mind?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Voice input setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + transcript);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError('');

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const studentContext = buildContext(
      user?.name || 'Student',
      subjects,
      assignments,
      gamification,
      risk
    );

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          studentContext,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // failed to parse json
      }

      if (!response.ok) {
        if (data && data.error) {
           throw new Error(data.error);
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response. Please check your Groq API key.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(
        errMsg === 'Failed to fetch' || errMsg.includes('Load failed')
          ? '⚠️ API server not running. Start it with: npm run dev:backend\nMake sure GROQ_API_KEY is set in .env'
          : `⚠️ AI Error: ${errMsg}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome_new',
      role: 'assistant',
      content: `Chat cleared! Ask me anything about your academics. 🎓`,
      timestamp: new Date(),
    }]);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px var(--primary-glow)',
            }}
            className="animate-float"
          >
            <Bot size={22} color="white" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.4rem' }}>
              AI Assistant
            </h1>
            <p className="page-subtitle">Powered by Groq Llama 3</p>
          </div>
        </div>
        <button className="btn-icon" onClick={clearChat} title="Clear chat">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Context Bar */}
      <div
        style={{
          padding: '10px 16px',
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 16,
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={13} style={{ color: 'var(--primary-light)' }} />
          Context-aware chat
        </span>
        <span>📊 Attendance data included</span>
        <span>📋 {assignments.filter((a) => a.status !== 'completed').length} pending tasks shared</span>
        <span style={{ color: risk.color, fontWeight: 600 }}>
          ⚡ Risk: {risk.label}
        </span>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingRight: 4,
          marginBottom: 16,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                flex: '0 0 36px',
                background:
                  msg.role === 'user'
                    ? 'var(--gradient-primary)'
                    : 'rgba(124,58,237,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
              }}
            >
              {msg.role === 'user' ? (
                <User size={16} color="white" />
              ) : (
                <Bot size={16} style={{ color: 'var(--primary-light)' }} />
              )}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: '75%' }}>
              <div className={`chat-bubble chat-bubble-${msg.role}`}>
                {msg.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: 4,
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(124,58,237,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)',
              }}
            >
              <Bot size={16} style={{ color: 'var(--primary-light)' }} />
            </div>
            <div
              className="chat-bubble chat-bubble-ai"
              style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '14px 18px' }}
            >
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--danger-bg)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.83rem',
              color: 'var(--danger)',
              whiteSpace: 'pre-line',
            }}
          >
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 12,
          flexShrink: 0,
        }}
      >
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            style={{
              padding: '6px 14px',
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--glass-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-light)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--glass)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            <Zap size={11} />
            {p}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div
        className="glass-card"
        style={{ padding: '12px', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your academics... (Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: 'auto',
            padding: '4px 0',
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-icon"
            onClick={toggleVoice}
            title={listening ? 'Stop recording' : 'Voice input'}
            style={{
              background: listening ? 'var(--danger-bg)' : 'var(--glass)',
              borderColor: listening ? 'var(--danger)' : 'var(--border)',
              color: listening ? 'var(--danger)' : 'var(--text-secondary)',
            }}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{ padding: '8px 16px', gap: 6 }}
            id="send-message-btn"
          >
            <Send size={15} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
