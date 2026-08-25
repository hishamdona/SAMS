import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  School, 
  MapPin, 
  UserCheck, 
  BookOpen, 
  ShieldCheck,
  Calendar,
  Award,
  Clock
} from 'lucide-react';

export default function StudentProfilePage() {
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const studentId = user?.studentId || 'stu-200-01';
    const data = studentService.getStudentAcademicDossier(studentId);
    setDossier(data);
  }, []);

  if (!dossier) return null;

  const { student, riskProfile, courseBreakdown, settings } = dossier;
  const matric = student.matricNo || student.matricNumber;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">Student Profile & Academic Registration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official departmental student record and course enrollment schedule.
        </p>
      </div>

      {/* Student Biodata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fud-900 to-fud-700 text-white flex items-center justify-center font-bold text-2xl shadow-md border border-fud-800">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{student.name}</h2>
                <RiskBadge status={riskProfile.status} size="sm" />
              </div>
              <p className="text-xs text-fud-700 font-mono font-semibold mt-0.5">{matric}</p>
              <p className="text-xs text-slate-500">{student.level} Level • Department of Computer Science</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div>Session: <strong>{student.session || settings.session || '2025/2026'}</strong></div>
            <div>Semester: <strong>{settings.semester || 'First Semester'}</strong></div>
          </div>
        </div>

        {/* Details Grid (Name, Matric, Level, Department, Phone, Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <User size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Full Student Name</span>
              <span className="font-semibold text-slate-900">{student.name}</span>
              <span className="text-slate-500 block text-[11px]">Undergraduate Candidate</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <GraduationCap size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Matriculation Number</span>
              <span className="font-mono font-bold text-fud-900">{matric}</span>
              <span className="text-slate-500 block text-[11px]">{student.level} Level Computer Science</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <School size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Academic Department</span>
              <span className="font-semibold text-slate-900">{student.department || 'Department of Computer Science'}</span>
              <span className="text-slate-500 block text-[11px]">Federal University Dutse (FUD)</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <Phone size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Contact Phone (SMS Alerts)</span>
              <span className="font-mono font-semibold text-slate-900">{student.phone}</span>
              <span className="text-slate-500 block text-[11px]">Simulated Mobile Carrier Active</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <Mail size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Institutional Email</span>
              <span className="font-semibold text-slate-900">{student.email}</span>
              <span className="text-slate-500 block text-[11px]">Student Webmail Account</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <UserCheck size={16} className="text-fud-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Level Coordinator / Advisor</span>
              <span className="font-semibold text-slate-900">{student.advisor || 'Mal. Ibrahim Sani'}</span>
              <span className="text-slate-500 block text-[11px]">100L / 200L Coordinator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-fud-500" />
            <h3 className="font-bold text-sm text-slate-900">Enrolled Semester Courses ({courseBreakdown.length})</h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Total Load: {courseBreakdown.reduce((sum, c) => sum + c.creditUnits, 0)} Credit Units
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {courseBreakdown.map((cb) => (
            <div
              key={cb.courseCode}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-mono font-bold text-fud-900 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                  {cb.courseCode}
                </span>
                <div className="font-semibold text-slate-900 mt-1">{cb.courseTitle}</div>
                <div className="text-[11px] text-slate-500">Lecturer: {cb.lecturerName}</div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {cb.creditUnits} Units
                </span>
                <div className="mt-1">
                  <RiskBadge status={cb.evaluation.status} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
