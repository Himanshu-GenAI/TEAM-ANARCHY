import type { Assignment, Notification, Subject } from '../data/mockData';

export function generateNotifications(
  subjects: Subject[],
  assignments: Assignment[]
): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  // Rule 1: Deadline < 24h → urgent alert
  assignments
    .filter((a) => a.status !== 'completed')
    .forEach((a) => {
      const deadline = new Date(a.deadline);
      const hoursLeft = (deadline.getTime() - now.getTime()) / 3600000;
      if (hoursLeft > 0 && hoursLeft < 24) {
        notifications.push({
          id: `notif-deadline-${a.id}`,
          type: 'urgent',
          title: '⏰ Assignment Due Very Soon!',
          message: `"${a.title}" is due in ${Math.ceil(hoursLeft)} hours. Act now!`,
          timestamp: now.toISOString(),
          read: false,
        });
      } else if (hoursLeft > 0 && hoursLeft < 72) {
        notifications.push({
          id: `notif-soon-${a.id}`,
          type: 'warning',
          title: '📅 Assignment Due Soon',
          message: `"${a.title}" is due in ${Math.ceil(hoursLeft / 24)} days.`,
          timestamp: now.toISOString(),
          read: false,
        });
      }
    });

  // Rule 2: Attendance < 75% → warning
  subjects.forEach((sub) => {
    const pct = (sub.attendedClasses / sub.totalClasses) * 100;
    if (pct < 75) {
      notifications.push({
        id: `notif-attendance-${sub.id}`,
        type: 'warning',
        title: '📉 Low Attendance Warning',
        message: `${sub.name}: ${pct.toFixed(1)}% — below the 75% minimum threshold.`,
        timestamp: now.toISOString(),
        read: false,
      });
    }
  });

  // Rule 3: Pending tasks > 3 → productivity alert
  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  if (pendingCount >= 3) {
    notifications.push({
      id: 'notif-productivity',
      type: 'info',
      title: '📋 High Task Load',
      message: `You have ${pendingCount} pending tasks. Visit the Planner to organize your day.`,
      timestamp: now.toISOString(),
      read: false,
    });
  }

  return notifications;
}

export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}
