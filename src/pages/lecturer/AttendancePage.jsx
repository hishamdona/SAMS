import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { courseService } from '../../services/courseService';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { 
  CalendarCheck, 
  Check, 
  X, 
  Clock, 
  Save, 
  Plus, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Sparkles,
  Users,
  BellRing
} from 'lucide-react';

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(searchParams.get('course') || '');
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('new');
  
  // Active session form
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionTopic, setSessionTopic] = useState('');
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: 'present' | 'absent' | 'late' }
  const [students, setStudents] = useState([]);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'alert', message: '', alertCount: 0 }
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseCode) {
      loadCourseData(selectedCourseCode);
    }
  }, [selectedCourseCode]);

  const loadCourses = () => {
    const user = authService.getCurrentUser();
    const allCourses = courseService.getAll();
    const myCourses = user?.role === 'lecturer'
      ? allCourses.filter(c => c.lecturerId === user.id || (user.assignedCourses && user.assignedCourses.includes(c.code)))
      : allCourses;

    setCourses(myCourses);
    const initialCode = selectedCourseCode || (myCourses[0]?.code ?? '');
    if (initialCode) {
      setSelectedCourseCode(initialCode);
    }
  };

  const loadCourseData = (courseCode) => {
    const sessionList = attendanceService.getSessionsByCourse(courseCode);
    setSessions(sessionList);

    const allStudents = studentService.getAll();
    const enrolled = allStudents.filter(s => s.enrolledCourses && s.enrolledCourses.includes(courseCode));
    setStudents(enrolled);

    // Default to a new session
    handleSelectSession('new', sessionList, enrolled);
  };

  const handleSelectSession = (sessionId, currentSessions = sessions, enrolledStudents = students) => {
    setSelectedSessionId(sessionId);
    setFeedback(null);

    if (sessionId === 'new') {
      setSessionDate(new Date().toISOString().slice(0, 10));
      setSessionTopic(`Lecture Session #${currentSessions.length + 1}: Course Curriculum`);
      // Default all enrolled students to 'present' for convenient workflow
      const defaultMap = {};
      enrolledStudents.forEach(st => {
        defaultMap[st.id] = 'present';
      });
      setAttendanceMap(defaultMap);
    } else {
      const existing = currentSessions.find(s => s.id === sessionId);
      if (existing) {
        setSessionDate(existing.date);
        setSessionTopic(existing.topic || '');
        const map = { ...existing.records };
        enrolledStudents.forEach(st => {
          if (!map[st.id]) map[st.id] = 'absent';
        });
        setAttendanceMap(map);
      }
    }
  };

  const handleToggleStatus = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const newMap = {};
    students.forEach(st => {
      newMap[st.id] = status;
    });
    setAttendanceMap(newMap);
  };

  const toast = useToast();
  const [deleteSessionModal, setDeleteSessionModal] = useState({ open: false, sessionId: null });

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    if (!selectedCourseCode) return;

    // Save session via service (this automatically runs risk engine & generates alerts)
    const saved = attendanceService.saveSession({
      id: selectedSessionId === 'new' ? undefined : selectedSessionId,
      courseCode: selectedCourseCode,
      date: sessionDate,
      topic: sessionTopic || `Lecture on ${sessionDate}`,
      records: attendanceMap
    });

    // Re-fetch updated sessions to calculate new percentages
    const updatedSessions = attendanceService.getSessionsByCourse(selectedCourseCode);
    setSessions(updatedSessions);
    setSelectedSessionId(saved.id);

    // Count how many students are now below 60%
    let lowCount = 0;
    students.forEach(st => {
      const metric = attendanceService.calculateAttendanceMetrics 
        ? attendanceService.calculateAttendanceMetrics(updatedSessions, st.id, selectedCourseCode)
        : { percentage: 80 };
      if (metric?.percentage < 60) lowCount++;
    });

    if (lowCount > 0) {
      toast.warning(`Attendance for ${selectedCourseCode} saved. Risk alerts generated for ${lowCount} student(s) below 60%.`);
    } else {
      toast.success(`Attendance for ${selectedCourseCode} (${sessionDate}) saved successfully.`);
    }

    setFeedback({
      type: lowCount > 0 ? 'alert' : 'success',
      message: lowCount > 0 
        ? `Attendance saved successfully. Risk alert generated for ${lowCount} student(s) below the 60% threshold.`
        : `Attendance saved successfully. All student records updated.`
    });

    setTimeout(() => setFeedback(null), 5000);
  };

  const handleConfirmDeleteSession = () => {
    if (!deleteSessionModal.sessionId) return;
    attendanceService.deleteSession(deleteSessionModal.sessionId);
    const updated = attendanceService.getSessionsByCourse(selectedCourseCode);
    setSessions(updated);
    handleSelectSession('new', updated, students);
    setDeleteSessionModal({ open: false, sessionId: null });
    toast.info('Attendance session removed.');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.matricNo || s.matricNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Present/Absent counts in current session form
  const presentCount = Object.values(attendanceMap).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceMap).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter(v => v === 'late').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Lecture Attendance Register</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Attendance percentage = (attended classes / total classes) × 100. Below 60% triggers early-warning risk alerts.
          </p>
        </div>

        {/* Course Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Select Course:</label>
          <select
            value={selectedCourseCode}
            onChange={(e) => {
              setSelectedCourseCode(e.target.value);
              setSearchParams({ course: e.target.value });
            }}
            className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white shadow-xs focus:ring-2 focus:ring-fud-500"
          >
            {courses.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.title} ({c.level}L)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation Message */}
      {feedback && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 animate-in fade-in border ${
          feedback.type === 'alert'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            {feedback.type === 'alert' ? (
              <BellRing size={16} className="text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
            Real-Time Synchronization
          </span>
        </div>
      )}

      {/* Main Layout: Session Selector Sidebar + Attendance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Recorded Sessions List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-3 lg:col-span-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <History size={14} className="text-slate-500" />
              <span>Sessions List ({sessions.length})</span>
            </span>
          </div>

          <button
            onClick={() => handleSelectSession('new')}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedSessionId === 'new'
                ? 'bg-fud-900 text-white shadow-sm'
                : 'bg-fud-50 text-fud-900 hover:bg-fud-100 border border-fud-200'
            }`}
          >
            <Plus size={14} />
            <span>Take New Attendance</span>
          </button>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No sessions recorded yet.</p>
            ) : (
              sessions.map((s, idx) => {
                const isSelected = selectedSessionId === s.id;
                const presentInSession = Object.values(s.records || {}).filter(v => v === 'present').length;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span>Lecture #{sessions.length - idx}</span>
                        <span className={isSelected ? 'text-slate-400' : 'text-slate-300'}>•</span>
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>{s.date}</span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {s.topic}
                      </p>
                      <div className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'} font-medium`}>
                        {presentInSession}/{students.length} Present
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteSessionModal({ open: true, sessionId: s.id });
                      }}
                      className={`p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition ${
                        isSelected ? 'hover:text-rose-200' : 'hover:text-rose-600'
                      }`}
                      title="Delete this lecture session"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Attendance Marking Sheet */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 lg:col-span-3 space-y-4">
          <form onSubmit={handleSaveAttendance} className="space-y-4">
            {/* Session Info Bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    {selectedSessionId === 'new' ? 'New Lecture Register' : 'Editing Lecture Register'}
                  </span>
                  <span className="bg-fud-50 text-fud-800 border border-fud-200 text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedCourseCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {presentCount} Present
                  </span>
                  <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {lateCount} Late
                  </span>
                  <span className="text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    {absentCount} Absent
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lecture Date</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Lecture Topic / Syllabus Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Object-Oriented Principles: Inheritance & Polymorphism"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick Batch Marking Actions & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 mr-1">Batch Mark:</span>
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Mark All Absent
                </button>
              </div>

              <div className="relative min-w-[220px]">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name or matric..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Students Attendance List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Matriculation No.</th>
                      <th className="py-2.5 px-3">Overall Attendance Rate</th>
                      <th className="py-2.5 px-3 text-center">Session Status</th>
                      <th className="py-2.5 px-3 text-right">Risk Warning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((st, idx) => {
                      const currentStatus = attendanceMap[st.id] || 'absent';
                      const overallMetric = calculateAttendanceMetrics(sessions, st.id, selectedCourseCode);
                      const isAtRisk = overallMetric.percentage < 60;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{st.name}</td>
                          <td className="py-2.5 px-3 font-mono text-fud-700 font-medium">
                            {st.matricNo || st.matricNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold font-mono ${
                                isAtRisk ? 'text-rose-600' : 'text-emerald-700'
                              }`}>
                                {overallMetric.percentage}%
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({overallMetric.attendedSessions}/{overallMetric.totalSessions})
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(st.id, 'present')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                  currentStatus === 'present'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <Check size={12} />
                                <span>Present</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(st.id, 'late')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                  currentStatus === 'late'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <Clock size={12} />
                                <span>Late</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(st.id, 'absent')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                  currentStatus === 'absent'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <X size={12} />
                                <span>Absent</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {isAtRisk ? (
                              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                &lt;60% At-Risk
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                Safe
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Saving will execute the risk engine and generate SMS notifications for any student dropping below 60%.
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <Save size={15} />
                <span>Save Attendance Records</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Session Modal */}
      <ConfirmModal
        isOpen={deleteSessionModal.open}
        onClose={() => setDeleteSessionModal({ open: false, sessionId: null })}
        onConfirm={handleConfirmDeleteSession}
        title="Delete Attendance Session"
        description="Are you sure you want to delete this lecture attendance record? Student cumulative attendance percentages and risk standings will be recalculated immediately."
        confirmLabel="Delete Session"
        variant="danger"
      />
    </div>
  );
}
