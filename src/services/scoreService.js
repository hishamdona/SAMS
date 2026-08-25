// CA Score Service for SAMS
// Department of Computer Science, Federal University Dutse (FUD)
import { storage } from './storage';
import { alertService } from './alertService';
import { calculateAttendanceMetrics, calculateCaMetrics, evaluateRisk } from './riskEngine';

export const scoreService = {
  getAllScores() {
    return storage.getItem(storage.KEYS.SCORES, []);
  },

  getScoresByCourse(courseCode) {
    const scores = this.getAllScores();
    return scores.filter(s => s.courseCode === courseCode);
  },

  getScoresByStudent(studentId) {
    const scores = this.getAllScores();
    return scores.filter(s => s.studentId === studentId);
  },

  /**
   * Save or update CA score for a student in a course.
   * Continuous assessment structure:
   * Test / Quiz (max 15), Test 2 (max 15), Assignment (max 10) = Total CA (max 40)
   * CA Percentage = (totalCa / 40) * 100
   */
  saveScore({ studentId, courseCode, test1, test2, quiz, test, assignment, enrollmentId }) {
    const scores = this.getAllScores();
    const t1 = Math.min(15, Math.max(0, Number(test1 ?? quiz) || 0));
    const t2 = Math.min(15, Math.max(0, Number(test2 ?? test) || 0));
    const ass = Math.min(10, Math.max(0, Number(assignment) || 0));
    const totalCa = Number((t1 + t2 + ass).toFixed(1));
    const maxCa = 40;
    const percentage = Number(((totalCa / maxCa) * 100).toFixed(1));

    const scoreId = `ca-${courseCode.toLowerCase().replace(/\s+/g, '')}-${studentId}`;
    const enrId = enrollmentId || `enr-${studentId}-${courseCode.toLowerCase().replace(/\s+/g, '')}`;

    const scoreRecord = {
      id: scoreId,
      enrollmentId: enrId,
      studentId,
      courseCode,
      assignment: ass,
      quiz: t1,
      test: t2,
      test1: t1,
      test2: t2,
      total: totalCa,
      totalCa,
      maxCa,
      percentage,
      updatedAt: new Date().toISOString()
    };

    const existingIndex = scores.findIndex(s => s.studentId === studentId && s.courseCode === courseCode);
    let updatedScores;
    if (existingIndex >= 0) {
      updatedScores = scores.map((s, idx) => idx === existingIndex ? scoreRecord : s);
    } else {
      updatedScores = [...scores, scoreRecord];
    }

    storage.setItem(storage.KEYS.SCORES, updatedScores);

    // Trigger risk check
    this._checkAndTriggerRiskAlerts(studentId, courseCode, scoreRecord);

    return scoreRecord;
  },

  bulkSaveScores(scoreRecords = []) {
    const scores = this.getAllScores();
    const updatedMap = new Map(scores.map(s => [`${s.studentId}_${s.courseCode}`, s]));

    scoreRecords.forEach(rec => {
      const t1 = Math.min(15, Math.max(0, Number(rec.test1 ?? rec.quiz) || 0));
      const t2 = Math.min(15, Math.max(0, Number(rec.test2 ?? rec.test) || 0));
      const ass = Math.min(10, Math.max(0, Number(rec.assignment) || 0));
      const totalCa = Number((t1 + t2 + ass).toFixed(1));
      const maxCa = 40;
      const percentage = Number(((totalCa / maxCa) * 100).toFixed(1));
      const scoreId = `ca-${rec.courseCode.toLowerCase().replace(/\s+/g, '')}-${rec.studentId}`;
      const enrId = rec.enrollmentId || `enr-${rec.studentId}-${rec.courseCode.toLowerCase().replace(/\s+/g, '')}`;

      const item = {
        id: scoreId,
        enrollmentId: enrId,
        studentId: rec.studentId,
        courseCode: rec.courseCode,
        assignment: ass,
        quiz: t1,
        test: t2,
        test1: t1,
        test2: t2,
        total: totalCa,
        totalCa,
        maxCa,
        percentage,
        updatedAt: new Date().toISOString()
      };

      updatedMap.set(`${rec.studentId}_${rec.courseCode}`, item);
      this._checkAndTriggerRiskAlerts(rec.studentId, rec.courseCode, item);
    });

    const finalScores = Array.from(updatedMap.values());
    storage.setItem(storage.KEYS.SCORES, finalScores);
    return finalScores;
  },

  _checkAndTriggerRiskAlerts(studentId, courseCode, scoreRecord) {
    const students = storage.getItem(storage.KEYS.STUDENTS, []);
    const sessions = storage.getItem(storage.KEYS.ATTENDANCE, []);
    const settings = storage.getItem(storage.KEYS.SETTINGS, {});

    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const att = calculateAttendanceMetrics(sessions, studentId, courseCode);
    const evaluation = evaluateRisk(att.percentage, scoreRecord.percentage, settings);

    if (evaluation.status !== 'Safe') {
      alertService.generateAlertIfNew({
        studentId: student.id,
        studentName: student.name,
        matricNumber: student.matricNo || student.matricNumber,
        level: student.level,
        courseCode,
        type: evaluation.status === 'Critical At-Risk' ? 'Critical Academic Warning' : 'CA Warning',
        severity: evaluation.severity,
        message: evaluation.status === 'Critical At-Risk'
          ? `Critical Warning: ${student.name} (${student.matricNo || student.matricNumber}) has CA score of ${scoreRecord.percentage}% and attendance ${att.percentage}% in ${courseCode}.`
          : `CA Performance Warning: ${student.name} (${student.matricNo || student.matricNumber}) scored ${scoreRecord.percentage}% in ${courseCode} CA (below ${settings.caThreshold || 40}% minimum).`,
        recipient: 'Level Coordinator & Student',
        phone: student.phone
      });
    }
  }
};
