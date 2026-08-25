// Risk Engine - Core Academic Early-Warning Decision Logic for SAMS
// Federal University Dutse (FUD) - Department of Computer Science

export const RISK_THRESHOLDS = {
  ATTENDANCE_MIN: 60, // Minimum required attendance percentage (60%)
  CA_MIN: 40,         // Minimum continuous assessment percentage (40%)
};

export const RISK_STATUSES = {
  SAFE: 'Safe',
  AT_RISK: 'At-Risk',
  CRITICAL: 'Critical At-Risk',
};

/**
 * Calculates risk status for a given attendance percentage and CA percentage.
 * 
 * Rules:
 * IF attendance < 60: attendanceRisk = true
 * IF CA < 40: caRisk = true
 * IF attendanceRisk AND caRisk: status = "Critical At-Risk"
 * ELSE IF attendanceRisk OR caRisk: status = "At-Risk"
 * ELSE: status = "Safe"
 * 
 * @param {number} attendancePercentage - e.g. 54 or 85
 * @param {number} caPercentage - e.g. 35 or 75
 * @param {Object} options - custom thresholds or context
 * @returns {Object} Structured risk evaluation
 */
export function evaluateRisk(attendancePercentage = 0, caPercentage = 0, options = {}) {
  const attThreshold = options.attendanceThreshold ?? RISK_THRESHOLDS.ATTENDANCE_MIN;
  const caThreshold = options.caThreshold ?? RISK_THRESHOLDS.CA_MIN;

  const attVal = Number(attendancePercentage) || 0;
  const caVal = Number(caPercentage) || 0;

  const attendanceRisk = attVal < attThreshold;
  const caRisk = caVal < caThreshold;

  let status = RISK_STATUSES.SAFE;
  const reasons = [];
  const recommendations = [];

  if (attendanceRisk && caRisk) {
    status = RISK_STATUSES.CRITICAL;
    reasons.push(`Attendance is critically low at ${attVal.toFixed(1)}% (below ${attThreshold}% threshold)`);
    reasons.push(`Continuous Assessment score is ${caVal.toFixed(1)}% (below ${caThreshold}% threshold)`);
    recommendations.push('Immediate counseling session with Level Coordinator');
    recommendations.push('Compulsory attendance in all remaining lecture sessions');
    recommendations.push('Enroll in departmental remedial tutorial program');
  } else if (attendanceRisk) {
    status = RISK_STATUSES.AT_RISK;
    reasons.push(`Attendance is ${attVal.toFixed(1)}% (below ${attThreshold}% minimum threshold)`);
    recommendations.push('Consistent attendance in upcoming lectures to avoid exam disqualification');
    recommendations.push('Consult course lecturer regarding missed attendance marks');
  } else if (caRisk) {
    status = RISK_STATUSES.AT_RISK;
    reasons.push(`Continuous Assessment score is ${caVal.toFixed(1)}% (below ${caThreshold}% pass threshold)`);
    recommendations.push('Submit all pending continuous assessment assignments');
    recommendations.push('Attend departmental revision tutorials');
    recommendations.push('Meet lecturer during designated office hours');
  } else {
    status = RISK_STATUSES.SAFE;
    reasons.push('Student meets both attendance and continuous assessment performance standards');
    recommendations.push('Maintain current study discipline and regular class participation');
  }

  return {
    status,
    attendanceRisk,
    caRisk,
    attendancePercentage: Number(attVal.toFixed(1)),
    caPercentage: Number(caVal.toFixed(1)),
    reasons,
    recommendations,
    severity: status === RISK_STATUSES.CRITICAL ? 'critical' : status === RISK_STATUSES.AT_RISK ? 'warning' : 'safe'
  };
}

/**
 * Calculates attendance percentage from attendance records for a student.
 * 
 * @param {Array} sessions - Array of attendance sessions
 * @param {string} studentId - The student identifier
 * @param {string} [courseCode] - Optional filter for specific course
 * @returns {Object} { totalSessions, attendedSessions, percentage }
 */
export function calculateAttendanceMetrics(sessions = [], studentId, courseCode = null) {
  const filteredSessions = courseCode 
    ? sessions.filter(s => s.courseCode === courseCode)
    : sessions;

  if (!filteredSessions.length) {
    return { totalSessions: 0, attendedSessions: 0, percentage: 0 };
  }

  let totalRelevant = 0;
  let attended = 0;

  filteredSessions.forEach(session => {
    if (session.records && studentId in session.records) {
      totalRelevant++;
      const status = session.records[studentId];
      if (status === 'present') {
        attended += 1;
      } else if (status === 'late') {
        attended += 0.5; // late counts as half-presence in academic models
      }
    }
  });

  const percentage = totalRelevant > 0 ? (attended / totalRelevant) * 100 : 0;

  return {
    totalSessions: totalRelevant,
    attendedSessions: attended,
    percentage: Number(percentage.toFixed(1))
  };
}

/**
 * Calculates CA metrics for a student in a course or averaged across all courses.
 * 
 * @param {Array} scores - Array of CA scores
 * @param {string} studentId - The student identifier
 * @param {string} [courseCode] - Optional filter for specific course
 * @returns {Object} { totalCa, maxCa, percentage }
 */
export function calculateCaMetrics(scores = [], studentId, courseCode = null) {
  const studentScores = scores.filter(s => s.studentId === studentId);
  const relevantScores = courseCode 
    ? studentScores.filter(s => s.courseCode === courseCode)
    : studentScores;

  if (!relevantScores.length) {
    return { totalCa: 0, maxCa: 40, percentage: 0 };
  }

  if (courseCode && relevantScores.length === 1) {
    const sc = relevantScores[0];
    return {
      totalCa: sc.totalCa || 0,
      maxCa: sc.maxCa || 40,
      percentage: sc.percentage ?? ((sc.totalCa / (sc.maxCa || 40)) * 100)
    };
  }

  const avgPercentage = relevantScores.reduce((sum, s) => sum + (s.percentage || 0), 0) / relevantScores.length;
  const totalCa = relevantScores.reduce((sum, s) => sum + (s.totalCa || 0), 0) / relevantScores.length;

  return {
    totalCa: Number(totalCa.toFixed(1)),
    maxCa: 40,
    percentage: Number(avgPercentage.toFixed(1))
  };
}

/**
 * Evaluates the comprehensive risk profile of a student across all enrolled courses.
 */
export function evaluateStudentOverallRisk(student, sessions = [], scores = [], settings = {}) {
  const courses = student.enrolledCourses || [];
  const courseEvaluations = [];

  let totalAttPct = 0;
  let totalCaPct = 0;
  let evaluatedCoursesCount = 0;

  courses.forEach(courseCode => {
    const att = calculateAttendanceMetrics(sessions, student.id, courseCode);
    const ca = calculateCaMetrics(scores, student.id, courseCode);
    const hasData = att.totalSessions > 0 || ca.totalCa > 0;
    const evaluation = hasData 
      ? evaluateRisk(att.percentage, ca.percentage, settings)
      : {
          attendancePercentage: 100,
          caPercentage: 100,
          attendanceRisk: false,
          caRisk: false,
          status: RISK_STATUSES.SAFE,
          reasons: ['No recorded sessions or tests yet in this course'],
          recommendations: ['Maintain regular class participation']
        };

    courseEvaluations.push({
      courseCode,
      attendance: att,
      ca,
      evaluation,
      hasData
    });

    if (hasData) {
      totalAttPct += att.percentage;
      totalCaPct += ca.percentage;
      evaluatedCoursesCount++;
    }
  });

  const overallAttPercentage = evaluatedCoursesCount > 0 ? totalAttPct / evaluatedCoursesCount : 100;
  const overallCaPercentage = evaluatedCoursesCount > 0 ? totalCaPct / evaluatedCoursesCount : 100;

  const overallRisk = evaluateRisk(overallAttPercentage, overallCaPercentage, settings);

  // Check if any single course with recorded data is in critical or at-risk status
  const activeCourseEvaluations = courseEvaluations.filter(ce => ce.hasData);
  const hasCriticalCourse = activeCourseEvaluations.some(ce => ce.evaluation.status === RISK_STATUSES.CRITICAL);
  const hasAtRiskCourse = activeCourseEvaluations.some(ce => ce.evaluation.status === RISK_STATUSES.AT_RISK);

  let compositeStatus = overallRisk.status;
  if (hasCriticalCourse) {
    compositeStatus = RISK_STATUSES.CRITICAL;
  } else if (hasAtRiskCourse && compositeStatus === RISK_STATUSES.SAFE) {
    compositeStatus = RISK_STATUSES.AT_RISK;
  }

  return {
    studentId: student.id,
    matricNumber: student.matricNumber,
    name: student.name,
    level: student.level,
    status: compositeStatus,
    overallAttendancePercentage: Number(overallAttPercentage.toFixed(1)),
    overallCaPercentage: Number(overallCaPercentage.toFixed(1)),
    overallRisk,
    courseEvaluations,
    criticalCoursesCount: courseEvaluations.filter(ce => ce.evaluation.status === RISK_STATUSES.CRITICAL).length,
    atRiskCoursesCount: courseEvaluations.filter(ce => ce.evaluation.status === RISK_STATUSES.AT_RISK).length,
  };
}
