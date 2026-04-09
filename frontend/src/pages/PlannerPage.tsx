import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Check,
  Clock,
  BookOpen,
  Pencil,
  Zap,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PlannerTask, Priority } from '../data/mockData';

const priorityConfig: Record<Priority, { color: string; bg: string; label: string; dot: string }> = {
  urgent: { color: 'var(--danger)',   bg: 'var(--danger-bg)',   label: '🔴 Urgent',  dot: 'var(--danger)' },
  high:   { color: '#f97316',         bg: 'rgba(249,115,22,0.1)', label: '🟠 High',  dot: '#f97316' },
  medium: { color: 'var(--warning)',  bg: 'var(--warning-bg)',  label: '🟡 Medium', dot: 'var(--warning)' },
  low:    { color: 'var(--success)',  bg: 'var(--success-bg)',  label: '🟢 Low',    dot: 'var(--success)' },
};

const typeIcon: Record<PlannerTask['type'], React.ReactNode> = {
  class:      <BookOpen size={15} />,
  assignment: <Zap size={15} />,
  study:      <Pencil size={15} />,
  custom:     <CalendarDays size={15} />,
};

export default function PlannerPage() {
  const { plannerTasks, togglePlannerTask, addPlannerTask } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'custom' as PlannerTask['type'],
    time: '09:00',
    duration: 60,
    priority: 'medium' as Priority,
  });

  const sorted = [...plannerTasks].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.time !== b.time) return a.time.localeCompare(b.time);
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const completed = sorted.filter((t) => t.completed).length;
  const total = sorted.length;
  const completionPct = total > 0 ? (completed / total) * 100 : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addPlannerTask({ ...form, completed: false });
    setForm({ title: '', type: 'custom', time: '09:00', duration: 60, priority: 'medium' });
    setShowAddForm(false);
  };

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Planner</h1>
          <p className="page-subtitle">Auto-prioritized schedule for today</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddForm(!showAddForm)}
          id="add-task-btn"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Progress */}
      <div
        className="card animate-fade-in"
        style={{ marginBottom: 24, padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Today's Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {completed}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                {' / '}{total} tasks
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Completion</div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: completionPct >= 75 ? 'var(--success)' : completionPct >= 40 ? 'var(--warning)' : 'var(--danger)',
              }}
            >
              {completionPct.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div
            className="progress-fill"
            style={{
              width: `${completionPct}%`,
              background: completionPct >= 75
                ? 'var(--success)'
                : completionPct >= 40
                ? 'var(--warning)'
                : 'var(--gradient-primary)',
            }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="card animate-fade-in" style={{ marginBottom: 24 }}>
          <div className="card-title" style={{ marginBottom: 20 }}>
            <Plus size={18} />
            Add New Task
          </div>
          <form onSubmit={handleAddTask}>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Task Title</label>
                <input
                  className="input"
                  placeholder="e.g. Study for exam"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Type</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as PlannerTask['type'] })}
                >
                  <option value="class">Class</option>
                  <option value="assignment">Assignment</option>
                  <option value="study">Study</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Time</label>
                <input
                  type="time"
                  className="input"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <Plus size={15} /> Add to Timeline
            </button>
          </form>
        </div>
      )}

      {/* Timeline */}
      <div className="card animate-fade-in">
        <div className="card-title" style={{ marginBottom: 24 }}>
          <Clock size={18} />
          Today's Timeline
          <span
            style={{
              marginLeft: 8,
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontWeight: 400,
            }}
          >
            Current: {currentTime}
          </span>
        </div>

        <div className="timeline">
          {sorted.map((task) => {
            const cfg = priorityConfig[task.priority];
            const isPast = task.time < currentTime && !task.completed;
            return (
              <div key={task.id} className="timeline-item animate-fade-in">
                <div
                  className="timeline-dot"
                  style={{
                    background: task.completed ? 'var(--success)' : cfg.dot,
                    boxShadow: `0 0 8px ${task.completed ? 'var(--success)' : cfg.dot}60`,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: task.completed
                      ? 'var(--glass)'
                      : isPast
                      ? 'rgba(239,68,68,0.05)'
                      : cfg.bg,
                    border: `1px solid ${task.completed ? 'var(--border)' : cfg.color}28`,
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {/* Time */}
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      minWidth: 50,
                      paddingTop: 2,
                    }}
                  >
                    {task.time}
                  </div>

                  {/* Type icon */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${cfg.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cfg.color,
                      flexShrink: 0,
                    }}
                  >
                    {typeIcon[task.type]}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      }}
                    >
                      {task.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        marginTop: 4,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: cfg.color,
                          fontWeight: 600,
                        }}
                      >
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        • {task.duration} min
                      </span>
                      {isPast && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                          • Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Complete button */}
                  <button
                    onClick={() => togglePlannerTask(task.id)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: `2px solid ${task.completed ? 'var(--success)' : cfg.color}`,
                      background: task.completed ? 'var(--success)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all var(--transition-fast)',
                      color: 'white',
                    }}
                    title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed && <Check size={14} />}
                  </button>
                </div>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <CalendarDays size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>No tasks for today. Add some!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
