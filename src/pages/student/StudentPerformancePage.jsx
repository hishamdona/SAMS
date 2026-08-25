import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import { 
  BarChart3, 
  CalendarCheck, 
  FileSpreadsheet, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function StudentPerformancePage() {
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadData = () => {
    const user = authService.getCurrentUser();
    const studentId = user?.studentId || 'stu-200-01';
    const data = studentService.getStudentAcademicDossier(studentId);
    setDossier(data);
  };

  if (!dossier) return null;

  const { student, riskProfile, courseBreakdown } = dossier;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">Course-by-Course Academic Performance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Detailed breakdown of lecture attendance metrics and continuous assessment (CA) components.
        </p>
      </div>

      {/* Course Cards Grid */}
      <div className="space-y-5">
        {courseBreakdown.map((cb) => {
          const isAttRisk = cb.attendance.percentage < 60;
          const isCaRisk = cb.ca.percentage < 40;
          const isCourseCritical = isAttRisk && isCaRisk;

          return (
            <div
              key={cb.courseCode}
              className={`bg-white rounded-2xl border shadow-subtle p-6 transition space-y-5 ${
                isCourseCritical
                  ? 'border-rose-200 bg-rose-50/10'
                  : isAttRisk || isCaRisk
                  ? 'border-amber-200 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              {/* Course Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-fud-900 bg-fud-50 border border-fud-200 px-2.5 py-0.5 rounded-lg">
                      {cb.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">({cb.creditUnits} Credit Units)</span>
                  </div>
                  <h2 className="font-bold text-base text-slate-900 mt-1">{cb.courseTitle}</h2>
                  <p className="text-xs text-slate-500">Lecturer: {cb.lecturerName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge status={cb.evaluation.status} size="md" />
                </div>
              </div>

              {/* Attendance & CA Dual Gauge Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance Gauge */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-700 flex items-center gap-1.5">
                      <CalendarCheck size={15} className="text-fud-500" />
                      <span>Lecture Attendance</span>
                    </span>
                    <span className={`text-xs font-bold ${isAttRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {cb.attendance.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isAttRisk ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, cb.attendance.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Attended: <strong>{cb.attendance.attendedSessions}</strong> of <strong>{cb.attendance.totalSessions}</strong> lectures</span>
                    <span>Min Standard: 60%</span>
                  </div>

                  {isAttRisk && (
                    <div className="text-[11px] text-rose-700 font-medium bg-rose-50 p-2 rounded border border-rose-100">
                      Warning: Below 60% attendance threshold. Risk of exam disqualification.
                    </div>
                  )}
                </div>

                {/* CA Breakdown Gauge */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-700 flex items-center gap-1.5">
                      <FileSpreadsheet size={15} className="text-fud-500" />
                      <span>Continuous Assessment (CA)</span>
                    </span>
                    <span className={`text-xs font-bold ${isCaRisk ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {cb.ca.percentage}% ({cb.ca.totalCa}/40)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCaRisk ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, cb.ca.percentage)}%` }}
                    ></div>
                  </div>

                  {/* Component Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Test 1</span>
                      <strong className="text-slate-800">{cb.ca.test1} / 15</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Test 2</span>
                      <strong className="text-slate-800">{cb.ca.test2} / 15</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Assignment</span>
                      <strong className="text-slate-800">{cb.ca.assignment} / 10</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations & Actionable Guidance */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs flex items-start gap-2.5">
                <Sparkles size={16} className="text-fud-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-800">Academic Standing Advice:</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {cb.evaluation.recommendations.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
