// ============================================================
// Mock Data Layer — UniSync AI
// Pre-filled with demo student data (Dhruv Bhardwaj, B.Tech AIML)
// ============================================================

export type UserRole = 'student' | 'admin';

export interface University {
  id: string;
  name: string;
  joinCode: string;
}

export const UNIVERSITIES: University[] = [
  { id: 'uni_tech', name: 'Tech University', joinCode: 'TECH2026' },
  { id: 'uni_global', name: 'Global Institute of Science', joinCode: 'GLOBAL26' },
];

export const STUDENT_PROFILE = {
  id: 'student_001',
  name: 'Dhruv Bhardwaj',
  email: 'dhruv@unisync.ai',
  course: 'B.Tech AIML',
  semester: 4,
  rollNumber: '22BTAIML042',
  avatar: 'DB',
  joinedDate: '2022-08-01',
  role: 'student' as UserRole,
  universityId: 'uni_tech',
};

export const ADMIN_PROFILE = {
  id: 'admin_001',
  name: 'Tech University Admin',
  email: 'admin@tech.edu',
  course: 'Administration',
  semester: 0,
  rollNumber: 'ADMIN-01',
  avatar: 'AD',
  joinedDate: '2020-01-01',
  role: 'admin' as UserRole,
  universityId: 'uni_tech',
};

export interface Subject {
  id: string;
  name: string;
  code: string;
  professor: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
}

export const SUBJECTS: Subject[] = [
  {
    id: 'sub_001',
    name: 'Mathematics IV',
    code: 'MATH401',
    professor: 'Dr. Sharma',
    totalClasses: 40,
    attendedClasses: 27,
    color: '#f59e0b',
  },
  {
    id: 'sub_002',
    name: 'Machine Learning',
    code: 'AIML301',
    professor: 'Dr. Gupta',
    totalClasses: 38,
    attendedClasses: 31,
    color: '#6366f1',
  },
  {
    id: 'sub_003',
    name: 'Data Structures',
    code: 'CS201',
    professor: 'Prof. Verma',
    totalClasses: 42,
    attendedClasses: 33,
    color: '#10b981',
  },
  {
    id: 'sub_004',
    name: 'Python Programming',
    code: 'AIML201',
    professor: 'Dr. Mehta',
    totalClasses: 35,
    attendedClasses: 32,
    color: '#3b82f6',
  },
  {
    id: 'sub_005',
    name: 'Data Science',
    code: 'AIML302',
    professor: 'Dr. Singh',
    totalClasses: 36,
    attendedClasses: 26,
    color: '#ec4899',
  },
];

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type AssignmentStatus = 'pending' | 'in-progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  description: string;
  deadline: string; // ISO date string
  priority: Priority;
  status: AssignmentStatus;
  points: number;
}

// Tomorrow's date helper
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const in4days = new Date();
in4days.setDate(in4days.getDate() + 4);
const in7days = new Date();
in7days.setDate(in7days.getDate() + 7);

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'asgn_001',
    title: 'ML Mini Project — Sentiment Analysis',
    subject: 'Machine Learning',
    subjectCode: 'AIML301',
    description: 'Build a sentiment analysis model using LSTM on IMDB dataset. Submit Jupyter notebook + report.',
    deadline: tomorrow.toISOString(),
    priority: 'urgent',
    status: 'pending',
    points: 150,
  },
  {
    id: 'asgn_002',
    title: 'DSA Assignment #3 — Graph Algorithms',
    subject: 'Data Structures',
    subjectCode: 'CS201',
    description: 'Implement Dijkstra and BFS/DFS with complexity analysis.',
    deadline: in4days.toISOString(),
    priority: 'medium',
    status: 'pending',
    points: 80,
  },
  {
    id: 'asgn_003',
    title: 'Python Lab Report — Week 8',
    subject: 'Python Programming',
    subjectCode: 'AIML201',
    description: 'Submit completed lab exercises and analysis for Week 8.',
    deadline: in7days.toISOString(),
    priority: 'low',
    status: 'completed',
    points: 50,
  },
];

export interface PlannerTask {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'study' | 'custom';
  time: string; // Format: "HH:MM"
  duration: number; // in minutes
  priority: Priority;
  completed: boolean;
  subjectCode?: string;
}

export const PLANNER_TASKS: PlannerTask[] = [
  {
    id: 'task_001',
    title: 'Machine Learning Lecture',
    type: 'class',
    time: '09:00',
    duration: 60,
    priority: 'high',
    completed: false,
    subjectCode: 'AIML301',
  },
  {
    id: 'task_002',
    title: 'Work on ML Sentiment Analysis Project',
    type: 'assignment',
    time: '10:30',
    duration: 120,
    priority: 'urgent',
    completed: false,
    subjectCode: 'AIML301',
  },
  {
    id: 'task_003',
    title: 'Data Structures Lecture',
    type: 'class',
    time: '13:00',
    duration: 60,
    priority: 'high',
    completed: false,
    subjectCode: 'CS201',
  },
  {
    id: 'task_004',
    title: 'Review Graph Algorithms for DSA',
    type: 'study',
    time: '14:30',
    duration: 90,
    priority: 'medium',
    completed: false,
    subjectCode: 'CS201',
  },
  {
    id: 'task_005',
    title: 'Mathematics IV Self-Study (improve attendance)',
    type: 'study',
    time: '16:30',
    duration: 60,
    priority: 'medium',
    completed: false,
    subjectCode: 'MATH401',
  },
];

export interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_001',
    type: 'urgent',
    title: '⚠️ Assignment Due Tomorrow!',
    message: 'ML Mini Project (Sentiment Analysis) is due in less than 24 hours.',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'notif_002',
    type: 'warning',
    title: '📉 Low Attendance Alert',
    message: 'Mathematics IV: 67.5% — You need 13 more classes to reach 75%.',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'notif_003',
    type: 'warning',
    title: '📉 Low Attendance Alert',
    message: 'Data Science: 72.2% — You are below the 75% minimum threshold.',
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 'notif_004',
    type: 'info',
    title: '📋 Productivity Reminder',
    message: 'You have 3+ pending tasks. Check your Daily Planner to prioritize.',
    timestamp: new Date().toISOString(),
    read: false,
  },
];

export const GAMIFICATION = {
  streak: 5,
  points: 340,
  level: 'Rising Scholar',
  completedThisWeek: 3,
  badges: ['Early Bird 🌅', 'Consistent 💪', 'Tech Savvy 🤖'],
};

export const ATTENDANCE_HISTORY = [
  { week: 'Week 1', math: 80, ml: 100, ds: 100, python: 100, dataSci: 80 },
  { week: 'Week 2', math: 60, ml: 80, ds: 80, python: 100, dataSci: 80 },
  { week: 'Week 3', math: 60, ml: 80, ds: 80, python: 80, dataSci: 60 },
  { week: 'Week 4', math: 80, ml: 80, ds: 60, python: 100, dataSci: 80 },
  { week: 'Week 5', math: 60, ml: 80, ds: 80, python: 80, dataSci: 60 },
  { week: 'Week 6', math: 60, ml: 80, ds: 80, python: 80, dataSci: 80 },
  { week: 'Week 7', math: 80, ml: 80, ds: 80, python: 100, dataSci: 60 },
  { week: 'Week 8', math: 60, ml: 80, ds: 80, python: 100, dataSci: 80 },
];

export interface Announcement {
  id: string;
  universityId: string;
  title: string;
  message: string;
  date: string;
  author: string;
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    universityId: 'uni_tech',
    title: 'Mid-term Examinations Scheduled',
    message: 'The mid-term exams will begin on the 15th of next month. Ensure all assignments are submitted.',
    date: new Date().toISOString(),
    author: 'Admin',
  },
  {
    id: 'ann_2',
    universityId: 'uni_tech',
    title: 'Library Hours Extended',
    message: 'The central library will remain open 24/7 during the examination week.',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    author: 'Admin',
  }
];

export const MOCK_ALL_STUDENTS = [
  STUDENT_PROFILE,
  {
    id: 'student_002',
    name: 'Sarah Chen',
    email: 'sarah.c@tech.edu',
    course: 'B.Tech CSE',
    semester: 4,
    rollNumber: '22BTCSE015',
    avatar: 'SC',
    joinedDate: '2022-08-01',
    role: 'student' as UserRole,
    universityId: 'uni_tech',
    overallAttendance: 88,
    gpa: 3.8,
  },
  {
    id: 'student_003',
    name: 'Michael Rodriguez',
    email: 'm.rodriguez@tech.edu',
    course: 'B.Tech ECE',
    semester: 4,
    rollNumber: '22BTECE089',
    avatar: 'MR',
    joinedDate: '2022-08-01',
    role: 'student' as UserRole,
    universityId: 'uni_tech',
    overallAttendance: 65, // At risk
    gpa: 2.4,
  },
  {
    id: 'student_004',
    name: 'Aisha Patel',
    email: 'aisha.p@tech.edu',
    course: 'B.Tech AIML',
    semester: 4,
    rollNumber: '22BTAIML043',
    avatar: 'AP',
    joinedDate: '2022-08-01',
    role: 'student' as UserRole,
    universityId: 'uni_tech',
    overallAttendance: 71, // At risk
    gpa: 3.1,
  }
];
