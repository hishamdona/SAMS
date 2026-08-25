import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { courseService } from '../../services/courseService';
import { scoreService } from '../../services/scoreService';
import RiskBadge from '../../components/common/RiskBadge';
import { useToast } from '../../context/ToastContext';
import { 
  FileSpreadsheet, 
  Save, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Layers,
  Sparkles,
  BellRing
} from 'lucide-react';

export default function CaScoresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState(searchParams.get('course') || '');
  const [scoreRows, setScoreRows] = useState([]); // [ { student, test1, test2, assignment, totalCa, percentage } ]
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'alert', message: '' }
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseCode) {
      loadScoresForCourse(selectedCourseCode);
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

  const loadScoresForCourse = (courseCode) => {
    const allStudents = studentService.getAll();
    const enrolled = allStudents.filter(s => s.enrolledCourses && s.enrolledCourses.includes(courseCode));
    const currentScores = scoreService.getScoresByCourse(courseCode);

    const rows = enrolled.map(student => {
      const existing = currentScores.find(s => s.studentId === student.id);
      const t1 = existing?.quiz ?? existing?.test1 ?? 0;
      const t2 = existing?.test ?? existing?.test2 ?? 0;
      const ass = existing?.assignment ?? 0;
      const totalCa = Number((t1 + t2 + ass).toFixed(1));
      const percentage = Number(((totalCa / 40) * 100).toFixed(1));

      return {
        student,
        quiz: t1,
        test: t2,
        assignment: ass,
        totalCa,
        percentage
      };
    });

    setScoreRows(rows);
  };

  const handleScoreChange = (studentId, field, rawValue) => {
    const val = Number(rawValue);
    const maxVal = field === 'assignment' ? 10 : 15;
    const clampedVal = isNaN(val) ? 0 : Math.min(maxVal, Math.max(0, val));

    setScoreRows(prev => prev.map(row => {
      if (row.student.id === studentId) {
        const updated = { ...row, [field]: clampedVal };
        const total = Number((updated.quiz + updated.test + updated.assignment).toFixed(1));
        const pct = Number(((total / 40) * 100).toFixed(1));
        return {
          ...updated,
          totalCa: total,
          percentage: pct
        };
      }
      return row;
    }));
  };

  const toast = useToast();

  const handleSaveAll = (e) => {
    e.preventDefault();
    if (!selectedCourseCode) return;

    const payload = scoreRows.map(row => ({
      studentId: row.student.id,
      courseCode: selectedCourseCode,
      quiz: row.quiz,
      test: row.test,
      assignment: row.assignment
    }));

    scoreService.bulkSaveScores(payload);

    const lowCount = scoreRows.filter(r => r.percentage < 40).length;
    
    if (lowCount > 0) {
      toast.warning(`CA scores for ${selectedCourseCode} saved. Risk alert generated for ${lowCount} student(s) scoring <40%.`);
    } else {
      toast.success(`CA scores for ${selectedCourseCode} saved successfully.`);
    }

    setFeedback({
      type: lowCount > 0 ? 'alert' : 'success',
      message: lowCount > 0
        ? `CA scores saved successfully. Risk alert generated for ${lowCount} student(s) scoring below the 40% pass threshold.`
        : `CA scores saved successfully. All continuous assessment marks updated.`
    });

    setTimeout(() => setFeedback(null), 5000);
  };

  const filteredRows = scoreRows.filter(row =>
    row.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.student.matricNo || row.student.matricNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowCaCount = scoreRows.filter(r => r.percentage < 40).length;
  const avgClassCa = scoreRows.length > 0
    ? (scoreRows.reduce((sum, r) => sum + r.percentage, 0) / scoreRows.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Continuous Assessment (CA) Scores Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assignment (Max 10), Quiz (Max 15), Test (Max 15) = Total 40 Marks (100% CA). Score &lt;40% invokes the risk engine.
          </p>
        </div>

        {/* Course Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700">Course:</label>
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

      {/* Confirmation Feedback Banner */}
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
            Database Synchronized
          </span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Class CA Average</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{avgClassCa}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {scoreRows.length} enrolled students</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-subtle bg-rose-50/20">
          <div className="text-[11px] text-rose-700 font-semibold uppercase">Below 40% Pass Mark</div>
          <div className="text-xl font-bold text-rose-700 mt-1">{lowCaCount} Students</div>
          <div className="text-[11px] text-rose-600 mt-0.5">Automated early-warning alert active</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-subtle bg-emerald-50/20">
          <div className="text-[11px] text-emerald-700 font-semibold uppercase">Meeting CA Standard</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{scoreRows.length - lowCaCount} Students</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Scoring ≥40% (≥16/40 marks)</div>
        </div>
      </div>

      {/* Scores Spreadsheet Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div>
            <h2 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {selectedCourseCode} Continuous Assessment Sheet
            </h2>
            <p className="text-[11px] text-slate-500">Live automatic calculation of total and normalized percentages</p>
          </div>

          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Find student by name/matric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 bg-white"
            />
          </div>
        </div>

        <form onSubmit={handleSaveAll}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name & Matric</th>
                  <th className="py-3 px-4 text-center">Quiz (Max 15)</th>
                  <th className="py-3 px-4 text-center">Test (Max 15)</th>
                  <th className="py-3 px-4 text-center">Assignment (Max 10)</th>
                  <th className="py-3 px-4 text-center">Total CA (/40)</th>
                  <th className="py-3 px-4 text-center">CA Percentage (%)</th>
                  <th className="py-3 px-4 text-right">CA Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row, idx) => {
                  const isLow = row.percentage < 40;
                  return (
                    <tr key={row.student.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="font-bold">{row.student.name}</div>
                        <div className="text-[10px] text-fud-700 font-mono font-medium">
                          {row.student.matricNo || row.student.matricNumber}
                        </div>
                      </td>

                      {/* Quiz */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          step="0.5"
                          value={row.quiz}
                          onChange={(e) => handleScoreChange(row.student.id, 'quiz', e.target.value)}
                          className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono font-semibold focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                        />
                      </td>

                      {/* Test */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          step="0.5"
                          value={row.test}
                          onChange={(e) => handleScoreChange(row.student.id, 'test', e.target.value)}
                          className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono font-semibold focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                        />
                      </td>

                      {/* Assignment */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={row.assignment}
                          onChange={(e) => handleScoreChange(row.student.id, 'assignment', e.target.value)}
                          className="w-16 px-2 py-1 border border-slate-300 rounded-lg text-center font-mono font-semibold focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                        />
                      </td>

                      {/* Total Out of 40 */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 text-sm">
                        {row.totalCa} / 40
                      </td>

                      {/* Percentage */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block font-mono font-bold text-sm ${
                          isLow ? 'text-rose-600' : 'text-emerald-700'
                        }`}>
                          {row.percentage}%
                        </span>
                      </td>

                      {/* Standing Status Badge */}
                      <td className="py-3 px-4 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Below 40% (At-Risk)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Satisfactory
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Save Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Saving triggers risk recalculation and generates early-warning SMS alert records for students &lt;40%.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Save size={15} />
              <span>Save CA Scores & Run Risk Engine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
