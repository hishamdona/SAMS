import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { courseService } from '../../services/courseService';
import RiskBadge from '../../components/common/RiskBadge';
import { 
  BookOpen, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  Search, 
  GraduationCap, 
  CheckCircle, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function LecturerCoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(searchParams.get('course') || '');
  const [courseAnalytics, setCourseAnalytics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, [selectedCourseCode]);

  const loadData = () => {
    const user = authService.getCurrentUser();
    const allCourses = courseService.getAll();
    const myCourses = user?.role === 'lecturer'
      ? allCourses.filter(c => c.lecturerId === user.id || (user.assignedCourses && user.assignedCourses.includes(c.code)))
      : allCourses;

    setCourses(myCourses);

    const activeCode = selectedCourseCode || (myCourses[0]?.code ?? '');
    if (activeCode) {
      setSelectedCourseCode(activeCode);
      const data = courseService.getCourseAnalytics(activeCode);
      setCourseAnalytics(data);
    }
  };

  const handleSelectCourse = (code) => {
    setSelectedCourseCode(code);
    setSearchParams({ course: code });
    const data = courseService.getCourseAnalytics(code);
    setCourseAnalytics(data);
  };

  const filteredStudentRows = (courseAnalytics?.studentRows || []).filter(row => 
    row.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Assigned Courses & Class Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor class performance and enrolled student academic standings.
          </p>
        </div>

        {selectedCourseCode && (
          <div className="flex items-center gap-2">
            <Link
              to={`/lecturer/attendance?course=${selectedCourseCode}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <CalendarCheck size={14} />
              <span>Record Attendance</span>
            </Link>
            <Link
              to={`/lecturer/ca-scores?course=${selectedCourseCode}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-fud-900 hover:bg-fud-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <FileSpreadsheet size={14} />
              <span>Enter CA Scores</span>
            </Link>
          </div>
        )}
      </div>

      {/* Course Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {courses.map((c) => {
          const isSelected = selectedCourseCode === c.code;
          return (
            <button
              key={c.code}
              onClick={() => handleSelectCourse(c.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 whitespace-nowrap ${
                isSelected
                  ? 'border-fud-600 bg-white text-fud-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <span className="font-mono text-fud-700">{c.code}</span>
              <span>{c.title}</span>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {c.level}L
              </span>
            </button>
          );
        })}
      </div>

      {courseAnalytics && (
        <div className="space-y-6">
          {/* Course Summary Banner */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Course Code & Units</div>
              <div className="text-base font-bold text-slate-900 font-mono mt-0.5">
                {courseAnalytics.course.code} ({courseAnalytics.course.creditUnits} Credit Units)
              </div>
              <div className="text-xs text-slate-600 mt-0.5">{courseAnalytics.course.title}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Class Attendance Rate</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {courseAnalytics.avgAttendance}% Average
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{courseAnalytics.sessions.length} Recorded Lecture Sessions</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Continuous Assessment (CA)</div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {courseAnalytics.avgCa}% Class Average
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Pass standard: ≥40%</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 font-medium">Risk Diagnostics</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  {courseAnalytics.safeCount} Safe
                </span>
                <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  {courseAnalytics.atRiskCount} Warning
                </span>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  {courseAnalytics.criticalCount} Critical
                </span>
              </div>
            </div>
          </div>

          {/* Enrolled Students Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-sm text-slate-900">Enrolled Student Roster ({filteredStudentRows.length})</h2>
                <p className="text-[11px] text-slate-500">Live attendance and CA calculations in {selectedCourseCode}</p>
              </div>

              <div className="relative min-w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter student by name or matric..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Student & Matric Number</th>
                    <th className="py-3 px-4">Attendance Rate</th>
                    <th className="py-3 px-4">Test 1 (15)</th>
                    <th className="py-3 px-4">Test 2 (15)</th>
                    <th className="py-3 px-4">Assign (10)</th>
                    <th className="py-3 px-4">Total CA (%)</th>
                    <th className="py-3 px-4">Course Risk Status</th>
                    <th className="py-3 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudentRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No enrolled students matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredStudentRows.map((row) => (
                      <tr key={row.student.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-medium text-slate-900">
                          <div>{row.student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{row.student.matricNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold ${
                              row.attendance.percentage < 60 ? 'text-rose-600 font-bold' : 'text-slate-700'
                            }`}>
                              {row.attendance.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({row.attendance.attendedSessions}/{row.attendance.totalSessions})
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">{row.ca.test1}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">{row.ca.test2}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">{row.ca.assignment}</td>
                        <td className="py-3.5 px-4">
                          <span className={`font-semibold font-mono ${
                            row.ca.percentage < 40 ? 'text-rose-600 font-bold' : 'text-slate-900'
                          }`}>
                            {row.ca.percentage}% ({row.ca.totalCa}/40)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <RiskBadge status={row.risk.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/coordinator/reports?student=${row.student.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition"
                          >
                            Dossier
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
