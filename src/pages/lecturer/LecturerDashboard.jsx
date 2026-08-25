import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { courseService } from '../../services/courseService';
import { attendanceService } from '../../services/attendanceService';
import { scoreService } from '../../services/scoreService';
import { alertService } from '../../services/alertService';
import RiskBadge from '../../components/common/RiskBadge';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  BookOpen, 
  Users, 
  CalendarCheck, 
  FileSpreadsheet, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  BarChart3,
  Bell,
  AlertOctagon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function LecturerDashboard() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [totalSessionsSubmitted, setTotalSessionsSubmitted] = useState(0);

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
    const allCourses = courseService.getAll();
    const myCourses = user?.role === 'lecturer'
      ? allCourses.filter(c => c.lecturerId === user.id || (user.assignedCourses && user.assignedCourses.includes(c.code)))
      : allCourses.slice(0, 4);

    setCourses(myCourses);

    const analyticsList = myCourses.map(c => courseService.getCourseAnalytics(c.code)).filter(Boolean);
    setAnalytics(analyticsList);

    // Total attendance sessions submitted across lecturer's courses
    const allSessions = attendanceService.getAllSessions();
    const myCourseCodes = myCourses.map(c => c.code);
    const mySessions = allSessions.filter(s => myCourseCodes.includes(s.courseCode));
    setTotalSessionsSubmitted(mySessions.length);

    // Recent alerts relevant to lecturer's courses
    const allAlerts = alertService.getAllAlerts();
    const relevantAlerts = allAlerts.filter(a => myCourseCodes.includes(a.courseCode)).slice(0, 5);
    setRecentAlerts(relevantAlerts);
  };

  const totalEnrolled = analytics.reduce((sum, a) => sum + (a.enrolledCount || 0), 0);
  const totalAtRisk = analytics.reduce((sum, a) => sum + (a.atRiskCount || 0) + (a.criticalCount || 0), 0);
  const totalCritical = analytics.reduce((sum, a) => sum + (a.criticalCount || 0), 0);
  const totalSafe = analytics.reduce((sum, a) => sum + (a.safeCount || 0), 0);

  // Chart Data
  const courseComparisonData = analytics.map(a => ({
    name: a.course.code,
    Attendance: a.avgAttendance,
    CA: a.avgCa
  }));

  const riskPieData = [
    { name: 'Safe (≥60% & ≥40%)', value: totalSafe, color: '#059669' },
    { name: 'At-Risk (Att or CA)', value: totalAtRisk - totalCritical, color: '#D97706' },
    { name: 'Critical (Att & CA)', value: totalCritical, color: '#E11D48' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-fud-900 via-fud-800 to-slate-900 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Course Lecturer Portal
            </span>
            <span className="text-xs text-slate-300">Welcome, {currentUser?.name || 'Dr. M. A. Dutse'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold">
            Lecturer Academic Monitoring Hub
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Track student lecture attendance, record continuous assessment (CA) marks, and identify at-risk students before final examinations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/lecturer/attendance"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <CalendarCheck size={14} />
            <span>Mark Attendance</span>
          </Link>
          <Link
            to="/lecturer/ca-scores"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <FileSpreadsheet size={14} />
            <span>Enter CA Scores</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value={courses.length}
          icon={BookOpen}
          accent="primary"
          subtitle={courses.map(c => c.code).join(', ')}
        />
        <StatCard
          title="Total Students"
          value={`${totalEnrolled}`}
          icon={Users}
          accent="info"
          subtitle="Enrolled across your classes"
        />
        <StatCard
          title="Attendance Sessions"
          value={totalSessionsSubmitted}
          icon={CalendarCheck}
          accent="success"
          subtitle="Lecture registers submitted"
        />
        <StatCard
          title="Students At-Risk"
          value={totalAtRisk}
          icon={ShieldAlert}
          accent={totalAtRisk > 0 ? "danger" : "success"}
          subtitle={`${totalCritical} in Critical At-Risk status`}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Attendance vs Continuous Assessment Averages</h3>
              <p className="text-xs text-slate-500">Benchmark against 60% Attendance and 40% CA thresholds</p>
            </div>
            <span className="text-[10px] font-bold text-fud-800 bg-fud-50 border border-fud-200 px-2 py-0.5 rounded">
              Active Semester
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Attendance" fill="#0A2540" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CA" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Breakdown Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Class Academic Risk Ratio</h3>
            <p className="text-xs text-slate-500">Distribution across your students</p>
          </div>

          <div className="h-48 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-emerald-700 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Safe</span>
              <span>{totalSafe} students</span>
            </div>
            <div className="flex items-center justify-between text-amber-700 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>At-Risk</span>
              <span>{totalAtRisk - totalCritical} students</span>
            </div>
            <div className="flex items-center justify-between text-rose-700 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Critical</span>
              <span>{totalCritical} students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards & Recent Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Courses Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Your Assigned Courses</h2>
            <Link to="/lecturer/courses" className="text-xs text-fud-600 hover:text-fud-700 font-semibold inline-flex items-center gap-1">
              <span>View all courses</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analytics.map((item) => {
              const c = item.course;
              return (
                <div
                  key={c.code}
                  className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 hover:shadow-card transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-fud-900 bg-fud-50 border border-fud-200 px-2.5 py-0.5 rounded-lg">
                          {c.code}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-2">{c.title}</h3>
                      </div>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {c.level}L • {c.units || c.creditUnits} Units
                      </span>
                    </div>

                    {/* Progress bars */}
                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Avg Attendance</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{item.avgAttendance}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                          <div
                            className={`h-full rounded-full ${item.avgAttendance < 60 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, item.avgAttendance)}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Avg CA Score</div>
                        <div className="text-base font-bold text-slate-900 mt-0.5">{item.avgCa}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                          <div
                            className={`h-full rounded-full ${item.avgCa < 40 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, item.avgCa)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link
                      to={`/lecturer/attendance?course=${c.code}`}
                      className="flex-1 text-center py-2 px-3 bg-fud-50 hover:bg-fud-100 text-fud-900 rounded-xl text-xs font-semibold transition"
                    >
                      Attendance ({item.sessions.length})
                    </Link>
                    <Link
                      to={`/lecturer/ca-scores?course=${c.code}`}
                      className="flex-1 text-center py-2 px-3 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold transition"
                    >
                      CA Marks
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Bell size={16} className="text-rose-500" />
              <span>Recent Risk Alerts</span>
            </h3>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {recentAlerts.length} Alerts
            </span>
          </div>

          <div className="space-y-2.5">
            {recentAlerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active alerts in your courses.</p>
            ) : (
              recentAlerts.map(al => {
                const isCritical = al.severity === 'critical' || al.type.includes('Critical');
                return (
                  <div
                    key={al.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isCritical ? 'bg-rose-50/40 border-rose-200 text-rose-900' : 'bg-amber-50/40 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] flex items-center gap-1">
                        {isCritical ? <AlertOctagon size={13} className="text-rose-600" /> : <AlertTriangle size={13} className="text-amber-600" />}
                        <span>{al.type}</span>
                      </span>
                      <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border">
                        {al.courseCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-snug">
                      {al.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
