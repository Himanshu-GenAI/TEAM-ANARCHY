import { useState } from 'react';
import {
  Bell,
  ClipboardList,
  AlertTriangle,
  Flame,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateRiskScore, getAttendancePercentage } from '../utils/riskEngine';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import NotificationPanel from '../components/NotificationPanel';
import DarkModeToggle from '../components/DarkModeToggle';
import { getUnreadCount } from '../utils/notifications';

export default function DashboardPage() {
  const { user, subjects, assignments, notifications, gamification, announcements } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  const risk = calculateRiskScore(subjects, assignments);
  const unread = getUnreadCount(notifications);
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed');
  const overallAttendance =
    subjects.reduce((sum, s) => sum + getAttendancePercentage(s), 0) / subjects.length;

  const chartData = subjects.map((s) => ({
    name: s.code,
    fullName: s.name,
    attendance: Math.round(getAttendancePercentage(s)),
    color: s.color,
  }));

  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ position: 'relative' }}>
      <div className="blob blob-1" style={{ opacity: 0.06 }} />
      <div className="blob blob-2" style={{ opacity: 0.06 }} />

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <DarkModeToggle />
          <div style={{ position: 'relative' }}>
            <button
              className="btn-icon"
              style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }}
              onClick={() => setShowNotifs(true)}
              id="notif-toggle-btn"
            >
              <Bell size={18} />
            </button>
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid stagger">
        <StatCard
          title="Overall Attendance"
          value={`${overallAttendance.toFixed(1)}%`}
          icon={<Users size={18} />}
          trend={overallAttendance >= 75 ? 'up' : 'down'}
          trendLabel={overallAttendance >= 75 ? 'Above threshold' : 'Below 75% ⚠️'}
          accentColor={overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)'}
          iconColor={overallAttendance >= 75 ? 'var(--success)' : 'var(--danger)'}
          delay={0}
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments.length}
          icon={<ClipboardList size={18} />}
          subtitle={`${pendingAssignments.filter(a => {
            const h = (new Date(a.deadline).getTime() - Date.now()) / 3600000;
            return h < 24;
          }).length} due within 24h`}
          accentColor="var(--warning)"
          iconColor="var(--warning)"
          delay={100}
        />
        <StatCard
          title="Study Streak"
          value={`${gamification.streak} Days`}
          icon={<Flame size={18} />}
          trend="up"
          trendLabel="Keep it up! 🔥"
          accentColor="#f97316"
          iconColor="#f97316"
          delay={200}
        />
        <StatCard
          title="Total Points"
          value={gamification.points}
          icon={<Star size={18} />}
          subtitle={gamification.level}
          accentColor="#f59e0b"
          iconColor="#f59e0b"
          delay={300}
        />
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="animate-fade-in" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map((ann) => (
             <div key={ann.id} style={{ padding: 16, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
               <div style={{ padding: 8, background: 'var(--primary)', color: 'white', borderRadius: 8 }}><Bell size={18} /></div>
               <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary-light)', marginBottom: 4 }}>{ann.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ann.message}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>{new Date(ann.date).toLocaleDateString()} • by {ann.author}</p>
               </div>
             </div>
          ))}
        </div>
      )}

      {/* Middle Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Risk Assessment */}
        <RiskBadge risk={risk} />

        {/* Pending Assignments */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ClipboardList size={18} />
              Pending Assignments
            </div>
            <span className="badge badge-warning">{pendingAssignments.length} pending</span>
          </div>
          {pendingAssignments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
              🎉 All assignments completed!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendingAssignments.map((a) => {
                const hoursLeft = (new Date(a.deadline).getTime() - Date.now()) / 3600000;
                const isUrgent = hoursLeft < 24;
                const daysLeft = Math.ceil(hoursLeft / 24);
                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      padding: '12px',
                      background: isUrgent ? 'var(--danger-bg)' : 'var(--glass)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: isUrgent ? 'var(--danger)' : 'var(--warning)',
                        flexShrink: 0,
                        marginTop: 5,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {a.subject}
                      </div>
                    </div>
                    <span className={`badge ${isUrgent ? 'badge-urgent' : 'badge-warning'}`}>
                      {isUrgent ? 'Due Tomorrow!' : `${daysLeft}d left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="card animate-fade-in">
        <div className="card-header">
          <div className="card-title">
            <TrendingUp size={18} />
            Subject-wise Attendance
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--danger)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--danger)', display: 'inline-block' }} />
              At Risk (&lt;75%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--success)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)', display: 'inline-block' }} />
              Safe (≥75%)
            </span>
          </div>
        </div>

        {/* Subject attendance cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {subjects.map((s) => {
            const pct = getAttendancePercentage(s);
            const isLow = pct < 75;
            return (
              <div key={s.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</span>
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s.code}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {isLow && <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />}
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: isLow ? 'var(--danger)' : pct < 80 ? 'var(--warning)' : 'var(--success)',
                      }}
                    >
                      {pct.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {s.attendedClasses}/{s.totalClasses}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${isLow ? 'progress-fill-danger' : pct < 80 ? 'progress-fill-warning' : 'progress-fill-success'}`}
                    style={{ width: `${pct}%`, background: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bar Chart */}
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
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
                  fontSize: 13,
                }}
                formatter={(value: any, _name: any, props: any) => [
                  `${value}%`,
                  props.payload.fullName,
                ]}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.attendance < 75 ? 'var(--danger)' : entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <Star size={18} style={{ color: '#f59e0b' }} />
            Your Badges & Achievements
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {gamification.level}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {gamification.badges.map((badge) => (
            <div
              key={badge}
              style={{
                padding: '8px 16px',
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary-light)',
              }}
            >
              {badge}
            </div>
          ))}
          <div
            style={{
              padding: '8px 16px',
              background: 'var(--glass)',
              border: '1px dashed var(--border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            + Complete more tasks to unlock
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Progress to next level
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
              {gamification.points} / 500 pts
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill progress-fill-primary"
              style={{ width: `${(gamification.points / 500) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifs && (
        <NotificationPanel onClose={() => setShowNotifs(false)} />
      )}
    </div>
  );
}
