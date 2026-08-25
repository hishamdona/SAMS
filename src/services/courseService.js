// Course Service for SAMS
import { storage } from './storage';
import { calculateAttendanceMetrics, calculateCaMetrics, evaluateRisk } from './riskEngine';

export const courseService = {
  getAll() {
    return storage.getItem(storage.KEYS.COURSES, []);
  },

  getById(id) {
    const courses = this.getAll();
    return courses.find(c => c.id === id) || null;
  },

  getByCode(code) {
    const courses = this.getAll();
    return courses.find(c => c.code.toLowerCase() === (code || '').trim().toLowerCase()) || null;
  },

  getByLevel(level) {
    const courses = this.getAll();
    if (!level || level === 'all') return courses;
    return courses.filter(c => c.level === Number(level));
  },

  getByLecturer(lecturerId) {
    const courses = this.getAll();
    return courses.filter(c => c.lecturerId === lecturerId);
  },

  create(courseData) {
    const courses = this.getAll();
    const newCourse = {
      id: `crs-${courseData.code.toLowerCase().replace(/\s+/g, '')}`,
      enrolledCount: courseData.level === 200 ? 12 : 12,
      totalClassesPlanned: 12,
      semester: "First Semester",
      ...courseData
    };
    const updated = [newCourse, ...courses];
    storage.setItem(storage.KEYS.COURSES, updated);
    return newCourse;
  },

  update(id, courseData) {
    const courses = this.getAll();
    const updated = courses.map(c => c.id === id ? { ...c, ...courseData } : c);
    storage.setItem(storage.KEYS.COURSES, updated);
    return this.getById(id);
  },

  delete(id) {
    const courses = this.getAll();
    const updated = courses.filter(c => c.id !== id);
    storage.setItem(storage.KEYS.COURSES, updated);
    return true;
  },

  getCourseAnalytics(courseCode) {
    const course = this.getByCode(courseCode);
    if (!course) return null;

    const students = storage.getItem(storage.KEYS.STUDENTS, []).filter(s => 
      s.enrolledCourses && s.enrolledCourses.includes(course.code)
    );
    const sessions = storage.getItem(storage.KEYS.ATTENDANCE, []).filter(s => s.courseCode === course.code);
    const scores = storage.getItem(storage.KEYS.SCORES, []).filter(s => s.courseCode === course.code);
    const settings = storage.getItem(storage.KEYS.SETTINGS, {});

    let totalAtt = 0;
    let totalCa = 0;
    let atRiskCount = 0;
    let criticalCount = 0;
    let safeCount = 0;

    const studentRows = students.map(student => {
      const att = calculateAttendanceMetrics(sessions, student.id, course.code);
      const ca = calculateCaMetrics(scores, student.id, course.code);
      const risk = evaluateRisk(att.percentage, ca.percentage, settings);

      totalAtt += att.percentage;
      totalCa += ca.percentage;

      if (risk.status === 'Critical At-Risk') criticalCount++;
      else if (risk.status === 'At-Risk') atRiskCount++;
      else safeCount++;

      const sc = scores.find(s => s.studentId === student.id && s.courseCode === course.code);

      return {
        student,
        attendance: att,
        ca: {
          ...ca,
          test1: sc?.test1 ?? 0,
          test2: sc?.test2 ?? 0,
          assignment: sc?.assignment ?? 0,
        },
        risk
      };
    });

    const enrolledCount = students.length;
    const avgAttendance = enrolledCount > 0 ? (totalAtt / enrolledCount).toFixed(1) : 0;
    const avgCa = enrolledCount > 0 ? (totalCa / enrolledCount).toFixed(1) : 0;

    return {
      course,
      sessions,
      enrolledCount,
      avgAttendance: Number(avgAttendance),
      avgCa: Number(avgCa),
      safeCount,
      atRiskCount,
      criticalCount,
      studentRows
    };
  }
};
