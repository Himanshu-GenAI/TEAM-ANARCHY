import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Eye, EyeOff, Mail, Lock, User, Building2,
  Copy, CheckCheck, KeyRound, Zap, Calendar, BarChart3,
  Shield, ChevronRight, Sparkles, Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type Mode   = 'login' | 'signup';
type Portal = 'student' | 'admin' | 'register-uni';

/* ─────────────────────────────────────────
   Tiny particle dot
───────────────────────────────────────── */
const Dot = ({ top, left, size, delay }: { top: string; left: string; size: number; delay: string }) => (
  <div style={{
    position: 'absolute', top, left,
    width: size, height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(189,157,255,0.7) 0%, transparent 70%)',
    animation: `auth-sparkle 4s ease-in-out infinite ${delay}`,
    pointerEvents: 'none',
  }} />
);

const DOTS = [
  { top: '7%',  left: '6%',  size: 3, delay: '0s'   },
  { top: '20%', left: '22%', size: 2, delay: '0.8s' },
  { top: '42%', left: '4%',  size: 4, delay: '1.5s' },
  { top: '62%', left: '30%', size: 2, delay: '2.1s' },
  { top: '80%', left: '12%', size: 3, delay: '0.3s' },
  { top: '14%', left: '50%', size: 2, delay: '1.2s' },
  { top: '35%', left: '38%', size: 3, delay: '2.7s' },
  { top: '70%', left: '55%', size: 2, delay: '0.5s' },
];

const FEATURES = [
  { icon: <Zap size={17} />,       label: 'AI-Powered Insights',  desc: 'Smart academic recommendations' },
  { icon: <Calendar size={17} />,  label: 'Smart Planner',         desc: 'Deadline tracking & scheduling' },
  { icon: <BarChart3 size={17} />, label: 'Real-Time Analytics',   desc: 'Performance at a glance'        },
];

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function FieldIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#6b6480', display: 'flex' }}>
      {icon}
    </div>
  );
}

function FieldLabel({ text }: { text: string }) {
  return (
    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#8a8299', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {text}
    </label>
  );
}

function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement> & { extraRight?: number }) {
  const { extraRight, style: _ignore, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        width: '100%',
        padding: `11px 16px 11px 40px`,
        paddingRight: extraRight ?? 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        color: '#ebe1fe',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.88rem',
        outline: 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
      }}
      onFocus={e => {
        e.target.style.borderColor = '#7c3aed';
        e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.2)';
        e.target.style.background = 'rgba(124,58,237,0.06)';
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.target.style.borderColor = 'rgba(255,255,255,0.08)';
        e.target.style.boxShadow = 'none';
        e.target.style.background = 'rgba(255,255,255,0.04)';
        props.onBlur?.(e);
      }}
    />
  );
}

function PrimaryBtn({ loading, icon, label }: { loading: boolean; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '13px',
        background: loading ? 'rgba(124,58,237,0.45)' : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
        border: 'none',
        borderRadius: 10,
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 700,
        fontSize: '0.88rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: loading ? 'none' : '0 4px 22px rgba(124,58,237,0.45)',
        transition: 'all 0.2s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        if (!loading) {
          const el = e.currentTarget;
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = '0 8px 30px rgba(124,58,237,0.55)';
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = loading ? 'none' : '0 4px 22px rgba(124,58,237,0.45)';
      }}
    >
      {loading
        ? [0, 1, 2].map(i => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'white', display: 'inline-block', animation: `auth-typing 1.4s infinite ${i * 0.2}s` }} />
          ))
        : <>{icon} {label}</>
      }
    </button>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 9, color: '#f87171', fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span>⚠</span> {msg}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode]               = useState<Mode>('login');
  const [portal, setPortal]           = useState<Portal>('student');
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('dhruv@unisync.ai');
  const [password, setPassword]       = useState('demo123');
  const [showPass, setShowPass]       = useState(false);
  const [joinCode, setJoinCode]       = useState('TECH2026');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [uniName, setUniName]         = useState('');
  const [uniEmail, setUniEmail]       = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied]           = useState(false);

  const { login, loginAdmin, signupStudent } = useApp();
  const navigate = useNavigate();

  const switchPortal = (p: Portal) => {
    setPortal(p);
    setError('');
    setGeneratedCode('');
    setEmail(p === 'admin' ? 'admin@tech.edu' : 'dhruv@unisync.ai');
  };

  const handleUniRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!uniName.trim() || !uniEmail.trim()) { setError('Both fields are required.'); return; }
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:3001/api/university/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniName, email: uniEmail }),
      });
      const data = await res.json();
      if (data.success) setGeneratedCode(data.data.joinCode);
      else setError(data.message || 'Registration failed.');
    } catch {
      setError('Could not reach the backend. Is the server running on port 3001?');
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
      if (!email.includes('@')) { setError('Enter a valid admin email.'); return; }
      setLoading(true);
      const result = await loginAdmin(email);
      setLoading(false);
      if (result.success) navigate('/admin-dashboard');
      else setError(result.message || 'Login failed.');
      return;
    }

    if (mode === 'signup' && !name.trim())     { setError('Please enter your name.');             return; }
    if (mode === 'signup' && !joinCode.trim()) { setError('University Join Code is required.');   return; }
    if (!email.includes('@'))                  { setError('Enter a valid email address.');         return; }
    if (password.length < 6)                   { setError('Password must be at least 6 chars.');  return; }

    setLoading(true);
    if (mode === 'signup') {
      const result = await signupStudent(name, email, joinCode);
      setLoading(false);
      if (result.success) navigate('/dashboard');
      else setError(result.message || 'Signup failed. Check your join code.');
      return;
    }
    await new Promise(r => setTimeout(r, 900));
    login(email, name || 'Dhruv Bhardwaj', joinCode);
    setLoading(false);
    navigate('/dashboard');
  };

  /* ═══════════════ LEFT PANEL CONTENT ═══════════════ */
  const leftContent = () => {
    if (portal === 'admin') return (
      <div style={{ animation: 'auth-fadein 0.5s ease both' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', marginBottom: 18 }}>
          ✦ Celestial Curator Protocol
        </p>
        <h2 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)', fontWeight: 800, lineHeight: 1.18, color: '#ebe1fe', letterSpacing: '-0.025em', marginBottom: 16 }}>
          The Nexus of<br />
          <span className="auth-gradient-text">Academic Intelligence.</span>
        </h2>
        <p style={{ color: '#9892b0', fontSize: '0.87rem', lineHeight: 1.75, marginBottom: 30 }}>
          Access the administrative core of UniSync AI. Manage network nodes, curate datasets, and oversee the sync of global research.
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          {[{ val: '99.9%', lbl: 'UPTIME' }, { val: '2.4ms', lbl: 'LATENCY' }].map(s => (
            <div key={s.lbl}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ebe1fe', letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: '0.65rem', color: '#6b6480', letterSpacing: '0.12em', marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    );

    if (portal === 'register-uni') return (
      <div style={{ animation: 'auth-fadein 0.5s ease both' }}>
        <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', marginBottom: 18 }}>
          ✦ The Celestial Curator Protocol
        </p>
        <h2 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.4rem)', fontWeight: 800, lineHeight: 1.18, color: '#ebe1fe', letterSpacing: '-0.025em', marginBottom: 16 }}>
          Sync Your<br />
          <span className="auth-gradient-text">Institution</span>
        </h2>
        <p style={{ color: '#9892b0', fontSize: '0.87rem', lineHeight: 1.75, marginBottom: 30 }}>
          Establish a secure node within the UniSync AI network. Onboard your students and faculty to a decentralised academic ecosystem.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3].map(i => <Star key={i} size={13} fill="#7c3aed" color="#7c3aed" />)}
          </div>
          <span style={{ color: '#9892b0', fontSize: '0.8rem' }}>
            <strong style={{ color: '#ebe1fe' }}>140+ Universities</strong> currently in the sync cycle
          </span>
        </div>
      </div>
    );

    /* Student */
    return (
      <div style={{ animation: 'auth-fadein 0.5s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.28)', borderRadius: 999, marginBottom: 22 }}>
          <Sparkles size={11} color="#a78bfa" />
          <span style={{ fontSize: '0.68rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI-Powered Platform</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.5rem)', fontWeight: 800, lineHeight: 1.18, color: '#ebe1fe', letterSpacing: '-0.025em', marginBottom: 10 }}>
          Welcome to<br />
          <span className="auth-gradient-text">UniSync AI</span>
        </h2>
        <p style={{ color: '#9892b0', fontSize: '0.87rem', lineHeight: 1.7, marginBottom: 28 }}>
          Your Smart Academic Command Center
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {FEATURES.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(59,130,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ebe1fe', marginBottom: 1 }}>{f.label}</div>
                <div style={{ fontSize: '0.73rem', color: '#6b6480' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex' }}>
            {['#a78bfa', '#60a5fa', '#818cf8'].map((c, i) => (
              <div key={c} style={{ width: 26, height: 26, borderRadius: '50%', background: c, border: '2px solid #100b1f', marginLeft: i > 0 ? -8 : 0 }} />
            ))}
          </div>
          <span style={{ color: '#9892b0', fontSize: '0.79rem' }}>
            <strong style={{ color: '#ebe1fe' }}>10,000+ students</strong> commanding their future
          </span>
        </div>
      </div>
    );
  };

  /* ═══════════════ RIGHT PANEL FORM ═══════════════ */
  const rightForm = () => {
    /* Register University */
    if (portal === 'register-uni') {
      if (generatedCode) return (
        <div style={{ animation: 'auth-fadein 0.4s ease both', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16,185,129,0.6)' }} />
            <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Sync Protocol Initialised</span>
          </div>
          <div style={{ padding: '20px 22px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 13, marginBottom: 14 }}>
            <p style={{ fontSize: '0.72rem', color: '#6b6480', marginBottom: 10 }}>Your unique join code:</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 900, letterSpacing: '0.14em', color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
                {generatedCode}
              </span>
              <button onClick={copyCode} style={{ background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(124,58,237,0.28)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 600 }}>
                {copied ? <><CheckCheck size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#6b6480', lineHeight: 1.6, marginTop: 10 }}>
              Share this code with students to join <strong style={{ color: '#ebe1fe' }}>{uniName}</strong>.
            </p>
          </div>
          <button onClick={() => { setGeneratedCode(''); setUniName(''); setUniEmail(''); }} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600 }}>
            + Register another university
          </button>
        </div>
      );

      return (
        <form onSubmit={handleUniRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'auth-fadein 0.4s ease both' }}>
          <div>
            <FieldLabel text="University Name" />
            <div style={{ position: 'relative' }}>
              <FieldIcon icon={<Building2 size={15} />} />
              <AuthInput id="uni-name" type="text" placeholder="e.g. Creative Institute of Tech" value={uniName} onChange={e => setUniName(e.target.value)} />
            </div>
          </div>
          <div>
            <FieldLabel text="Official University Email" />
            <div style={{ position: 'relative' }}>
              <FieldIcon icon={<Mail size={15} />} />
              <AuthInput id="uni-email" type="email" placeholder="admin@university.edu" value={uniEmail} onChange={e => setUniEmail(e.target.value)} />
            </div>
          </div>
          {error && <ErrorMsg msg={error} />}
          <PrimaryBtn loading={loading} icon={<Building2 size={15} />} label="Generate Join Code ✦" />
        </form>
      );
    }

    /* Admin */
    if (portal === 'admin') return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'auth-fadein 0.4s ease both' }}>
        <div style={{ padding: '13px 15px', background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 11, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <Shield size={17} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c4b5fd', marginBottom: 3 }}>Restricted Access</div>
            <div style={{ fontSize: '0.77rem', color: '#9892b0', lineHeight: 1.55 }}>
              This portal is strictly for authorised UniSync AI administrative personnel.
            </div>
          </div>
        </div>
        <div>
          <FieldLabel text="Administrator Email" />
          <div style={{ position: 'relative' }}>
            <FieldIcon icon={<Mail size={15} />} />
            <AuthInput id="admin-email" type="email" placeholder="admin@unisync.ai" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        {error && <ErrorMsg msg={error} />}
        <PrimaryBtn loading={loading} icon={<ChevronRight size={15} />} label="Request Access →" />
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b6480', padding: '3px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.06)' }}>
            Protocol Active
          </span>
          <div style={{ fontSize: '0.68rem', color: '#3d3652', marginTop: 6 }}>System monitored by Sentinel v4.2</div>
        </div>
      </form>
    );

    /* Student */
    return (
      <div style={{ animation: 'auth-fadein 0.4s ease both' }}>
        {/* Login / Signup toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 22, border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['login', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '9px', borderRadius: 7,
                background: mode === m ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
                color: mode === m ? 'white' : '#6b6480',
                border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.875rem',
                transition: 'all 0.2s',
                fontFamily: 'Inter, sans-serif',
                boxShadow: mode === m ? '0 3px 12px rgba(124,58,237,0.35)' : 'none',
              }}
            >
              {m === 'login' ? 'Login' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <>
              <div>
                <FieldLabel text="Full Name" />
                <div style={{ position: 'relative' }}>
                  <FieldIcon icon={<User size={15} />} />
                  <AuthInput id="student-name" type="text" placeholder="Dhruv Bhardwaj" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div>
                <FieldLabel text="University Join Code" />
                <div style={{ position: 'relative' }}>
                  <FieldIcon icon={<KeyRound size={15} />} />
                  <AuthInput
                    id="join-code"
                    type="text"
                    placeholder="e.g. LNCT9656"
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' } as React.CSSProperties}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <FieldLabel text="Academic Email" />
            <div style={{ position: 'relative' }}>
              <FieldIcon icon={<Mail size={15} />} />
              <AuthInput id="student-email" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <FieldLabel text="Secure Password" />
            <div style={{ position: 'relative' }}>
              <FieldIcon icon={<Lock size={15} />} />
              <AuthInput id="student-password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} extraRight={44} />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6480', display: 'flex', padding: 4 }}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.79rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9892b0', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#7c3aed', width: 13, height: 13 }} />
                Remember session
              </label>
              <span style={{ color: '#8b5cf6', cursor: 'pointer', fontWeight: 600 }}>Forgot Password?</span>
            </div>
          )}

          {error && <ErrorMsg msg={error} />}
          <div style={{ marginTop: 4 }}>
            <PrimaryBtn loading={loading} icon={<Sparkles size={15} />} label={mode === 'login' ? 'Enter Dashboard' : 'Create Account'} />
          </div>
        </form>

        {mode === 'login' && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '0.67rem', color: '#3d3652', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>AUTHORIZED SINGLE SIGN-ON</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {['G', 'M', '✦'].map((lbl, i) => (
                <button key={i} style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#9892b0', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#4a4360', marginTop: 14 }}>
          🧪 Demo: <span style={{ color: '#8b5cf6' }}>student@unisync.ai</span> / sync2024
        </p>
      </div>
    );
  };

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .auth-gradient-text {
          background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes auth-blob {
          0%,100% { transform: translate(0,0) scale(1);        }
          33%      { transform: translate(30px,-20px) scale(1.06); }
          66%      { transform: translate(-18px,14px) scale(0.97);  }
        }
        @keyframes auth-sparkle {
          0%,100% { opacity: 0.25; transform: translateY(0) scale(1);   }
          50%      { opacity: 0.9;  transform: translateY(-9px) scale(1.4); }
        }
        @keyframes auth-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes auth-typing {
          0%,60%,100% { transform: translateY(0);    opacity: 0.4; }
          30%          { transform: translateY(-6px); opacity: 1;   }
        }

        .auth-portal-tab:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #c4b5fd !important;
        }
        .auth-sso-btn:hover {
          background: rgba(124,58,237,0.12) !important;
          border-color: rgba(124,58,237,0.35) !important;
          color: #a78bfa !important;
        }
      `}</style>

      {/* ── Full-screen container ── */}
      <div style={{ minHeight: '100vh', width: '100%', background: '#0d0b1a', display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* Background blobs */}
        <div style={{ position: 'fixed', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 68%)', top: -180, left: -120, animation: 'auth-blob 16s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 68%)', bottom: -150, right: -100, animation: 'auth-blob 20s ease-in-out infinite reverse', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)', top: '45%', left: '45%', animation: 'auth-blob 24s ease-in-out infinite 4s', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── TWO-COLUMN SPLIT (full viewport) ── */}
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

          {/* ══ LEFT PANEL (38%) ══ */}
          <div style={{
            width: '38%',
            flexShrink: 0,
            background: 'linear-gradient(160deg, #130f26 0%, #0e0c1f 55%, #0a0b1a 100%)',
            padding: 'clamp(32px, 5vw, 56px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}>
            {/* Inner glow accents */}
            <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.22) 0%, transparent 65%)', top: -60, left: -80, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)', bottom: -50, right: -40, pointerEvents: 'none' }} />

            {/* Sparkle particles */}
            {DOTS.map((d, i) => <Dot key={i} {...d} />)}

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.55)', flexShrink: 0 }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ebe1fe', letterSpacing: '-0.01em' }}>UniSync AI</span>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {leftContent()}
            </div>
          </div>

          {/* ══ RIGHT PANEL (62%) ══ */}
          <div style={{
            flex: 1,
            background: '#0d0b1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(24px, 4vw, 48px)',
          }}>
            <div style={{
              width: '100%',
              maxWidth: 500,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 18,
              padding: 'clamp(28px, 4vw, 44px)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}>

              {/* Portal switcher */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 26 }}>
                {([
                  { id: 'student',      emoji: '🎓', label: 'Student' },
                  { id: 'admin',        emoji: '🔧', label: 'Admin' },
                  { id: 'register-uni', emoji: '🏛️', label: 'Register Uni' },
                ] as { id: Portal; emoji: string; label: string }[]).map(p => (
                  <button
                    key={p.id}
                    className="auth-portal-tab"
                    onClick={() => switchPortal(p.id)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 8,
                      background: portal === p.id
                        ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                        : 'rgba(255,255,255,0.03)',
                      color: portal === p.id ? 'white' : '#5c5473',
                      border: portal === p.id ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, sans-serif',
                      boxShadow: portal === p.id ? '0 4px 16px rgba(124,58,237,0.38)' : 'none',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>

              {/* Form heading */}
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ebe1fe', marginBottom: 5, letterSpacing: '-0.01em' }}>
                  {portal === 'student'
                    ? (mode === 'login' ? 'Welcome back' : 'Create your account')
                    : portal === 'admin'
                    ? 'Admin Terminal'
                    : 'Register Your University'}
                </h1>
                <p style={{ fontSize: '0.81rem', color: '#6b6480' }}>
                  {portal === 'student'
                    ? (mode === 'login' ? 'Sign in to access your academic command center.' : 'Join the UniSync AI network today.')
                    : portal === 'admin'
                    ? 'Secure authentication required to proceed.'
                    : 'Get a unique join code to share with your students.'}
                </p>
              </div>

              {/* Dynamic form */}
              {rightForm()}

              {/* Footer */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: '0.67rem', color: '#2e2844' }}>© 2025 UniSync AI</span>
                <div style={{ display: 'flex', gap: 14 }}>
                  {['Privacy', 'Terms', 'Research Access'].map(l => (
                    <span key={l} style={{ fontSize: '0.67rem', color: '#2e2844', cursor: 'pointer' }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
