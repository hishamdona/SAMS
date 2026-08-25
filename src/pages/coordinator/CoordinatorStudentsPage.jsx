import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  FileText, 
  X, 
  Phone, 
  Mail, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function CoordinatorStudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudentDossier, setSelectedStudentDossier] = useState(null);

  useEffect(() => {
    loadStudents();
    const handleUpdate = () => loadStudents();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadStudents = () => {
    setStudents(studentService.getAllWithRiskMetrics('all'));
  };

  const handleOpenDossier = (studentId) => {
    const dossier = studentService.getStudentAcademicDossier(studentId);
    setSelectedStudentDossier(dossier);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || s.level === Number(levelFilter);
    const matchesStatus = statusFilter === 'all' || s.riskStatus === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Student Academic Monitoring Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed 100L and 200L academic records with comprehensive course-by-course diagnostics.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, matric number, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Level:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-fud-500"
            >
              <option value="all">All Levels ({students.length})</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Risk Standing:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-fud-500"
            >
              <option value="all">All Standings</option>
              <option value="Safe">Safe</option>
              <option value="At-Risk">At-Risk</option>
              <option value="Critical At-Risk">Critical At-Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Matric No.</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Avg CA Score</th>
                <th className="py-3 px-4">Risk Standing</th>
                <th className="py-3 px-4">Advisor</th>
                <th className="py-3 px-4 text-right">Academic Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No student records matching current filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-fud-50 text-fud-800 border border-fud-200 flex items-center justify-center font-bold text-xs shrink-0">
                          {stu.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{stu.name}</div>
                          <div className="text-[10px] text-fud-700 font-mono font-medium">{stu.matricNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {stu.level}L
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${
                        stu.attendancePercentage < 60 ? 'text-rose-600 font-bold' : 'text-slate-700'
                      }`}>
                        {stu.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${
                        stu.caPercentage < 40 ? 'text-rose-600 font-bold' : 'text-slate-700'
                      }`}>
                        {stu.caPercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge status={stu.riskStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {stu.advisor || 'Mal. Ibrahim Sani'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDossier(stu.id)}
                          className="px-2.5 py-1 bg-fud-50 hover:bg-fud-100 text-fud-900 rounded text-[11px] font-semibold transition"
                        >
                          Quick Profile
                        </button>
                        <Link
                          to={`/coordinator/reports?student=${stu.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition"
                          title="Generate Official FUD Monitoring Report"
                        >
                          Print Report
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Academic Profile Dossier Modal */}
      {selectedStudentDossier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base">{selectedStudentDossier.student.name}</h3>
                  <RiskBadge status={selectedStudentDossier.riskProfile.status} size="sm" />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedStudentDossier.student.matricNumber} • {selectedStudentDossier.student.level} Level • {selectedStudentDossier.student.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Overall Metrics Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Overall Attendance</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedStudentDossier.riskProfile.overallAttendancePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-500">Min Threshold: 60%</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Overall CA Average</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedStudentDossier.riskProfile.overallCaPercentage}%
                  </div>
                  <div className="text-[10px] text-slate-500">Min Pass: 40%</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Critical Courses</div>
                  <div className="text-base font-bold text-rose-600 mt-0.5">
                    {selectedStudentDossier.riskProfile.criticalCoursesCount} Courses
                  </div>
                  <div className="text-[10px] text-slate-500">Immediate Risk</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Warning Courses</div>
                  <div className="text-base font-bold text-amber-600 mt-0.5">
                    {selectedStudentDossier.riskProfile.atRiskCoursesCount} Courses
                  </div>
                  <div className="text-[10px] text-slate-500">Moderate Risk</div>
                </div>
              </div>

              {/* Risk Engine Diagnostic Reasons & Recommendations */}
              {selectedStudentDossier.riskProfile.status !== 'Safe' && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="font-semibold text-rose-800 flex items-center gap-1.5">
                    <ShieldAlert size={15} className="text-rose-600" />
                    <span>Risk Engine Diagnostic Assessment:</span>
                  </div>
                  <ul className="list-disc list-inside text-rose-700 space-y-1 text-[11px]">
                    {selectedStudentDossier.riskProfile.overallRisk.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-rose-200/60 font-medium text-rose-800 text-[11px]">
                    <strong>Recommended Actions:</strong> {selectedStudentDossier.riskProfile.overallRisk.recommendations.join(' • ')}
                  </div>
                </div>
              )}

              {/* Course-by-Course Academic Matrix */}
              <div>
                <h4 className="font-semibold text-xs text-slate-900 mb-2">Registered Courses & Performance Matrix</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Course</th>
                        <th className="py-2.5 px-3">Lecturer</th>
                        <th className="py-2.5 px-3">Attendance</th>
                        <th className="py-2.5 px-3">CA (T1/T2/Ass)</th>
                        <th className="py-2.5 px-3">Total CA</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedStudentDossier.courseBreakdown.map((cb) => (
                        <tr key={cb.courseCode} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            <span className="font-mono text-fud-700">{cb.courseCode}</span>
                            <div className="text-[10px] text-slate-500 font-normal">{cb.courseTitle}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">{cb.lecturerName}</td>
                          <td className="py-2.5 px-3 font-semibold">
                            <span className={cb.attendance.percentage < 60 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                              {cb.attendance.percentage}%
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {cb.attendance.attendedSessions}/{cb.attendance.totalSessions} classes
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">
                            {cb.ca.test1}/{cb.ca.test2}/{cb.ca.assignment}
                          </td>
                          <td className="py-2.5 px-3 font-semibold">
                            <span className={cb.ca.percentage < 40 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                              {cb.ca.percentage}% ({cb.ca.totalCa}/40)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <RiskBadge status={cb.evaluation.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <Link
                to={`/coordinator/reports?student=${selectedStudentDossier.student.id}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-lg font-semibold shadow-sm transition"
              >
                <FileText size={14} />
                <span>Open Full Printable Academic Report</span>
              </Link>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
