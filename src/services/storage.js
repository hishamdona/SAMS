// LocalStorage Management and State Synchronization for SAMS
import {
  initialSystemSettings,
  initialUsers,
  initialCourses,
  initialStudents,
  initialEnrollments,
  initialAttendanceSessions,
  initialCaScores,
  initialAlerts,
  initialSmsLogs
} from '../data/seedData';

const KEYS = {
  SETTINGS: 'sams_settings',
  USERS: 'sams_users',
  COURSES: 'sams_courses',
  STUDENTS: 'sams_students',
  ENROLLMENTS: 'sams_enrollments',
  ATTENDANCE: 'sams_attendance',
  SCORES: 'sams_scores',
  ALERTS: 'sams_alerts',
  SMS_LOGS: 'sams_sms_logs',
  AUTH_USER: 'sams_auth_user',
  INTERVENTIONS: 'sams_interventions',
};

// Notify other components of data changes
export const notifyStateChange = (key, data) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sams_data_updated', {
      detail: { key, data, timestamp: Date.now() }
    }));
  }
};

export const storage = {
  init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(initialSystemSettings));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    }
    if (!localStorage.getItem(KEYS.COURSES)) {
      localStorage.setItem(KEYS.COURSES, JSON.stringify(initialCourses));
    }
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents));
    }
    if (!localStorage.getItem(KEYS.ENROLLMENTS)) {
      localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(initialEnrollments));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) {
      localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(initialAttendanceSessions));
    }
    if (!localStorage.getItem(KEYS.SCORES)) {
      localStorage.setItem(KEYS.SCORES, JSON.stringify(initialCaScores));
    }
    if (!localStorage.getItem(KEYS.ALERTS)) {
      localStorage.setItem(KEYS.ALERTS, JSON.stringify(initialAlerts));
    }
    if (!localStorage.getItem(KEYS.SMS_LOGS)) {
      localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(initialSmsLogs));
    }
    if (!localStorage.getItem(KEYS.INTERVENTIONS)) {
      localStorage.setItem(KEYS.INTERVENTIONS, JSON.stringify([]));
    }

    // Default demo user if none logged in
    if (!localStorage.getItem(KEYS.AUTH_USER)) {
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(initialUsers[0])); // Admin by default
    }
  },

  resetAll() {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(initialSystemSettings));
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(KEYS.COURSES, JSON.stringify(initialCourses));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(initialStudents));
    localStorage.setItem(KEYS.ENROLLMENTS, JSON.stringify(initialEnrollments));
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(initialAttendanceSessions));
    localStorage.setItem(KEYS.SCORES, JSON.stringify(initialCaScores));
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(initialAlerts));
    localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(initialSmsLogs));
    localStorage.setItem(KEYS.INTERVENTIONS, JSON.stringify([]));
    localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(initialUsers[0]));
    notifyStateChange('all', null);
  },

  getItem(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      notifyStateChange(key, value);
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
    }
  },

  notifyStateChange,
  KEYS
};

// Initialize right away
storage.init();
