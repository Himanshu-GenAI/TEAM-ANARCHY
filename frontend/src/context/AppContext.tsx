import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import {
  STUDENT_PROFILE,
  ADMIN_PROFILE,
  UNIVERSITIES,
  MOCK_ANNOUNCEMENTS,
  SUBJECTS,
  ASSIGNMENTS,
  PLANNER_TASKS,
  GAMIFICATION,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import type { Subject, Assignment, PlannerTask, Notification, Announcement, UserRole, University } from '../data/mockData';
import { generateNotifications } from '../utils/notifications';

interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: number;
  rollNumber: string;
  avatar: string;
  role: UserRole;
  universityId: string;
  universityDbId?: string; // real MongoDB _id for API calls
  joinCode?: string;
}

interface Gamification {
  streak: number;
  points: number;
  level: string;
  completedThisWeek: number;
  badges: string[];
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  subjects: Subject[];
  assignments: Assignment[];
  plannerTasks: PlannerTask[];
  notifications: Notification[];
  gamification: Gamification;
  announcements: Announcement[];

  // Actions
  login: (email: string, name: string, joinCode?: string, isAdmin?: boolean) => void;
  signupStudent: (name: string, email: string, joinCode: string) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (email: string) => Promise<{ success: boolean; message?: string }>;
  postAnnouncement: (title: string, message: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  completeAssignment: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addPlannerTask: (task: Omit<PlannerTask, 'id'>) => void;
  togglePlannerTask: (id: string) => void;
  updateAttendance: (subjectId: string, attended: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('unisync_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('unisync_darkmode');
    return stored ? JSON.parse(stored) : true; // default dark
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const stored = localStorage.getItem('unisync_subjects');
      return stored ? JSON.parse(stored) : SUBJECTS;
    } catch {
      return SUBJECTS;
    }
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const stored = localStorage.getItem('unisync_assignments');
      return stored ? JSON.parse(stored) : ASSIGNMENTS;
    } catch {
      return ASSIGNMENTS;
    }
  });

  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>(() => {
    try {
      const stored = localStorage.getItem('unisync_planner');
      return stored ? JSON.parse(stored) : PLANNER_TASKS;
    } catch {
      return PLANNER_TASKS;
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const live = generateNotifications(subjects, assignments);
    return live.length > 0 ? live : INITIAL_NOTIFICATIONS;
  });

  const [gamification, setGamification] = useState<Gamification>(() => {
    try {
      const stored = localStorage.getItem('unisync_gamification');
      return stored ? JSON.parse(stored) : GAMIFICATION;
    } catch {
      return GAMIFICATION;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const stored = localStorage.getItem('unisync_announcements');
      return stored ? JSON.parse(stored) : MOCK_ANNOUNCEMENTS;
    } catch {
      return MOCK_ANNOUNCEMENTS;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('unisync_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (user) localStorage.setItem('unisync_user', JSON.stringify(user));
    else localStorage.removeItem('unisync_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('unisync_darkmode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('unisync_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('unisync_assignments', JSON.stringify(assignments));
    const refreshed = generateNotifications(subjects, assignments);
    setNotifications(refreshed);
  }, [assignments, subjects]);

  useEffect(() => {
    localStorage.setItem('unisync_planner', JSON.stringify(plannerTasks));
  }, [plannerTasks]);

  useEffect(() => {
    localStorage.setItem('unisync_gamification', JSON.stringify(gamification));
  }, [gamification]);

  // Apply dark mode class on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, []);

  // Simple login (existing student / demo)
  const login = useCallback((email: string, name: string, joinCode?: string, isAdmin?: boolean) => {
    let newUser: User;
    if (isAdmin) {
      newUser = { ...ADMIN_PROFILE };
    } else {
      const universityId = UNIVERSITIES.find((u) => u.joinCode === joinCode)?.id || 'uni_tech';
      newUser = {
        ...STUDENT_PROFILE,
        email,
        name: name || STUDENT_PROFILE.name,
        avatar: name ? name.slice(0, 2).toUpperCase() : STUDENT_PROFILE.avatar,
        role: 'student',
        universityId,
      };
    }
    setUser(newUser);
  }, []);

  // Real student signup — saves to MongoDB via API
  const signupStudent = useCallback(async (
    name: string,
    email: string,
    joinCode: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('http://localhost:3001/api/student/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, joinCode: joinCode.toUpperCase() }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      // Set user in context using the returned university info
      const uni = data.data.university;
      const newUser: User = {
        ...STUDENT_PROFILE,
        id: data.data.studentId,
        email,
        name,
        avatar: name.slice(0, 2).toUpperCase(),
        role: 'student',
        universityId: uni.id,
        universityDbId: uni.id,
        joinCode: uni.joinCode,
      };
      setUser(newUser);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not connect to the server. Make sure the backend is running on port 3001.' };
    }
  }, []);

  // Real admin login — verifies against MongoDB
  const loginAdmin = useCallback(async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('http://localhost:3001/api/university/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) return { success: false, message: data.message };

      const uni = data.data;
      const adminUser: User = {
        ...ADMIN_PROFILE,
        email,
        name: `${uni.name} Admin`,
        avatar: uni.name.slice(0, 2).toUpperCase(),
        universityId: uni.id,
        universityDbId: uni.id,
        joinCode: uni.joinCode,
      };
      setUser(adminUser);
      return { success: true };
    } catch {
      return { success: false, message: 'Could not reach the server. Make sure the backend is running.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('unisync_user');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const completeAssignment = useCallback((id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'completed' as const } : a
      )
    );
    setGamification((prev) => ({
      ...prev,
      points: prev.points + 50,
      streak: prev.streak + 1,
      completedThisWeek: prev.completedThisWeek + 1,
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addPlannerTask = useCallback((task: Omit<PlannerTask, 'id'>) => {
    const newTask: PlannerTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setPlannerTasks((prev) =>
      [...prev, newTask].sort((a, b) => a.time.localeCompare(b.time))
    );
  }, []);

  const togglePlannerTask = useCallback((id: string) => {
    setPlannerTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
    setGamification((prev) => ({
      ...prev,
      points: prev.points + 10,
    }));
  }, []);

  const updateAttendance = useCallback((subjectId: string, attended: boolean) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              totalClasses: s.totalClasses + 1,
              attendedClasses: attended ? s.attendedClasses + 1 : s.attendedClasses,
            }
          : s
      )
    );
  }, []);

  const postAnnouncement = useCallback((title: string, message: string) => {
    if (!user || user.role !== 'admin') return;
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      universityId: user.universityId,
      title,
      message,
      date: new Date().toISOString(),
      author: user.name,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  }, [user]);

  const value: AppState = {
    user,
    isAuthenticated: !!user,
    darkMode,
    subjects,
    assignments,
    plannerTasks,
    notifications,
    gamification,
    announcements,
    login,
    signupStudent,
    loginAdmin,
    postAnnouncement,
    logout,
    toggleDarkMode,
    completeAssignment,
    markNotificationRead,
    markAllNotificationsRead,
    addPlannerTask,
    togglePlannerTask,
    updateAttendance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
