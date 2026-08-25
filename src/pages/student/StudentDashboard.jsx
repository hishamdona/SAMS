import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { studentService } from '../../services/studentService';
import RiskBadge from '../../components/common/RiskBadge';
import StatCard from '../../components/ui/StatCard';
import { 
  GraduationCap, 
  CalendarCheck, 
  FileSpreadsheet, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen,
  User,
  Sparkles,
  Smartphone,
  PhoneCall,
  BarChart3,
  TrendingUp,
  Award,
  AlertOctagon,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [dossier, setDossier] = useState(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => {
      setCurrentUser(authService.getCurrentUser());
      loadData();
    };
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

  const { student, riskProfile, courseBreakdown, alerts } = dossier;
  const isAtRisk = riskProfile.status !== 'Safe';
  const matric = student.matricNo || student.matricNumber;

  // Recharts: Course Performance Comparison Chart Data (Attendance % vs CA %)
  const performanceChartData = courseBreakdown.map((cb) => ({
    course: cb.courseCode,
    attendance: cb.attendance.percentage,
    ca: cb.ca.percentage,
    title: cb.courseTitle,
  }));

  const unreadAlertsCount = alerts.filter(a => a.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-fud-900 via-fud-800 to-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Student Academic Portal
            </span>
            <span className="text-xs text-slate-300">2025/2026 Academic Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">
            Welcome, {student.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Matric: <strong className="text-amber-400 font-mono">{matric}</strong> • {student.level} Level • Dept. of Computer Science
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Current Standing</div>
            <div className="mt-0.5">
              <RiskBadge status={riskProfile.status} size="md" />
            </div>
          </div>
          <Link
            to="/student/performance"
            className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Course Performance
          </Link>
        </div>
      </div>

      {/* Urgent Warning Banner if At-Risk */}
      {isAtRisk && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 shadow-subtle flex items-start gap-4 animate-in fade-in">
          <div className="p-3 bg-rose-100 rounded-xl text-rose-700 shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-2 flex-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold text-sm text-rose-900">
                Academic Early-Warning Notice: {riskProfile.status}
              </h2>
              <span className="bg-rose-200/80 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Action Advised
              </span>
            </div>

            <p className="text-rose-800 leading-relaxed font-medium">
              Your academic records fall below university statutory benchmarks in one or more courses.
            </p>

            <ul className="list-disc list-inside text-rose-700 space-y-1 text-[11px]">
              {riskProfile.overallRisk.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <div className="pt-2 border-t border-rose-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-rose-800">
                Academic Advisor: <strong>{student.advisor || 'Mal. Ibrahim Sani'}</strong> (Level Coordinator)
              </span>
              <Link
                to="/student/alerts"
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
              >
                View Dispatched Notices ({alerts.length})
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <StatCard
          title="Overall Attendance"
          value={`${riskProfile.overallAttendancePercentage}%`}
          icon={CalendarCheck}
          accent={riskProfile.overallAttendancePercentage < 60 ? "danger" : "success"}
          subtitle={riskProfile.overallAttendancePercentage >= 60 ? "Min standard: ≥60%" : "Below 60% minimum threshold"}
        />

        {/* Continuous Assessment CA */}
        <StatCard
          title="Average CA Mark"
          value={`${riskProfile.overallCaPercentage}%`}
          icon={FileSpreadsheet}
          accent={riskProfile.overallCaPercentage < 40 ? "danger" : "info"}
          subtitle={riskProfile.overallCaPercentage >= 40 ? "Min pass mark: ≥40%" : "Below 40% pass mark"}
        />

        {/* Academic Standing */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Standing Status</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-2">
            <RiskBadge status={riskProfile.status} size="md" />
          </div>
          <div className="mt-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span>Level: <strong>{student.level}L</strong> • CS Dept</span>
          </div>
        </div>

        {/* Active Warning Alerts */}
        <StatCard
          title="Active Alerts"
          value={`${alerts.length} Warnings`}
          icon={Bell}
          accent={alerts.length > 0 ? "warning" : "success"}
          subtitle={unreadAlertsCount > 0 ? `${unreadAlertsCount} unread notices` : "Simulated SMS active"}
        />
      </div>

      {/* Performance Comparison Chart (Recharts) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-fud-900" />
              <h2 className="font-bold text-sm text-slate-900">Course-by-Course Performance Comparison</h2>
            </div>
            <p className="text-xs text-slate-500">Visual comparison of Lecture Attendance % vs Continuous Assessment (CA) %</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-[#0A2540] inline-block"></span>
              Attendance %
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-[#0284C7] inline-block"></span>
              CA Score %
            </span>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceChartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="course" tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                formatter={(value, name) => [`${value}%`, name === 'attendance' ? 'Attendance Rate' : 'CA Score']}
              />
              <ReferenceLine y={60} stroke="#E11D48" strokeDasharray="3 3" label={{ value: 'Att Min (60%)', fill: '#E11D48', fontSize: 9, position: 'insideTopRight' }} />
              <ReferenceLine y={40} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'CA Pass (40%)', fill: '#D97706', fontSize: 9, position: 'insideBottomRight' }} />
              <Bar dataKey="attendance" fill="#0A2540" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="ca" fill="#0284C7" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <span>Red line marks statutory 60% Attendance threshold</span>
          <span>Amber line marks statutory 40% CA Pass threshold</span>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-900">Enrolled Course Standing Summary</h2>
            <p className="text-xs text-slate-500">Breakdown of performance in all registered {student.level}L courses</p>
          </div>
          <Link
            to="/student/performance"
            className="text-xs text-fud-600 hover:text-fud-700 font-semibold inline-flex items-center gap-1"
          >
            <span>View detailed marks</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Course Title</th>
                <th className="py-2.5 px-3">Attendance %</th>
                <th className="py-2.5 px-3">CA %</th>
                <th className="py-2.5 px-3 text-right">Standing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseBreakdown.map((cb) => (
                <tr key={cb.courseCode} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-fud-900">{cb.courseCode}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{cb.courseTitle}</td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={cb.attendance.percentage < 60 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {cb.attendance.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      ({cb.attendance.attendedSessions}/{cb.attendance.totalSessions})
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={cb.ca.percentage < 40 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                      {cb.ca.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5">
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

      {/* Recent Alerts Feed */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Your Dispatched Early-Warning Notices</h3>
            </div>
            <Link
              to="/student/alerts"
              className="text-xs text-fud-600 hover:text-fud-700 font-semibold inline-flex items-center gap-1"
            >
              <span>View all notices ({alerts.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 3).map((al) => {
              const isCritical = al.severity === 'critical' || al.type.includes('Critical');
              return (
                <div
                  key={al.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
                    isCritical ? 'bg-rose-50/40 border-rose-200' : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    isCritical ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {isCritical ? <AlertOctagon size={16} /> : <AlertTriangle size={16} />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{al.type} ({al.courseCode})</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(al.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-snug">{al.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
