import { X, Bell, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Notification } from '../data/mockData';

const typeConfig = {
  urgent: { icon: '🔴', label: 'Urgent', color: 'var(--danger)' },
  warning: { icon: '🟡', label: 'Warning', color: 'var(--warning)' },
  info: { icon: '🔵', label: 'Info', color: 'var(--info)' },
  success: { icon: '🟢', label: 'Success', color: 'var(--success)' },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: Props) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-panel animate-slide-right">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={20} style={{ color: 'var(--primary-light)' }} />
          <h3 style={{ fontSize: '1rem' }}>Notifications</h3>
          {unread > 0 && (
            <span
              style={{
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {unread} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unread > 0 && (
            <button
              className="btn-icon"
              onClick={markAllNotificationsRead}
              title="Mark all read"
            >
              <CheckCheck size={16} />
            </button>
          )}
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Bell size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotifItem
              key={notif.id}
              notif={notif}
              onRead={markNotificationRead}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NotifItem({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) {
  const cfg = typeConfig[notif.type];
  return (
    <div
      className={`notif-item ${!notif.read ? 'unread' : ''}`}
      onClick={() => onRead(notif.id)}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{cfg.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            {notif.title}
          </div>
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            {notif.message}
          </div>
          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: 6,
            }}
          >
            {timeAgo(notif.timestamp)}
          </div>
        </div>
        {!notif.read && (
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: cfg.color,
              flexShrink: 0,
              marginTop: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}
