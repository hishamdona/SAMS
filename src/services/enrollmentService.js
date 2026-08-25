// Enrollment Service for SAMS
// Department of Computer Science, Federal University Dutse (FUD)
import { storage } from './storage';

export const enrollmentService = {
  getAll() {
    return storage.getItem(storage.KEYS.ENROLLMENTS, []);
  },

  getById(id) {
    const list = this.getAll();
    return list.find(e => e.id === id) || null;
  },

  getByStudentId(studentId) {
    const list = this.getAll();
    return list.filter(e => e.studentId === studentId);
  },

  getByCourseCode(courseCode) {
    const list = this.getAll();
    return list.filter(e => e.courseCode === courseCode);
  },

  getByLevel(level) {
    const list = this.getAll();
    if (!level || level === 'all') return list;
    return list.filter(e => e.level === Number(level));
  },

  enrollStudent(studentId, courseCode, options = {}) {
    const enrollments = this.getAll();
    const students = storage.getItem(storage.KEYS.STUDENTS, []);
    const courses = storage.getItem(storage.KEYS.COURSES, []);

    const student = students.find(s => s.id === studentId);
    const course = courses.find(c => c.code === courseCode);

    const exists = enrollments.find(e => e.studentId === studentId && e.courseCode === courseCode);
    if (exists) return exists;

    const newEnrollment = {
      id: `enr-${studentId}-${courseCode.toLowerCase().replace(/\s+/g, '')}`,
      studentId,
      studentName: student?.name || 'Student',
      matricNo: student?.matricNo || student?.matricNumber || 'FCP/CSC/22/001',
      courseId: course?.id || `crs-${courseCode.toLowerCase().replace(/\s+/g, '')}`,
      courseCode,
      level: student?.level || 100,
      session: options.session || "2025/2026",
      semester: options.semester || "First Semester",
      enrolledAt: new Date().toISOString()
    };

    const updated = [...enrollments, newEnrollment];
    storage.setItem(storage.KEYS.ENROLLMENTS, updated);

    // Update student enrolledCourses array if needed
    if (student && !student.enrolledCourses?.includes(courseCode)) {
      const updatedStudents = students.map(s => s.id === studentId 
        ? { ...s, enrolledCourses: [...(s.enrolledCourses || []), courseCode] }
        : s
      );
      storage.setItem(storage.KEYS.STUDENTS, updatedStudents);
    }

    return newEnrollment;
  },

  dropStudentCourse(studentId, courseCode) {
    const enrollments = this.getAll();
    const updated = enrollments.filter(e => !(e.studentId === studentId && e.courseCode === courseCode));
    storage.setItem(storage.KEYS.ENROLLMENTS, updated);

    const students = storage.getItem(storage.KEYS.STUDENTS, []);
    const updatedStudents = students.map(s => s.id === studentId 
      ? { ...s, enrolledCourses: (s.enrolledCourses || []).filter(c => c !== courseCode) }
      : s
    );
    storage.setItem(storage.KEYS.STUDENTS, updatedStudents);
    return true;
  }
};
