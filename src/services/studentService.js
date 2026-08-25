// Student Service for SAMS
// Department of Computer Science, Federal University Dutse (FUD)
import { storage } from './storage';
import { evaluateStudentOverallRisk, calculateAttendanceMetrics, calculateCaMetrics, evaluateRisk } from './riskEngine';

export const studentService = {
  getAll() {
    return storage.getItem(storage.KEYS.STUDENTS, []);
  },

  getById(id) {
    const students = this.getAll();
    return students.find(s => s.id === id) || null;
  },

  getByMatricNumber(matricNumber) {
    const students = this.getAll();
    const clean = (matricNumber || '').trim().toLowerCase();
    return students.find(s => 
      (s.matricNo && s.matricNo.toLowerCase() === clean) ||
      (s.matricNumber && s.matricNumber.toLowerCase() === clean)
    ) || null;
  },

  getByLevel(level) {
    const students = this.getAll();
    if (!level || level === 'all') return students;
    return students.filter(s => s.level === Number(level));
  },

  create(studentData) {
    const students = this.getAll();
    const level = Number(studentData.level) || 100;
    const yearCode = level === 200 ? '22' : '23';
    const nextSeq = String(students.filter(s => s.level === level).length + 1).padStart(3, '0');
    const matric = studentData.matricNo || studentData.matricNumber || `FCP/CSC/${yearCode}/${nextSeq}`;
    
    const newStudent = {
      id: `stu-${level}-${Date.now().toString().slice(-4)}`,
      matricNo: matric,
      matricNumber: matric,
      status: 'active',
      coordinatorId: 'usr-coord-1',
      advisor: 'Mal. Ibrahim Sani',
      department: 'Computer Science',
      session: '2025/2026',
      enrolledCourses: level === 200 
        ? ["CSC 201", "CSC 202", "CSC 203", "CSC 204", "CSC 205"]
        : ["CSC 101", "CSC 102", "CSC 103", "CSC 104", "CSC 105", "CSC 106"],
      ...studentData
    };
    const updated = [newStudent, ...students];
    storage.setItem(storage.KEYS.STUDENTS, updated);
    return newStudent;
  },

  update(id, studentData) {
    const students = this.getAll();
    const matric = studentData.matricNo || studentData.matricNumber;
    const updatedPayload = {
      ...studentData,
      ...(matric ? { matricNo: matric, matricNumber: matric } : {})
    };
    const updated = students.map(s => s.id === id ? { ...s, ...updatedPayload } : s);
    storage.setItem(storage.KEYS.STUDENTS, updated);
    return this.getById(id);
  },

  delete(id) {
    const students = this.getAll();
    const updated = students.filter(s => s.id !== id);
    storage.setItem(storage.KEYS.STUDENTS, updated);
    return true;
  },

  /**
   * Retrieves all students with calculated live risk metrics.
   */
  getAllWithRiskMetrics(levelFilter = 'all') {
    const students = this.getByLevel(levelFilter);
    const sessions = storage.getItem(storage.KEYS.ATTENDANCE, []);
    const scores = storage.getItem(storage.KEYS.SCORES, []);
    const settings = storage.getItem(storage.KEYS.SETTINGS, {});

    return students.map(student => {
      const riskProfile = evaluateStudentOverallRisk(student, sessions, scores, settings);
      return {
        ...student,
        matricNo: student.matricNo || student.matricNumber,
        matricNumber: student.matricNumber || student.matricNo,
        riskProfile,
        riskStatus: riskProfile.status,
        attendancePercentage: riskProfile.overallAttendancePercentage,
        caPercentage: riskProfile.overallCaPercentage,
      };
    });
  },

  /**
   * Comprehensive Academic Dossier for a single student.
   * Useful for student profile, coordinator detail modal, and official printable report.
   */
  getStudentAcademicDossier(studentId) {
    const student = this.getById(studentId);
    if (!student) return null;

    const sessions = storage.getItem(storage.KEYS.ATTENDANCE, []);
    const scores = storage.getItem(storage.KEYS.SCORES, []);
    const courses = storage.getItem(storage.KEYS.COURSES, []);
    const alerts = storage.getItem(storage.KEYS.ALERTS, []).filter(a => a.studentId === studentId);
    const smsLogs = storage.getItem(storage.KEYS.SMS_LOGS, []).filter(s => s.studentId === studentId);
    const interventions = storage.getItem(storage.KEYS.INTERVENTIONS, []).filter(i => i.studentId === studentId);
    const settings = storage.getItem(storage.KEYS.SETTINGS, {});

    const riskProfile = evaluateStudentOverallRisk(student, sessions, scores, settings);

    // Enhance course details
    const enhancedCourseEvals = (student.enrolledCourses || []).map(courseCode => {
      const courseInfo = courses.find(c => c.code === courseCode) || { title: courseCode, units: 3, creditUnits: 3 };
      const att = calculateAttendanceMetrics(sessions, student.id, courseCode);
      const ca = calculateCaMetrics(scores, student.id, courseCode);
      const evaluation = evaluateRisk(att.percentage, ca.percentage, settings);
      const courseScoreDetail = scores.find(s => s.studentId === studentId && s.courseCode === courseCode);

      return {
        courseCode,
        courseTitle: courseInfo.title,
        units: courseInfo.units || courseInfo.creditUnits || 3,
        creditUnits: courseInfo.units || courseInfo.creditUnits || 3,
        lecturerName: courseInfo.lecturerName || 'Departmental Staff',
        attendance: att,
        ca: {
          ...ca,
          assignment: courseScoreDetail?.assignment ?? '-',
          quiz: courseScoreDetail?.quiz ?? courseScoreDetail?.test1 ?? '-',
          test: courseScoreDetail?.test ?? courseScoreDetail?.test2 ?? '-',
          test1: courseScoreDetail?.test1 ?? courseScoreDetail?.quiz ?? '-',
          test2: courseScoreDetail?.test2 ?? courseScoreDetail?.test ?? '-',
          total: courseScoreDetail?.total ?? courseScoreDetail?.totalCa ?? '-',
        },
        evaluation
      };
    });

    return {
      student: {
        ...student,
        matricNo: student.matricNo || student.matricNumber,
        matricNumber: student.matricNumber || student.matricNo,
      },
      settings,
      riskProfile,
      courseBreakdown: enhancedCourseEvals,
      alerts,
      smsLogs,
      interventions
    };
  }
};
