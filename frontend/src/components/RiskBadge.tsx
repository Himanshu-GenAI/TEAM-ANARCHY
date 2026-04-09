import type { RiskResult } from '../utils/riskEngine';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const levelConfig = {
  low: { icon: CheckCircle, label: 'On Track 🎯', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  medium: { icon: AlertCircle, label: 'Needs Attention ⚠️', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  high: { icon: AlertTriangle, label: 'At Risk 🔥', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  critical: { icon: XCircle, label: 'Critical! 🚨', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

interface Props {
  risk: RiskResult;
  compact?: boolean;
}

export default function RiskBadge({ risk, compact = false }: Props) {
  const cfg = levelConfig[risk.level];
  const Icon = cfg.icon;

  if (compact) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: risk.color,
        }}
      >
        <Icon size={14} />
        {risk.label}
      </div>
    );
  }

  // Gauge arc (SVG semicircle)
  const radius = 54;
  const circumference = Math.PI * radius;
  const progress = (risk.score / 100) * circumference;

  return (
    <div
      className="card"
      style={{ border: `1px solid ${cfg.border}`, background: cfg.bg }}
    >
      <div className="card-header">
        <div className="card-title">
          <Icon size={18} style={{ color: risk.color }} />
          Risk Assessment
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: risk.color,
            padding: '3px 10px',
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 'var(--radius-full)',
          }}
        >
          {cfg.label}
        </div>
      </div>

      {/* SVG Arc Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="130" height="70" viewBox="0 0 130 70">
            {/* Background arc */}
            <path
              d="M 10 65 A 55 55 0 0 1 120 65"
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 65 A 55 55 0 0 1 120 65"
              fill="none"
              stroke={risk.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              style={{ transition: 'stroke-dasharray 1.2s ease', filter: `drop-shadow(0 0 6px ${risk.color})` }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: risk.color, lineHeight: 1 }}>
              {risk.score}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/100</div>
          </div>
        </div>

        {/* Reasons */}
        <div style={{ flex: 1 }}>
          {risk.reasons.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
              ✅ Great job! Keep up the attendance and complete tasks on time.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {risk.reasons.slice(0, 3).map((r, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: risk.color, flexShrink: 0 }}>•</span>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
