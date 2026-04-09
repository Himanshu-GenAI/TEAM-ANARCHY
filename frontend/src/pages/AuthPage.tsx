import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, Sparkles, Mail, Lock, User, Building2, Copy, CheckCheck, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

type Mode = 'login' | 'signup';
type Portal = 'student' | 'admin' | 'register-uni';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [portal, setPortal] = useState<Portal>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('dhruv@unisync.ai');
  const [password, setPassword] = useState('demo123');
  const [showPass, setShowPass] = useState(false);
  const [joinCode, setJoinCode] = useState('TECH2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // University registration state
  const [uniName, setUniName] = useState('');
  const [uniEmail, setUniEmail] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const { login, loginAdmin, signupStudent } = useApp();
  const navigate = useNavigate();

  const switchPortal = (p: Portal) => {
    setPortal(p);
    setError('');
    setGeneratedCode('');
    setEmail(p === 'admin' ? 'admin@tech.edu' : 'dhruv@unisync.ai');
  };

  // University registration via real backend
  const handleUniRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!uniName.trim() || !uniEmail.trim()) {
      setError('University name and email are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/university/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniName, email: uniEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCode(data.data.joinCode);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch {
      setError('Could not reach the backend. Make sure the server is running on port 3001.');
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (portal === 'admin') {
      if (!email.includes('@')) { setError('Please enter a valid admin email.'); return; }
      setLoading(true);
      const result = await loginAdmin(email);
      setLoading(false);
      if (result.success) {
        navigate('/admin-dashboard');
      } else {
        setError(result.message || 'Login failed.');
      }
      return;
    }

    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return; }
    if (mode === 'signup' && !joinCode.trim()) { setError('University Join Code is required.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);

    if (mode === 'signup') {
      // Real signup — saves student to MongoDB
      const result = await signupStudent(name, email, joinCode);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Signup failed. Check your join code and try again.');
      }
      return;
    }

    // Login — demo local auth
    await new Promise((r) => setTimeout(r, 900));
    login(email, name || 'Dhruv Bhardwaj', joinCode);
    setLoading(false);
    navigate('/dashboard');
  };

  const inputIcon = (icon: React.ReactNode) => ({
    position: 'absolute' as const,
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-dark)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: Math.random() * 4 + 2, height: Math.random() * 4 + 2, borderRadius: '50%', background: 'var(--primary-light)', opacity: 0.4, top: `${20 + i * 13}%`, left: `${10 + i * 15}%`, animation: `float ${3 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
      ))}

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }} className="animate-fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 40px var(--primary-glow)' }} className="animate-float">
            <GraduationCap size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>
            Welcome to <span className="text-gradient">UniSync AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Smart Academic Command Center</p>
        </div>

        {/* Portal Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {([
            { id: 'student', label: '🎓 Student', },
            { id: 'admin', label: '🔧 Admin', },
            { id: 'register-uni', label: '🏛️ Register University', },
          ] as { id: Portal; label: string }[]).map((p) => (
            <button
              key={p.id}
              onClick={() => switchPortal(p.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 10,
                background: portal === p.id ? 'var(--gradient-primary)' : 'var(--glass)',
                color: portal === p.id ? 'white' : 'var(--text-muted)',
                border: portal === p.id ? 'none' : '1px solid var(--border)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                transition: 'all var(--transition-fast)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 32 }}>

          {/* ── REGISTER UNIVERSITY ── */}
          {portal === 'register-uni' && (
            <>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={20} style={{ color: 'var(--primary-light)' }} /> Register Your University
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                Get a unique join code to share with your students.
              </p>

              {!generatedCode ? (
                <form onSubmit={handleUniRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="input-group">
                    <label className="input-label">University Name</label>
                    <div style={{ position: 'relative' }}>
                      <Building2 size={16} style={inputIcon(null)} />
                      <input type="text" className="input" placeholder="e.g. LNCT University" value={uniName} onChange={(e) => setUniName(e.target.value)} style={{ paddingLeft: 40 }} required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Official Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={inputIcon(null)} />
                      <input type="email" className="input" placeholder="admin@university.edu" value={uniEmail} onChange={(e) => setUniEmail(e.target.value)} style={{ paddingLeft: 40 }} required />
                    </div>
                  </div>
                  {error && <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '13px' }} disabled={loading}>
                    {loading ? <><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></> : <><Building2 size={16} /> Generate Join Code</>}
                  </button>
                </form>
              ) : (
                /* Success — show generated join code */
                <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                  <div style={{ padding: 24, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>🎉 University Registered! Your unique join code is:</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--primary-light)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
                      {generatedCode}
                    </div>
                    <button onClick={copyCode} className="btn btn-primary" style={{ margin: '0 auto', gap: 8 }}>
                      {copied ? <><CheckCheck size={16} /> Copied!</> : <><Copy size={16} /> Copy Code</>}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Share this code with your students. They will use it during sign up to join <strong style={{ color: 'var(--text-primary)' }}>{uniName}</strong>.
                  </p>
                  <button onClick={() => { setGeneratedCode(''); setUniName(''); setUniEmail(''); }} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    + Register another university
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── STUDENT / ADMIN FORMS ── */}
          {portal !== 'register-uni' && (
            <>
              {/* Student mode toggle */}
              {portal === 'student' && (
                <div style={{ display: 'flex', background: 'var(--glass)', borderRadius: 'var(--radius-md)', padding: 4, marginBottom: 24, border: '1px solid var(--border)' }}>
                  {(['login', 'signup'] as Mode[]).map((m) => (
                    <button key={m} onClick={() => { setMode(m); setError(''); }}
                      style={{ flex: 1, padding: '9px', borderRadius: 8, background: mode === m ? 'var(--gradient-primary)' : 'transparent', color: mode === m ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)' }}>
                      {m === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              )}

              {portal === 'admin' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, marginBottom: 20 }}>
                  <KeyRound size={18} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Admin access is restricted to authorised university staff.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {portal === 'student' && mode === 'signup' && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <div style={{ position: 'relative' }}>
                        <User size={16} style={inputIcon(null)} />
                        <input type="text" className="input" placeholder="Dhruv Bhardwaj" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: 40 }} />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">University Join Code</label>
                      <div style={{ position: 'relative' }}>
                        <KeyRound size={16} style={inputIcon(null)} />
                        <input type="text" className="input" placeholder="e.g. LNCT9656" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} style={{ paddingLeft: 40, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }} />
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-label">Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={inputIcon(null)} />
                    <input type="email" className="input" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={inputIcon(null)} />
                    <input type={showPass ? 'text' : 'password'} className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</div>}

                <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 4, justifyContent: 'center', padding: '13px' }} disabled={loading}>
                  {loading
                    ? <><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></>
                    : <><Sparkles size={16} />{portal === 'admin' ? 'Enter Admin Panel' : mode === 'login' ? 'Enter Dashboard' : 'Create Account'}</>
                  }
                </button>
              </form>

              {portal === 'student' && (
                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16 }}>
                  🧪 Demo: Email pre-filled. Just click <strong style={{ color: 'var(--primary-light)' }}>Enter Dashboard</strong>
                </p>
              )}
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 20 }}>
          B.Tech AIML · UniSync AI v2.0 · Powered by Gemini + MongoDB
        </p>
      </div>
    </div>
  );
}
