import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, Bell, Hash, RefreshCw, UserCheck, BookOpen } from 'lucide-react';

interface RealStudent {
  _id: string;
  name: string;
  email: string;
  universityId: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user, postAnnouncement, announcements } = useApp();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [students, setStudents] = useState<RealStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const uniDbId = user?.universityDbId || user?.universityId;

  const fetchStudents = async (showRefresh = false) => {
    if (!uniDbId) return;
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/university/${uniDbId}/students`);
      const data = await res.json();
      if (data.success) setStudents(data.data);
    } catch {
      console.error('Failed to fetch students');
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [uniDbId]);

  const submitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && message.trim()) {
      postAnnouncement(title, message);
      setTitle('');
      setMessage('');
    }
  };

  const totalStudents = students.length;
  // Since we don't store attendance in MongoDB yet, we group them by join date
  const recentStudents = [...students].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            Admin Dashboard
            <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: 20 }}>
              {user?.name}
            </span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              University management panel · Live MongoDB data
            </p>
            {user?.joinCode && (
              <span style={{ padding: '3px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 20, fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Hash size={12} /> Join Code: <strong>{user.joinCode}</strong>
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchStudents(true)}
          style={{ padding: '8px 14px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 12 }}><Users size={22} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Students</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{loading ? '—' : totalStudents}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 12 }}><Bell size={22} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Announcements</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{announcements.length}</div>
          </div>
        </div>
        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: 12 }}><UserCheck size={22} /></div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recently Joined</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {loading ? '—' : students.filter(s => {
                const d = new Date(s.createdAt);
                return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Left: Student List ── */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BookOpen size={18} style={{ color: 'var(--primary-light)' }} /> Enrolled Students
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'var(--glass)', padding: '2px 8px', borderRadius: 10, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {totalStudents} total
            </span>
          </h3>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          ) : students.length === 0 ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p style={{ fontSize: '0.9rem' }}>No students have joined yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Share your join code: <strong style={{ color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>{user?.joinCode}</strong></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto' }}>
              {recentStudents.map((s) => (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--glass)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.email}</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, textAlign: 'right' }}>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Announcements ── */}
        <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Bell size={18} style={{ color: 'var(--primary-light)' }} /> Broadcast Announcement
          </h3>
          <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text" className="input" placeholder="Announcement title..."
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
            <textarea
              className="input" style={{ minHeight: 90, resize: 'vertical' }}
              placeholder="Message to all students..."
              value={message} onChange={(e) => setMessage(e.target.value)} required
            />
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Send size={15} /> Broadcast
            </button>
          </form>

          {announcements.length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', flex: 1, overflowY: 'auto', maxHeight: 220 }}>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>RECENT ANNOUNCEMENTS</h4>
              {announcements.map(ann => (
                <div key={ann.id} style={{ padding: '10px 12px', background: 'var(--glass)', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>{ann.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ann.message}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{new Date(ann.date).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
