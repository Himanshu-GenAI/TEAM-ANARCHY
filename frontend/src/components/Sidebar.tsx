import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpenCheck,
  ClipboardList,
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Flame,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getUnreadCount } from '../utils/notifications';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard',   to: '/dashboard',    icon: <LayoutDashboard size={20} /> },
  { label: 'Planner',     to: '/planner',      icon: <CalendarDays size={20} /> },
  { label: 'Attendance',  to: '/attendance',   icon: <BookOpenCheck size={20} /> },
  { label: 'Assignments', to: '/assignments',  icon: <ClipboardList size={20} /> },
  { label: 'AI Assistant',to: '/ai-assistant', icon: <Bot size={20} /> },
];

const adminNavItems: NavItem[] = [
  { label: 'Overview', to: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, notifications, gamification } = useApp();
  const navigate = useNavigate();
  const unread = getUnreadCount(notifications);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeNavItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside
      className="sidebar"
      style={{
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
      }}
    >
      {/* Decorative gradient top */}
      <div className="sidebar-glow" />

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon animate-float">
          <GraduationCap size={22} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="text-gradient" style={{ fontWeight: 800, fontSize: '1rem' }}>UniSync</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>AI COMMAND CENTER</span>
          </div>
        )}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="sidebar-user">
          <div className="avatar" style={{ width: 38, height: 38, fontSize: '0.8rem' }}>
            {user.avatar}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div className="truncate" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {user.name}
              </div>
              <div className="truncate" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {user.course} · Sem {user.semester}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Streak + Points */}
      {!collapsed && user?.role !== 'admin' && (
        <div className="sidebar-stats">
          <div className="sidebar-stat">
            <Flame size={14} style={{ color: '#f97316' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {gamification.streak}d streak
            </span>
          </div>
          <div className="sidebar-stat">
            <Star size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {gamification.points} pts
            </span>
          </div>
        </div>
      )}

      <hr className="divider" style={{ margin: '8px 16px' }} />

      {/* Navigation */}
      <nav className="sidebar-nav">
        {activeNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-nav-icon" style={{ position: 'relative' }}>
              {item.icon}
              {item.label === 'AI Assistant' && unread > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 8,
                    height: 8,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                  }}
                />
              )}
            </span>
            {!collapsed && (
              <span className="sidebar-nav-label">{item.label}</span>
            )}
            {item.label === 'Dashboard' && !collapsed && unread > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-nav-item" onClick={handleLogout} title="Logout">
          <span className="sidebar-nav-icon"><LogOut size={20} /></span>
          {!collapsed && <span className="sidebar-nav-label">Logout</span>}
        </button>
      </div>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          transition: width var(--transition-base);
          z-index: 100;
          overflow: hidden;
        }
        .sidebar-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(180deg, rgba(124,58,237,0.12) 0%, transparent 100%);
          pointer-events: none;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px 16px;
          position: relative;
          z-index: 1;
        }
        .sidebar-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 20px var(--primary-glow);
        }
        .sidebar-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          flex: 1;
          min-width: 0;
        }
        .sidebar-collapse-btn {
          margin-left: auto;
          width: 24px;
          height: 24px;
          border: none;
          background: var(--glass);
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition-fast);
        }
        .sidebar-collapse-btn:hover {
          background: var(--glass-hover);
          color: var(--text-primary);
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          overflow: hidden;
        }
        .sidebar-stats {
          display: flex;
          gap: 12px;
          padding: 8px 16px;
        }
        .sidebar-stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .sidebar-nav {
          flex: 1;
          padding: 8px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .sidebar-nav-item:hover {
          background: var(--glass);
          color: var(--text-primary);
        }
        .sidebar-nav-item.active {
          background: rgba(124,58,237,0.18);
          color: var(--primary-light);
          border: 1px solid rgba(124,58,237,0.2);
        }
        .sidebar-nav-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .sidebar-nav-label {
          flex: 1;
          text-align: left;
        }
        .sidebar-footer {
          padding: 8px;
          border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 100% !important;
            height: auto;
            bottom: 0;
            top: auto;
            flex-direction: row;
            border-right: none;
            border-top: 1px solid var(--border);
            overflow-x: auto;
          }
          .sidebar-glow,
          .sidebar-user,
          .sidebar-stats,
          .sidebar-logo-text,
          .sidebar-collapse-btn,
          .sidebar-footer { display: none !important; }
          .sidebar-logo { padding: 8px; }
          .sidebar-logo-icon { width: 32px; height: 32px; }
          .divider { display: none; }
          .sidebar-nav {
            display: flex;
            flex-direction: row;
            flex: 1;
            padding: 4px 8px;
            overflow-x: auto;
            overflow-y: hidden;
          }
          .sidebar-nav-item {
            flex-direction: column;
            padding: 8px 12px;
            font-size: 0.7rem;
            gap: 4px;
            min-width: 60px;
          }
        }
      `}</style>
    </aside>
  );
}
