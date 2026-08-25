import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';
import { alertService } from '../../services/alertService';
import { storage } from '../../services/storage';
import RiskBadge from '../../components/common/RiskBadge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  UserCheck,
  Bell,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sliders
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setStudents(studentService.getAllWithRiskMetrics('all'));
    setCourses(courseService.getAll());
    setUsers(userService.getAll());
    setAlerts(alertService.getAllAlerts());
  };

  // Required Admin Dashboard Metrics
  const totalUsers = users.length;
  const totalStudents = students.length;
  const totalLecturers = users.filter(u => u.role === 'lecturer').length;
  const totalCoordinators = users.filter(u => u.role === 'coordinator').length;
  const totalCourses = courses.length;
  const totalAlerts = alerts.length;
  const atRiskStudentsCount = students.filter(s => s.riskStatus !== 'Safe').length;

  const count100L = students.filter(s => s.level === 100).length;
  const count200L = students.filter(s => s.level === 200).length;

  const criticalStudents = students.filter(s => s.riskStatus === 'Critical At-Risk');
  const moderateAtRiskStudents = students.filter(s => s.riskStatus === 'At-Risk');
  const safeStudents = students.filter(s => s.riskStatus === 'Safe');

  // Chart Data
  const pieData = [
    { name: 'Safe (Compliant)', value: safeStudents.length, color: '#059669' },
    { name: 'At-Risk (1 Factor)', value: moderateAtRiskStudents.length, color: '#D97706' },
    { name: 'Critical (Both Limits)', value: criticalStudents.length, color: '#E11D48' },
  ].filter(d => d.value > 0);

  const levelComparisonData = [
    {
      level: '100 Level',
      Safe: students.filter(s => s.level === 100 && s.riskStatus === 'Safe').length,
      'At-Risk': students.filter(s => s.level === 100 && s.riskStatus === 'At-Risk').length,
      'Critical': students.filter(s => s.level === 100 && s.riskStatus === 'Critical At-Risk').length,
    },
    {
      level: '200 Level',
      Safe: students.filter(s => s.level === 200 && s.riskStatus === 'Safe').length,
      'At-Risk': students.filter(s => s.level === 200 && s.riskStatus === 'At-Risk').length,
      'Critical': students.filter(s => s.level === 200 && s.riskStatus === 'Critical At-Risk').length,
    },
  ];

  const handleExecuteReset = () => {
    setIsResetting(true);
    storage.resetAll();
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false);
      setToastMessage('Demo dataset restored to initial seed state.');
      window.location.reload();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-fud-900 via-fud-800 to-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Department Administration • HOD Office
            </span>
            <span className="text-xs text-slate-300">2025/2026 Academic Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">
            Administrative Overview & System Oversight
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Department of Computer Science, Federal University Dutse. Central management of academic staff, student rosters, courses, and risk rules.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin/settings"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold shadow-sm transition border border-slate-700"
          >
            <Sliders size={14} />
            <span>Alert Rules</span>
          </Link>
          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl text-xs flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 7 Required Admin Dashboard KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          accent="primary"
          subtitle="Staff & accounts"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          accent="primary"
          subtitle="100L & 200L"
        />
        <StatCard
          title="Lecturers"
          value={totalLecturers}
          icon={UserCheck}
          accent="info"
          subtitle="Academic staff"
        />
        <StatCard
          title="Coordinators"
          value={totalCoordinators}
          icon={Users}
          accent="info"
          subtitle="Level triage staff"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={BookOpen}
          accent="primary"
          subtitle="Curriculum units"
        />
        <StatCard
          title="Total Alerts"
          value={totalAlerts}
          icon={Bell}
          accent="warning"
          subtitle="Dispatched notices"
        />
        <StatCard
          title="At-Risk Students"
          value={atRiskStudentsCount}
          icon={ShieldAlert}
          accent={atRiskStudentsCount > 0 ? "danger" : "success"}
          subtitle={`${criticalStudents.length} Critical / ${moderateAtRiskStudents.length} Warning`}
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-sm text-slate-900">Academic Standing Distribution</h2>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                All Cohorts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Classification across all {totalStudents} registered students</p>
          </div>

          <div className="h-52 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-center text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-900">{item.value}</div>
                <div className="text-[10px] text-slate-500 truncate">{item.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 100L vs 200L Comparative Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">Academic Risk Standing by Level</h2>
              <p className="text-xs text-slate-500">Comparison of 100 Level vs 200 Level student risk distribution</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></span> Safe
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span> At-Risk
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span> Critical
              </span>
            </div>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="Safe" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="At-Risk" fill="#D97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Critical" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Students Priority Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Students Priority Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-slate-900">Priority Triage: Critical At-Risk Students</h2>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {criticalStudents.length} Students
                </span>
              </div>
              <p className="text-xs text-slate-500">Students violating both Attendance (&lt;60%) and CA (&lt;40%) limits</p>
            </div>
            <Link
              to="/coordinator/at-risk"
              className="text-xs text-fud-600 hover:text-fud-700 font-semibold inline-flex items-center gap-1"
            >
              <span>View all at-risk</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Matric No.</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Avg CA</th>
                  <th className="py-2.5 px-3">Standing</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {criticalStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      No students currently in critical risk status.
                    </td>
                  </tr>
                ) : (
                  criticalStudents.slice(0, 5).map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">{stu.name}</td>
                      <td className="py-3 px-3 font-mono text-fud-700 font-medium">{stu.matricNo || stu.matricNumber}</td>
                      <td className="py-3 px-3 text-slate-600">{stu.level}L</td>
                      <td className="py-3 px-3 font-bold text-rose-600">
                        {stu.attendancePercentage}%
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-600">
                        {stu.caPercentage}%
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge status={stu.riskStatus} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/coordinator/reports?student=${stu.id}`}
                          className="px-2.5 py-1 bg-fud-900 hover:bg-fud-800 text-white rounded-lg text-[11px] font-semibold transition"
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

        {/* Recent Early-Warning Alerts Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900">System Activity Feed</h2>
              <p className="text-xs text-slate-500">Automated warning triggers</p>
            </div>
            <Link
              to="/coordinator/alerts"
              className="text-xs text-fud-600 hover:text-fud-700 font-semibold"
            >
              All Alerts ({totalAlerts})
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.slice(0, 4).map((al) => {
              const isCritical = al.severity === 'critical' || al.type?.includes('Critical');
              return (
                <div key={al.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                      {al.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(al.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                    {al.message}
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{al.studentName}</span>
                    <span className="font-mono text-fud-700 font-bold">{al.courseCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset Demo Data */}
      {showResetModal && (
        <Modal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          title="Reset Demo Dataset Confirmation"
          subtitle="Department of Computer Science • Federal University Dutse"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-rose-900">
                <AlertTriangle size={15} className="text-rose-600" />
                <span>Restoring Initial Seed Data</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This administrator action will reset all student attendance records, test marks, simulated SMS logs, and warning alerts back to the original demonstration state.
              </p>
            </div>

            <p className="text-slate-600 text-[11px]">
              Are you sure you want to proceed with resetting the LocalStorage state?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                disabled={isResetting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} className={isResetting ? 'animate-spin' : ''} />
                <span>{isResetting ? 'Resetting Data...' : 'Confirm & Reset Data'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
