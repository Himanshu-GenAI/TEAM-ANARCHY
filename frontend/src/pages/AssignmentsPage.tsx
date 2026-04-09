import { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Filter,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Assignment, Priority } from '../data/mockData';

type Filter = 'all' | 'pending' | 'in-progress' | 'completed';

const priorityConfig: Record<Priority, { badge: string; color: string }> = {
  urgent: { badge: 'badge-urgent', color: 'var(--danger)' },
  high:   { badge: 'badge-urgent', color: '#f97316' },
  medium: { badge: 'badge-medium', color: '#60a5fa' },
  low:    { badge: 'badge-success', color: 'var(--success)' },
};

function formatDeadline(iso: string) {
  const deadline = new Date(iso);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const hours = diff / 3600000;
  const days = diff / 86400000;

  if (hours < 0) return { label: 'Overdue', color: 'var(--danger)', icon: true };
  if (hours < 24) return { label: `${Math.ceil(hours)}h left`, color: 'var(--danger)', icon: true };
  if (days < 4) return { label: `${Math.ceil(days)}d left`, color: 'var(--warning)', icon: false };
  return {
    label: deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    color: 'var(--text-muted)',
    icon: false,
  };
}

export default function AssignmentsPage() {
  const { assignments, completeAssignment, gamification } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = assignments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const pending = assignments.filter((a) => a.status === 'pending').length;
  const completed = assignments.filter((a) => a.status === 'completed').length;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Track deadlines and earn points</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              color: '#f59e0b',
              fontWeight: 600,
            }}
          >
            <Trophy size={15} />
            {gamification.points} pts
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total', value: assignments.length, color: 'var(--primary-light)' },
          { label: 'Pending', value: pending, color: 'var(--warning)' },
          { label: 'Completed', value: completed, color: 'var(--success)' },
        ].map((s) => (
          <div
            key={s.label}
            className="card card-sm"
            style={{ flex: 1, textAlign: 'center', padding: '14px' }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          background: 'var(--glass)',
          padding: 6,
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          width: 'fit-content',
        }}
      >
        {(['all', 'pending', 'in-progress', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              background: filter === f ? 'var(--gradient-primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.825rem',
              fontWeight: 600,
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No assignments in this category.</p>
          </div>
        ) : (
          filtered.map((a) => <AssignmentCard key={a.id} assignment={a} onComplete={completeAssignment} />)
        )}
      </div>
    </div>
  );
}

function AssignmentCard({
  assignment: a,
  onComplete,
}: {
  assignment: Assignment;
  onComplete: (id: string) => void;
}) {
  const { label, color, icon } = formatDeadline(a.deadline);
  const cfg = priorityConfig[a.priority];
  const isDone = a.status === 'completed';

  return (
    <div
      className="card animate-fade-in"
      style={{
        opacity: isDone ? 0.65 : 1,
        borderLeft: `3px solid ${isDone ? 'var(--success)' : cfg.color}`,
      }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Checkbox */}
        <button
          onClick={() => !isDone && onComplete(a.id)}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `2px solid ${isDone ? 'var(--success)' : 'var(--border-strong)'}`,
            background: isDone ? 'var(--success)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDone ? 'default' : 'pointer',
            flexShrink: 0,
            marginTop: 2,
            transition: 'all var(--transition-fast)',
            color: 'white',
          }}
        >
          {isDone && <CheckCircle size={15} />}
        </button>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            <div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textDecoration: isDone ? 'line-through' : 'none',
                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                }}
              >
                {a.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {a.subject} · {a.subjectCode}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'flex-start' }}>
              <span className={`badge ${cfg.badge}`} style={{ textTransform: 'capitalize' }}>
                {a.priority}
              </span>
              {isDone ? (
                <span className="badge badge-success">✅ Done (+50 pts)</span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.8rem',
                    color,
                    fontWeight: 600,
                  }}
                >
                  {icon && <AlertTriangle size={13} />}
                  <Clock size={13} />
                  {label}
                </span>
              )}
            </div>
          </div>

          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {a.description}
          </p>

          {!isDone && (
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                🏆 +{a.points} pts on completion
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onComplete(a.id)}
                id={`complete-${a.id}`}
              >
                <CheckCircle size={14} />
                Mark Complete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
