import type { Subject, Assignment } from '../data/mockData';

export interface RiskResult {
  score: number; // 0–100
  level: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  color: string;
  reasons: string[];
}

export function calculateRiskScore(
  subjects: Subject[],
  assignments: Assignment[]
): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  // --- Attendance Risk ---
  subjects.forEach((sub) => {
    const pct = (sub.attendedClasses / sub.totalClasses) * 100;
    if (pct < 60) {
      score += 30;
      reasons.push(`${sub.name}: critically low attendance (${pct.toFixed(0)}%)`);
    } else if (pct < 75) {
      score += 20;
      reasons.push(`${sub.name}: below minimum attendance (${pct.toFixed(0)}%)`);
    } else if (pct < 80) {
      score += 8;
    }
  });

  // --- Pending Assignments Risk ---
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed');
  const now = new Date();

  pendingAssignments.forEach((a) => {
    const deadline = new Date(a.deadline);
    const hoursUntil = (deadline.getTime() - now.getTime()) / 3600000;
    if (hoursUntil < 24) {
      score += 25;
      reasons.push(`"${a.title}" deadline is in less than 24 hours!`);
    } else if (hoursUntil < 72) {
      score += 12;
      reasons.push(`"${a.title}" is due soon (${Math.ceil(hoursUntil / 24)} days)`);
    } else {
      score += 5;
    }
  });

  // Clamp to 100
  score = Math.min(100, score);

  let level: RiskResult['level'];
  let label: string;
  let color: string;

  if (score <= 25) {
    level = 'low';
    label = 'On Track';
    color = '#10b981';
  } else if (score <= 50) {
    level = 'medium';
    label = 'Needs Attention';
    color = '#f59e0b';
  } else if (score <= 75) {
    level = 'high';
    label = 'At Risk';
    color = '#f97316';
  } else {
    level = 'critical';
    label = 'Critical!';
    color = '#ef4444';
  }

  return { score, level, label, color, reasons };
}

export function getAttendancePercentage(subject: Subject): number {
  return (subject.attendedClasses / subject.totalClasses) * 100;
}

export function getClassesNeeded(subject: Subject, threshold = 75): number {
  const { attendedClasses, totalClasses } = subject;
  // classes needed = (0.75 * (total + x) - attended) / 0.25 — won't be negative
  const needed = Math.ceil(
    (threshold / 100 * totalClasses - attendedClasses) / (1 - threshold / 100)
  );
  return Math.max(0, needed);
}
