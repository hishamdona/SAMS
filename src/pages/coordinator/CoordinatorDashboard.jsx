import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { alertService } from '../../services/alertService';
import { attendanceService } from '../../services/attendanceService';
import { scoreService } from '../../services/scoreService';
import { courseService } from '../../services/courseService';
import RiskBadge from '../../components/common/RiskBadge';
import StatCard from '../../components/ui/StatCard';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  FileText, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp,
  Clock, 
  Sparkles,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  AlertOctagon,
  BookOpen,
  Mail,
  UserCheck,
  Award,
  Send,
  Eye,
  BarChart3,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';

export default function CoordinatorDashboard() {
  const { openSmsModal } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Filters
  const [activeLevel, setActiveLevel] = useState('all'); // 'all' | '100' | '200'
  const [riskFilter, setRiskFilter] = useState('all'); // 'all' | 'Critical At-Risk' | 'At-Risk' | 'Safe'
  const [courseFilter, setCourseFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Profile Modal State
  const [selectedStudentDossier, setSelectedStudentDossier] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [smsFeedback, setSmsFeedback] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setStudents(studentService.getAllWithRiskMetrics('all'));
    setAlerts(alertService.getAllAlerts());
    setCourses(courseService.getAll());
  };

  // Filter students based on Level
  const levelFilteredStudents = activeLevel === 'all' 
    ? students 
    : students.filter(s => s.level === Number(activeLevel));

  // Dynamic Dashboard Statistics (Calculated directly from mock data)
  const totalStudentsCount = levelFilteredStudents.length;
  const safeStudents = levelFilteredStudents.filter(s => s.riskStatus === 'Safe');
  const atRiskStudents = levelFilteredStudents.filter(s => s.riskStatus === 'At-Risk');
  const criticalStudents = levelFilteredStudents.filter(s => s.riskStatus === 'Critical At-Risk');

  const avgAttendance = totalStudentsCount > 0
    ? Number((levelFilteredStudents.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) / totalStudentsCount).toFixed(1))
    : 0;

  const avgCa = totalStudentsCount > 0
    ? Number((levelFilteredStudents.reduce((sum, s) => sum + (s.caPercentage || 0), 0) / totalStudentsCount).toFixed(1))
    : 0;

  // Filter for the At-Risk Table
  const tableStudents = levelFilteredStudents.filter(s => {
    const term = searchTerm.toLowerCase();
    const nameMatch = s.name?.toLowerCase().includes(term);
    const matricMatch = (s.matricNo || s.matricNumber || '').toLowerCase().includes(term);
    const matchesSearch = nameMatch || matricMatch;

    const matchesRisk = riskFilter === 'all' || s.riskStatus === riskFilter;
    const matchesCourse = courseFilter === 'all' || (s.enrolledCourses && s.enrolledCourses.includes(courseFilter));

    return matchesSearch && matchesRisk && matchesCourse;
  });

  // Recharts: 1. Risk Distribution Data
  const riskPieData = [
    { name: 'Safe (Compliant)', value: safeStudents.length, color: '#059669' },
    { name: 'At-Risk (1 Warning)', value: atRiskStudents.length, color: '#D97706' },
    { name: 'Critical (Both Limits)', value: criticalStudents.length, color: '#E11D48' },
  ].filter(d => d.value > 0);

  // Recharts: 2. Attendance Trend Data (Weekly Lecture Progression)
  const attendanceTrendData = [
    { week: 'Week 1', rate: 94.5, target: 60 },
    { week: 'Week 2', rate: 91.2, target: 60 },
    { week: 'Week 3', rate: 86.0, target: 60 },
    { week: 'Week 4', rate: 79.4, target: 60 },
    { week: 'Week 5', rate: 74.8, target: 60 },
    { week: 'Week 6', rate: 68.5, target: 60 },
    { week: 'Week 7', rate: 62.1, target: 60 },
    { week: 'Week 8', rate: avgAttendance, target: 60 },
  ];

  // Recharts: 3. CA Performance Distribution
  const caDistributionData = [
    { tier: '<40% (At-Risk)', count: levelFilteredStudents.filter(s => s.caPercentage < 40).length, fill: '#E11D48' },
    { tier: '40-49% (Pass)', count: levelFilteredStudents.filter(s => s.caPercentage >= 40 && s.caPercentage < 50).length, fill: '#D97706' },
    { tier: '50-69% (Good)', count: levelFilteredStudents.filter(s => s.caPercentage >= 50 && s.caPercentage < 70).length, fill: '#2563EB' },
    { tier: '≥70% (High)', count: levelFilteredStudents.filter(s => s.caPercentage >= 70).length, fill: '#059669' },
  ];

  const handleOpenProfile = (studentId) => {
    const dossier = studentService.getStudentAcademicDossier(studentId);
    setSelectedStudentDossier(dossier);
    setShowProfileModal(true);
  };

  const handleTriggerSmsSimulation = (student) => {
    const matric = student.matricNo || student.matricNumber;
    alertService.generateSimulatedSms({
      studentId: student.id,
      recipientName: student.name,
      recipientPhone: student.phone,
      message: `FUD SAMS URGENT NOTICE: ${student.name} (${matric}), you are currently flagged in ${student.riskStatus} standing (Att: ${student.attendancePercentage}%, CA: ${student.caPercentage}%). Report to Level Coordinator Office immediately.`
    });

    setSmsFeedback(`SMS notification generated and dispatched to ${student.phone} for ${student.name}.`);
    setTimeout(() => setSmsFeedback(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Coordinator Header Banner */}
      <div className="bg-gradient-to-r from-fud-900 via-fud-800 to-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-sky-400/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Level Coordinator Triage Center
            </span>
            <span className="text-xs text-slate-300">100L & 200L Computer Science • FUD</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">
            Consolidated Academic Risk Dashboard
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time departmental surveillance for undergraduate students. Track lecture attendance and continuous assessment against statutory limits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/coordinator/at-risk"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <ShieldAlert size={14} />
            <span>Triage Station ({criticalStudents.length + atRiskStudents.length})</span>
          </Link>
          <Link
            to="/coordinator/reports"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <FileText size={14} />
            <span>Official Dossiers</span>
          </Link>
        </div>
      </div>

      {/* SMS Success Toast */}
      {smsFeedback && (
        <div className="p-4 rounded-xl text-xs flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 text-emerald-900 animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{smsFeedback}</span>
          </div>
          <button
            onClick={openSmsModal}
            className="text-[11px] underline font-bold hover:text-emerald-700 cursor-pointer"
          >
            View SMS Gateway Log
          </button>
        </div>
      )}

      {/* Level Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Cohorts (100L & 200L)' },
            { id: '100', label: '100 Level Cohort' },
            { id: '200', label: '200 Level Cohort' }
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 cursor-pointer ${
                activeLevel === lvl.id
                  ? 'border-fud-900 bg-white text-fud-900 shadow-2xs font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Aggregating <strong>{totalStudentsCount}</strong> active students
        </span>
      </div>

      {/* 6 Calculated Dashboard Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Students"
          value={totalStudentsCount}
          icon={Users}
          accent="primary"
          subtitle="Monitored roster"
        />
        <StatCard
          title="Safe Students"
          value={safeStudents.length}
          icon={ShieldCheck}
          accent="success"
          subtitle="Att ≥60% & CA ≥40%"
        />
        <StatCard
          title="At-Risk"
          value={atRiskStudents.length}
          icon={AlertTriangle}
          accent="warning"
          subtitle="Single limit breach"
        />
        <StatCard
          title="Critical Risk"
          value={criticalStudents.length}
          icon={ShieldAlert}
          accent="danger"
          subtitle="Both limits breached"
        />
        <StatCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={TrendingUp}
          accent={avgAttendance < 60 ? "danger" : "info"}
          subtitle="Min pass limit: 60%"
        />
        <StatCard
          title="Avg CA Mark"
          value={`${avgCa}%`}
          icon={Award}
          accent={avgCa < 40 ? "danger" : "info"}
          subtitle="Min pass limit: 40%"
        />
      </div>

      {/* Visualizations Section (3 Charts: Risk Ratio, Attendance Trend, CA Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Risk Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Academic Risk Distribution</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Cohort Ratio
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Classification across monitored cohort</p>
          </div>

          <div className="h-48 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
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
            {riskPieData.map(p => (
              <div key={p.name} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-extrabold text-slate-900">{p.value}</div>
                <div className="text-[10px] text-slate-500 truncate">{p.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Attendance Trend Line */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Lecture Attendance Trend</h3>
              <p className="text-xs text-slate-500">Weekly cohort average vs 60% threshold</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Weeks 1–8
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2540" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0A2540" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Attendance Rate']}
                />
                <Area type="monotone" dataKey="rate" stroke="#0A2540" strokeWidth={2.5} fillOpacity={1} fill="url(#attGrad)" />
                <Line type="monotone" dataKey="target" stroke="#E11D48" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-fud-900"></span>Cohort Progression</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-rose-600 border-dashed"></span>60% Statutory Limit</span>
          </div>
        </div>

        {/* Chart 3: CA Performance Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">CA Performance Distribution</h3>
              <p className="text-xs text-slate-500">Student count across mark brackets</p>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              Continuous Assessment
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="tier" tick={{ fontSize: 9.5, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {caDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="text-rose-600 font-semibold">{caDistributionData[0].count} students under 40%</span>
            <span className="text-emerald-700 font-semibold">{caDistributionData[3].count} distinction marks</span>
          </div>
        </div>
      </div>

      {/* Main Student Monitoring Roster & Search Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden space-y-4 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Comprehensive Student Risk Surveillance</h2>
            <p className="text-xs text-slate-500">Live monitoring of attendance compliance, continuous assessment, and early risk intervention.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Bar */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search student name or matric..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 bg-white"
              />
            </div>

            {/* Risk Status Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-fud-500 font-semibold"
            >
              <option value="all">All Risk Standings</option>
              <option value="Critical At-Risk">Critical At-Risk Only</option>
              <option value="At-Risk">At-Risk Only</option>
              <option value="Safe">Safe Only</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-fud-500"
            >
              <option value="all">All Enrolled Courses</option>
              {courses.map(c => (
                <option key={c.code} value={c.code}>{c.code} ({c.level}L)</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student & Matric No.</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">CA %</th>
                <th className="py-3 px-4">Risk Status</th>
                <th className="py-3 px-4">Diagnostic Reasons</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No students match the current filter selection.
                  </td>
                </tr>
              ) : (
                tableStudents.map((stu) => {
                  const isCritical = stu.riskStatus === 'Critical At-Risk';
                  const isAtRisk = stu.riskStatus === 'At-Risk';
                  const matric = stu.matricNo || stu.matricNumber;

                  // Reason text
                  let riskReason = "Performance within compliant academic limits.";
                  if (isCritical) {
                    riskReason = `Attendance (${stu.attendancePercentage}%) < 60% AND CA (${stu.caPercentage}%) < 40%`;
                  } else if (isAtRisk) {
                    if (stu.attendancePercentage < 60) {
                      riskReason = `Attendance (${stu.attendancePercentage}%) is below 60% threshold.`;
                    } else {
                      riskReason = `CA Score (${stu.caPercentage}%) is below 40% pass mark.`;
                    }
                  }

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-bold text-slate-900">{stu.name}</div>
                        <div className="text-[10px] text-fud-700 font-mono font-semibold">{matric}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">{stu.level}L</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${
                          stu.attendancePercentage < 60 ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {stu.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${
                          stu.caPercentage < 40 ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {stu.caPercentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <RiskBadge status={stu.riskStatus} size="sm" />
                      </td>
                      <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600 leading-snug">
                        <span className={isCritical ? 'text-rose-700 font-medium' : isAtRisk ? 'text-amber-800 font-medium' : 'text-slate-500'}>
                          {riskReason}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenProfile(stu.id)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                            title="View Full Profile"
                          >
                            <Eye size={12} />
                            <span>Profile</span>
                          </button>

                          <Link
                            to={`/coordinator/reports?student=${stu.id}`}
                            className="px-2.5 py-1 bg-fud-900 hover:bg-fud-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                            title="View Official Report"
                          >
                            <FileText size={12} />
                            <span>Report</span>
                          </Link>

                          {(isCritical || isAtRisk) && (
                            <button
                              onClick={() => handleTriggerSmsSimulation(stu)}
                              className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg text-xs transition cursor-pointer"
                              title="Simulate SMS Notice"
                            >
                              <Send size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Detailed Student Profile Modal */}
      {showProfileModal && selectedStudentDossier && (
        <Modal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          title={`Academic Profile: ${selectedStudentDossier.student.name}`}
          subtitle={`${selectedStudentDossier.student.matricNo || selectedStudentDossier.student.matricNumber} • ${selectedStudentDossier.student.level} Level Computer Science`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs">
            {/* Student Biodata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium">Academic Level</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudentDossier.student.level} Level</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Contact Phone</span>
                <div className="font-mono font-semibold text-slate-900 mt-0.5">{selectedStudentDossier.student.phone}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Institutional Email</span>
                <div className="font-mono text-[11px] text-slate-800 truncate mt-0.5">{selectedStudentDossier.student.email}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Academic Advisor</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedStudentDossier.student.advisor || 'Mal. Ibrahim Sani'}</div>
              </div>
            </div>

            {/* Overall Academic Standing Banner */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <RiskBadge status={selectedStudentDossier.riskProfile.status} size="lg" />
                <div>
                  <div className="font-bold text-slate-900 text-sm">Overall Academic Standing</div>
                  <div className="text-[11px] text-slate-500">
                    Cumulative Attendance: <strong>{selectedStudentDossier.riskProfile.overallAttendancePercentage}%</strong> • Cumulative CA: <strong>{selectedStudentDossier.riskProfile.overallCaPercentage}%</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTriggerSmsSimulation(selectedStudentDossier.student)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <Send size={12} />
                <span>Dispatch Simulated SMS</span>
              </button>
            </div>

            {/* Course Performance Breakdown Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Course Performance Breakdown
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Course Code</th>
                      <th className="py-2.5 px-3">Course Title</th>
                      <th className="py-2.5 px-3">Attendance %</th>
                      <th className="py-2.5 px-3">CA %</th>
                      <th className="py-2.5 px-3 text-right">Risk Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedStudentDossier.courseBreakdown.map((cb) => (
                      <tr key={cb.courseCode} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-fud-900">{cb.courseCode}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{cb.courseTitle}</td>
                        <td className="py-2.5 px-3">
                          <span className={`font-mono font-bold ${
                            cb.attendance.percentage < 60 ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {cb.attendance.percentage}% ({cb.attendance.attendedSessions}/{cb.attendance.totalSessions})
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`font-mono font-bold ${
                            cb.ca.percentage < 40 ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {cb.ca.percentage}%
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

            {/* Diagnostic Reasons & Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50/40 p-3.5 rounded-xl border border-amber-200">
                <h5 className="font-bold text-xs text-amber-900 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600" />
                  <span>Diagnostic Risk Factors</span>
                </h5>
                <ul className="space-y-1 text-[11px] text-amber-800 list-disc list-inside">
                  {selectedStudentDossier.riskProfile.overallRisk.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-200">
                <h5 className="font-bold text-xs text-sky-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-sky-600" />
                  <span>Coordinator Recommendations</span>
                </h5>
                <ul className="space-y-1 text-[11px] text-sky-800 list-disc list-inside">
                  {selectedStudentDossier.riskProfile.overallRisk.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alert & SMS History */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Logged Alerts & Simulated Messages ({selectedStudentDossier.alerts.length + selectedStudentDossier.smsLogs.length})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedStudentDossier.alerts.length === 0 && selectedStudentDossier.smsLogs.length === 0 ? (
                  <p className="text-slate-400 py-3 text-center">No previous warning alerts or SMS messages recorded.</p>
                ) : (
                  <>
                    {selectedStudentDossier.alerts.map(al => (
                      <div key={al.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span>{al.type} ({al.courseCode})</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{al.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(al.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Department of Computer Science • Federal University Dutse</span>
              <Link
                to={`/coordinator/reports?student=${selectedStudentDossier.student.id}`}
                className="px-4 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold transition"
              >
                Open Full Letterhead Dossier
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
