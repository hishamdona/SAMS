import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import FudLogo from '../../components/common/FudLogo';
import { 
  Printer, 
  Download, 
  Search, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  School,
  Calendar,
  User,
  Clock,
  Filter,
  Users,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reportType, setReportType] = useState(searchParams.get('type') || 'student'); // 'student' | 'coordinator'
  
  // Student report state
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(searchParams.get('student') || '');
  const [dossier, setDossier] = useState(null);

  // Coordinator cohort report filters
  const [cohortLevelFilter, setCohortLevelFilter] = useState('all'); // 'all' | '100' | '200'
  const [cohortRiskFilter, setCohortRiskFilter] = useState('all'); // 'all' | 'at-risk' | 'critical'

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      const data = studentService.getStudentAcademicDossier(selectedStudentId);
      setDossier(data);
    }
  }, [selectedStudentId]);

  const loadData = () => {
    const list = studentService.getAllWithRiskMetrics('all');
    setStudents(list);
    const initialId = selectedStudentId || (list[0]?.id ?? '');
    if (initialId) {
      setSelectedStudentId(initialId);
      const data = studentService.getStudentAcademicDossier(initialId);
      setDossier(data);
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id);
    setSearchParams({ type: 'student', student: id });
    const data = studentService.getStudentAcademicDossier(id);
    setDossier(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    if (reportType === 'student' && dossier) {
      const matricClean = (dossier.student.matricNo || dossier.student.matricNumber).replace(/[\/\\]/g, '_');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossier, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `FUD_Academic_Dossier_${matricClean}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // Cohort download
      const cohortBundle = {
        title: "Federal University Dutse - Department of Computer Science SAMS Cohort Report",
        generatedAt: new Date().toISOString(),
        cohortLevel: cohortLevelFilter,
        riskFilter: cohortRiskFilter,
        students: filteredCohortStudents
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cohortBundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `FUD_SAMS_Cohort_Report_${cohortLevelFilter}L_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  // Filter cohort students for Coordinator report
  const filteredCohortStudents = students.filter(s => {
    const matchesLevel = cohortLevelFilter === 'all' || s.level === Number(cohortLevelFilter);
    if (!matchesLevel) return false;

    if (cohortRiskFilter === 'critical') return s.riskStatus === 'Critical At-Risk';
    if (cohortRiskFilter === 'at-risk') return s.riskStatus !== 'Safe';
    return true; // 'all'
  });

  const cohortSafeCount = filteredCohortStudents.filter(s => s.riskStatus === 'Safe').length;
  const cohortAtRiskCount = filteredCohortStudents.filter(s => s.riskStatus === 'At-Risk').length;
  const cohortCriticalCount = filteredCohortStudents.filter(s => s.riskStatus === 'Critical At-Risk').length;
  const cohortAvgAttendance = filteredCohortStudents.length > 0
    ? (filteredCohortStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / filteredCohortStudents.length).toFixed(1)
    : 0;
  const cohortAvgCa = filteredCohortStudents.length > 0
    ? (filteredCohortStudents.reduce((sum, s) => sum + s.caPercentage, 0) / filteredCohortStudents.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Report Mode Selector (Hidden in Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setReportType('student'); setSearchParams({ type: 'student', student: selectedStudentId }); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              reportType === 'student'
                ? 'bg-fud-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <User size={14} />
            <span>Individual Student Dossier</span>
          </button>

          <button
            onClick={() => { setReportType('coordinator'); setSearchParams({ type: 'coordinator' }); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              reportType === 'coordinator'
                ? 'bg-fud-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users size={14} />
            <span>Coordinator Cohort Report</span>
          </button>
        </div>

        {/* Dynamic Controls based on Report Type */}
        {reportType === 'student' ? (
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700">Select Student:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-fud-500 shadow-2xs"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.matricNo || s.matricNumber}) — {s.level}L [{s.riskStatus}]
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Level:</label>
              <select
                value={cohortLevelFilter}
                onChange={(e) => setCohortLevelFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-fud-500"
              >
                <option value="all">All Monitored Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Filter Risk:</label>
              <select
                value={cohortRiskFilter}
                onChange={(e) => setCohortRiskFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-fud-500"
              >
                <option value="all">All Students ({students.length})</option>
                <option value="at-risk">All At-Risk (Moderate & Critical)</option>
                <option value="critical">Critical At-Risk Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Print & Download Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} />
            <span>Download Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INDIVIDUAL STUDENT ACADEMIC REPORT (PRINT-READY)                       */}
      {/* ========================================================================= */}
      {reportType === 'student' && dossier && (
        <div className="report-sheet bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-card max-w-4xl mx-auto space-y-6 text-slate-900">
          {/* Institutional Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
            <div className="flex justify-center mb-2">
              <FudLogo className="w-20 h-20 drop-shadow-sm" />
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">
              FEDERAL UNIVERSITY DUTSE
            </h1>
            <h2 className="font-bold text-sm sm:text-base text-slate-800 uppercase tracking-wider">
              DEPARTMENT OF COMPUTER SCIENCE
            </h2>
            <div className="pt-1.5">
              <span className="inline-block bg-slate-900 text-white text-xs font-extrabold px-3 py-1 rounded uppercase tracking-widest">
                STUDENT ACADEMIC MONITORING SYSTEM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest pt-1">
              Official Academic Monitoring & Early-Warning Dossier
            </p>
          </div>

          {/* 1. Student Information */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Student Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Name:</span>
                <span className="font-extrabold text-slate-900 text-sm">{dossier.student.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Matric Number:</span>
                <span className="font-mono font-bold text-fud-900 text-sm">{dossier.student.matricNo || dossier.student.matricNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Academic Level:</span>
                <span className="font-bold text-slate-900">{dossier.student.level} Level</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Department:</span>
                <span className="font-medium text-slate-800">{dossier.student.department || 'Department of Computer Science'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Academic Session:</span>
                <span className="font-medium text-slate-800">{dossier.settings.session} • {dossier.settings.semester}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Date Generated:</span>
                <span className="font-medium text-slate-800">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* 2. Course Performance Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Course Performance & Component Matrix
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3 text-center">Units</th>
                    <th className="py-2.5 px-3 text-center">Attendance %</th>
                    <th className="py-2.5 px-3 text-center">CA Score %</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dossier.courseBreakdown.map((cb) => (
                    <tr key={cb.courseCode} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-fud-900">{cb.courseCode}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{cb.courseTitle}</td>
                      <td className="py-2.5 px-3 text-center font-semibold">{cb.creditUnits}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold ${cb.attendance.percentage < 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {cb.attendance.percentage}%
                        </span>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          ({cb.attendance.attendedSessions}/{cb.attendance.totalSessions})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-bold ${cb.ca.percentage < 40 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {cb.ca.percentage}%
                        </span>
                        <span className="text-[10px] text-slate-500 block font-normal">
                          ({cb.ca.totalCa}/40)
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

          {/* 3. Attendance & 4. CA Scores Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 3. Attendance Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] flex items-center justify-between">
                <span>3. Attendance Summary</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dossier.riskProfile.overallAttendancePercentage >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {dossier.riskProfile.overallAttendancePercentage >= 60 ? 'PASS (≥60%)' : 'FAIL (<60%)'}
                </span>
              </h4>
              <div className="text-2xl font-extrabold text-slate-900">{dossier.riskProfile.overallAttendancePercentage}%</div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Cumulative lecture attendance recorded across {dossier.courseBreakdown.length} enrolled courses. Minimum statutory FUD examination requirement is <strong>60%</strong>.
              </p>
            </div>

            {/* 4. CA Scores Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] flex items-center justify-between">
                <span>4. CA Scores Summary</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  dossier.riskProfile.overallCaPercentage >= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {dossier.riskProfile.overallCaPercentage >= 40 ? 'PASS (≥40%)' : 'FAIL (<40%)'}
                </span>
              </h4>
              <div className="text-2xl font-extrabold text-slate-900">{dossier.riskProfile.overallCaPercentage}%</div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Continuous assessment weighted average across Tests, Quizzes, and Assignments (max 40 marks). Minimum passing threshold is <strong>40%</strong>.
              </p>
            </div>
          </div>

          {/* 5. Risk Assessment Summary (Exact format required by thesis) */}
          <div className="p-5 bg-white rounded-xl border-2 border-slate-900 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                5. Academic Risk Assessment Summary
              </h3>
              <RiskBadge status={dossier.riskProfile.status} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Attendance Risk</span>
                <strong className={`text-sm ${dossier.riskProfile.overallRisk.attendanceRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {dossier.riskProfile.overallRisk.attendanceRisk ? 'Detected' : 'Not Detected'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">CA Risk</span>
                <strong className={`text-sm ${dossier.riskProfile.overallRisk.caRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {dossier.riskProfile.overallRisk.caRisk ? 'Detected' : 'Not Detected'}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Overall Standing</span>
                <strong className={`text-sm ${
                  dossier.riskProfile.status === 'Critical At-Risk' ? 'text-rose-600' : dossier.riskProfile.status === 'At-Risk' ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {dossier.riskProfile.status}
                </strong>
              </div>
            </div>

            {/* Diagnostic Reasons List */}
            <div className="space-y-1 pt-1">
              <span className="font-bold text-slate-900 text-[11px]">Primary Risk Factors & Reasons:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                {dossier.riskProfile.overallRisk.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Action Directives */}
            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-[11px]">Remedial Directives & Interventions:</span>
              <p className="text-[11px] text-slate-700 mt-0.5">
                {dossier.riskProfile.overallRisk.recommendations.join(' • ')}
              </p>
            </div>
          </div>

          {/* 6. Alerts & Warning History */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              6. System-Dispatched Alerts & Warning Notices ({dossier.alerts.length})
            </h3>
            {dossier.alerts.length === 0 ? (
              <p className="text-slate-500 text-xs py-2">No warning alerts recorded for this student.</p>
            ) : (
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs p-1">
                {dossier.alerts.map((al) => (
                  <div key={al.id} className="p-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{al.type}</span>
                        <span className="font-mono text-[10px] text-fud-700 bg-slate-100 px-1.5 rounded">{al.courseCode}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5">{al.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(al.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Sign-Off Block */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-slate-800">
            <div className="space-y-8">
              <div className="border-b border-slate-400 h-10"></div>
              <div>
                <div className="font-bold">Mal. Ibrahim Sani</div>
                <div className="text-[11px] text-slate-500">Level Coordinator (100L/200L)</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: ____________________</div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-400 h-10"></div>
              <div>
                <div className="font-bold">Prof. A. B. Danbaba</div>
                <div className="text-[11px] text-slate-500">Head of Department (HOD)</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: ____________________</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Departmental Official Stamp & Seal
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. COORDINATOR CONSOLIDATED COHORT REPORT (PRINT-READY)                   */}
      {/* ========================================================================= */}
      {reportType === 'coordinator' && (
        <div className="report-sheet bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-card max-w-5xl mx-auto space-y-6 text-slate-900">
          {/* Institutional Header */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1.5">
            <div className="flex justify-center mb-2">
              <FudLogo className="w-20 h-20 drop-shadow-sm" />
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 uppercase tracking-wide">
              FEDERAL UNIVERSITY DUTSE
            </h1>
            <h2 className="font-bold text-sm sm:text-base text-slate-800 uppercase tracking-wider">
              DEPARTMENT OF COMPUTER SCIENCE
            </h2>
            <div className="pt-1.5">
              <span className="inline-block bg-slate-900 text-white text-xs font-extrabold px-3 py-1 rounded uppercase tracking-widest">
                COHORT ACADEMIC SURVEILLANCE & RISK REPORT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest pt-1">
              Scope: {cohortLevelFilter === 'all' ? 'All Monitored Levels (100L & 200L)' : `${cohortLevelFilter} Level Cohort`} • Filter: {cohortRiskFilter.toUpperCase()}
            </p>
          </div>

          {/* Cohort Summary Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Monitored</span>
              <strong className="text-xl font-extrabold text-slate-900 mt-0.5 block">{filteredCohortStudents.length}</strong>
              <span className="text-[10px] text-slate-400">Students</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Safe & Compliant</span>
              <strong className="text-xl font-extrabold text-emerald-800 mt-0.5 block">{cohortSafeCount}</strong>
              <span className="text-[10px] text-emerald-600">Att ≥60% & CA ≥40%</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Moderate At-Risk</span>
              <strong className="text-xl font-extrabold text-amber-800 mt-0.5 block">{cohortAtRiskCount}</strong>
              <span className="text-[10px] text-amber-600">Single limit breach</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Critical At-Risk</span>
              <strong className="text-xl font-extrabold text-rose-800 mt-0.5 block">{cohortCriticalCount}</strong>
              <span className="text-[10px] text-rose-600">Both limits breached</span>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-indigo-700 uppercase block">Cohort Avg Rate</span>
              <strong className="text-xl font-extrabold text-indigo-900 mt-0.5 block">{cohortAvgAttendance}%</strong>
              <span className="text-[10px] text-indigo-600">Avg CA: {cohortAvgCa}%</span>
            </div>
          </div>

          {/* Consolidated Cohort Roster Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              Consolidated Student Risk Roster ({filteredCohortStudents.length} Students)
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Matriculation No.</th>
                    <th className="py-2.5 px-3 text-center">Level</th>
                    <th className="py-2.5 px-3 text-center">Attendance %</th>
                    <th className="py-2.5 px-3 text-center">Avg CA %</th>
                    <th className="py-2.5 px-3">Risk Status</th>
                    <th className="py-2.5 px-3">Primary Risk Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCohortStudents.map((s, idx) => {
                    const isCritical = s.riskStatus === 'Critical At-Risk';
                    const isAtRisk = s.riskStatus === 'At-Risk';
                    const matric = s.matricNo || s.matricNumber;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{s.name}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-fud-900">{matric}</td>
                        <td className="py-2.5 px-3 text-center font-semibold">{s.level}L</td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          <span className={s.attendancePercentage < 60 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                            {s.attendancePercentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono">
                          <span className={s.caPercentage < 40 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                            {s.caPercentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <RiskBadge status={s.riskStatus} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {isCritical
                            ? 'Attendance < 60% AND CA < 40%'
                            : isAtRisk
                            ? (s.attendancePercentage < 60 ? 'Attendance < 60%' : 'CA < 40%')
                            : 'Normal academic standing'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Sign-Off Block */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-xs text-slate-800">
            <div className="space-y-8">
              <div className="border-b border-slate-400 h-10"></div>
              <div>
                <div className="font-bold">Mal. Ibrahim Sani</div>
                <div className="text-[11px] text-slate-500">Level Coordinator (100L/200L)</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: ____________________</div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-400 h-10"></div>
              <div>
                <div className="font-bold">Prof. A. B. Danbaba</div>
                <div className="text-[11px] text-slate-500">Head of Department (HOD)</div>
                <div className="text-[10px] text-slate-400 mt-1">Date: ____________________</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Departmental Official Stamp & Seal
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
