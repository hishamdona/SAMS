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

// In-memory fallback if localStorage is disabled or blocked
const memoryStore = new Map();

export const storage = {
  init() {
    try {
      if (typeof window === 'undefined') return;

      const ensureKey = (key, initialValue) => {
        try {
          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(initialValue));
          }
        } catch {
          if (!memoryStore.has(key)) {
            memoryStore.set(key, JSON.stringify(initialValue));
          }
        }
      };

      ensureKey(KEYS.SETTINGS, initialSystemSettings);
      ensureKey(KEYS.USERS, initialUsers);
      ensureKey(KEYS.COURSES, initialCourses);
      ensureKey(KEYS.STUDENTS, initialStudents);
      ensureKey(KEYS.ENROLLMENTS, initialEnrollments);
      ensureKey(KEYS.ATTENDANCE, initialAttendanceSessions);
      ensureKey(KEYS.SCORES, initialCaScores);
      ensureKey(KEYS.ALERTS, initialAlerts);
      ensureKey(KEYS.SMS_LOGS, initialSmsLogs);
      ensureKey(KEYS.INTERVENTIONS, []);
      ensureKey(KEYS.AUTH_USER, initialUsers[0]);
    } catch (err) {
      console.warn('Storage initialization fallback active:', err);
    }
  },

  resetAll() {
    try {
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
    } catch {
      memoryStore.set(KEYS.SETTINGS, JSON.stringify(initialSystemSettings));
      memoryStore.set(KEYS.USERS, JSON.stringify(initialUsers));
      memoryStore.set(KEYS.COURSES, JSON.stringify(initialCourses));
      memoryStore.set(KEYS.STUDENTS, JSON.stringify(initialStudents));
      memoryStore.set(KEYS.ENROLLMENTS, JSON.stringify(initialEnrollments));
      memoryStore.set(KEYS.ATTENDANCE, JSON.stringify(initialAttendanceSessions));
      memoryStore.set(KEYS.SCORES, JSON.stringify(initialCaScores));
      memoryStore.set(KEYS.ALERTS, JSON.stringify(initialAlerts));
      memoryStore.set(KEYS.SMS_LOGS, JSON.stringify(initialSmsLogs));
      memoryStore.set(KEYS.INTERVENTIONS, JSON.stringify([]));
      memoryStore.set(KEYS.AUTH_USER, JSON.stringify(initialUsers[0]));
    }
    notifyStateChange('all', null);
  },

  getItem(key, fallback = null) {
    try {
      let item = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        item = localStorage.getItem(key);
      }
      if (!item && memoryStore.has(key)) {
        item = memoryStore.get(key);
      }
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Reading ${key} fallback:`, e);
      if (memoryStore.has(key)) {
        try {
          return JSON.parse(memoryStore.get(key));
        } catch {
          return fallback;
        }
      }
      return fallback;
    }
  },

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, serialized);
      }
      memoryStore.set(key, serialized);
      notifyStateChange(key, value);
    } catch (e) {
      console.warn(`Writing ${key} fallback:`, e);
      memoryStore.set(key, JSON.stringify(value));
      notifyStateChange(key, value);
    }
  },

  notifyStateChange,
  KEYS
};

// Initialize right away
storage.init();
