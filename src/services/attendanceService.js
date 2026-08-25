// Attendance Service for SAMS
import { storage } from './storage';
import { alertService } from './alertService';
import { calculateAttendanceMetrics, calculateCaMetrics, evaluateRisk } from './riskEngine';

export const attendanceService = {
  getAllSessions() {
    return storage.getItem(storage.KEYS.ATTENDANCE, []);
  },

  getSessionsByCourse(courseCode) {
    const sessions = this.getAllSessions();
    return sessions.filter(s => s.courseCode === courseCode).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  getSessionById(id) {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  },

  /**
   * Save or create an attendance session.
   * Immediately evaluates affected students and triggers risk alerts if attendance drops below 60%.
   */
  saveSession({ id, courseCode, date, topic, records }) {
    const sessions = this.getAllSessions();
    const sessionId = id || `att-${courseCode.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`;
    const newSession = {
      id: sessionId,
      courseCode,
      date,
      topic: topic || `Lecture on ${date}`,
      records: records || {}
    };

    const existingIndex = sessions.findIndex(s => s.id === sessionId);
    let updatedSessions;
    if (existingIndex >= 0) {
      updatedSessions = sessions.map(s => s.id === sessionId ? newSession : s);
    } else {
      updatedSessions = [...sessions, newSession];
    }

    storage.setItem(storage.KEYS.ATTENDANCE, updatedSessions);

    // Run risk check on all affected students
    this._checkAndTriggerRiskAlerts(courseCode, updatedSessions, Object.keys(records));

    return newSession;
  },

  deleteSession(sessionId) {
    const sessions = this.getAllSessions();
    const updated = sessions.filter(s => s.id !== sessionId);
    storage.setItem(storage.KEYS.ATTENDANCE, updated);
    return true;
  },

  _checkAndTriggerRiskAlerts(courseCode, allSessions, studentIds = []) {
    const students = storage.getItem(storage.KEYS.STUDENTS, []);
    const scores = storage.getItem(storage.KEYS.SCORES, []);
    const settings = storage.getItem(storage.KEYS.SETTINGS, {});

    studentIds.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      const att = calculateAttendanceMetrics(allSessions, studentId, courseCode);
      const ca = calculateCaMetrics(scores, studentId, courseCode);
      const evaluation = evaluateRisk(att.percentage, ca.percentage, settings);

      if (evaluation.status !== 'Safe') {
        alertService.generateAlertIfNew({
          studentId: student.id,
          studentName: student.name,
          matricNumber: student.matricNumber,
          level: student.level,
          courseCode,
          type: evaluation.status === 'Critical At-Risk' ? 'Critical Academic Warning' : 'Attendance Warning',
          severity: evaluation.severity,
          message: evaluation.status === 'Critical At-Risk'
            ? `Critical Warning: ${student.name} (${student.matricNumber}) attendance is ${att.percentage}% and CA is ${ca.percentage}% in ${courseCode}.`
            : `Attendance Warning: ${student.name} (${student.matricNumber}) attendance has fallen to ${att.percentage}% in ${courseCode} (minimum is ${settings.attendanceThreshold || 60}%).`,
          recipient: 'Level Coordinator & Student',
          phone: student.phone
        });
      }
    });
  }
};
