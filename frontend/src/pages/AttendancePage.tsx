import { useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Plus,
  Minus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { getAttendancePercentage, getClassesNeeded } from '../utils/riskEngine';
import { ATTENDANCE_HISTORY } from '../data/mockData';

export default function AttendancePage() {
  const { subjects, updateAttendance } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const overallPct =
    subjects.reduce((s, sub) => s + getAttendancePercentage(sub), 0) / subjects.length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Tracker</h1>
          <p className="page-subtitle">Monitor your attendance across all subjects</p>
        </div>
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            background: overallPct >= 75 ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: `1px solid ${overallPct >= 75 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: overallPct >= 75 ? 'var(--success)' : 'var(--danger)',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
        >
          Overall: {overallPct.toFixed(1)}%
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid-2 stagger" style={{ marginBottom: 24 }}>
        {subjects.map((sub) => {
          const pct = getAttendancePercentage(sub);
          const isLow = pct < 75;
          const needed = getClassesNeeded(sub);
          const isSelected = selectedSubject === sub.id;

          return (
            <div
              key={sub.id}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? sub.color : 'var(--border)',
                borderWidth: isSelected ? 2 : 1,
                transition: 'all var(--transition-base)',
              }}
              onClick={() => setSelectedSubject(isSelected ? null : sub.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: sub.color,
                        boxShadow: `0 0 8px ${sub.color}`,
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sub.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, marginLeft: 18 }}>
                    {sub.code} · Prof. {sub.professor}
                  </div>
                </div>
                {isLow ? (
                  <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                ) : (
                  <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                )}
              </div>

              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: isLow ? 'var(--danger)' : sub.color, lineHeight: 1 }}>
                  {pct.toFixed(1)}%
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {sub.attendedClasses} / {sub.totalClasses}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>classes</div>
                </div>
              </div>

              <div className="progress-bar" style={{ marginBottom: 12 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(100, pct)}%`, background: sub.color }}
                />
              </div>

              {/* Warning / Status */}
              <div
                style={{
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: isLow ? 'var(--danger-bg)' : 'var(--success-bg)',
                  color: isLow ? 'var(--danger)' : 'var(--success)',
                  fontWeight: 600,
                }}
              >
                {isLow
                  ? `⚠️ Attend ${needed} more class${needed !== 1 ? 'es' : ''} to reach 75%`
                  : `✅ Safe — ${(pct - 75).toFixed(1)}% above threshold`}
              </div>

              {/* Quick update buttons */}
              {isSelected && (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '1px solid var(--border)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flex: 1 }}>
                    Add today's class:
                  </span>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: 'var(--success-bg)',
                      color: 'var(--success)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      gap: 4,
                    }}
                    onClick={() => updateAttendance(sub.id, true)}
                  >
                    <Plus size={13} /> Present
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      gap: 4,
                    }}
                    onClick={() => updateAttendance(sub.id, false)}
                  >
                    <Minus size={13} /> Absent
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Trend Chart */}
      <div className="card animate-fade-in">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={18} />
            Weekly Attendance Trend
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 8 weeks</div>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ATTENDANCE_HISTORY} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="week"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[40, 100]}
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  color: 'var(--text-primary)',
                  fontSize: 12,
                }}
                formatter={(value: any) => [`${value}%`]}
              />
              <ReferenceLine
                y={75}
                stroke="var(--danger)"
                strokeDasharray="5 5"
                label={{ value: '75% Min', fill: 'var(--danger)', fontSize: 11, position: 'right' }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--text-muted)' }}
              />
              <Line type="monotone" dataKey="math" stroke="#f59e0b" name="Mathematics" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ml" stroke="#6366f1" name="ML" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ds" stroke="#10b981" name="Data Structures" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="python" stroke="#3b82f6" name="Python" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="dataSci" stroke="#ec4899" name="Data Science" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
