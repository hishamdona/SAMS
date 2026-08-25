import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { alertService } from '../../services/alertService';
import RiskBadge from '../../components/common/RiskBadge';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  FileText, 
  Smartphone, 
  UserCheck, 
  Calendar, 
  CheckCircle2, 
  X, 
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function AtRiskPage() {
  const { openSmsModal } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'critical' | 'attendance' | 'ca'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Intervention Modal
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState(null);
  const [interventionActionType, setInterventionActionType] = useState('Counseling Session');
  const [interventionNotes, setInterventionNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const loadData = () => {
    const all = studentService.getAllWithRiskMetrics('all');
    setStudents(all.filter(s => s.riskStatus !== 'Safe'));
  };

  const handleOpenInterventionModal = (student) => {
    setSelectedStudentForIntervention(student);
    setInterventionActionType('Counseling Session');
    setInterventionNotes(`Academic counseling regarding attendance (${student.attendancePercentage}%) and CA score (${student.caPercentage}%).`);
    setFollowUpDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  };

  const toast = useToast();

  const handleSaveIntervention = (e) => {
    e.preventDefault();
    if (!selectedStudentForIntervention) return;

    alertService.logIntervention({
      studentId: selectedStudentForIntervention.id,
      studentName: selectedStudentForIntervention.name,
      matricNumber: selectedStudentForIntervention.matricNumber,
      coordinatorName: 'Mal. Ibrahim Sani (Level Coordinator)',
      actionType: interventionActionType,
      notes: interventionNotes,
      followUpDate
    });

    toast.success(`Counseling intervention logged for ${selectedStudentForIntervention.name}.`);
    setActionNotice(`Intervention logged for ${selectedStudentForIntervention.name}. Follow-up set for ${followUpDate}.`);
    setTimeout(() => setActionNotice(''), 4000);
    setSelectedStudentForIntervention(null);
  };

  const handleQuickSimulateSms = (stu) => {
    const matric = stu.matricNo || stu.matricNumber;
    alertService.generateSimulatedSms({
      studentId: stu.id,
      recipientName: stu.name,
      recipientPhone: stu.phone,
      message: `FUD SAMS URGENT NOTICE: ${stu.name} (${matric}), your standing is ${stu.riskStatus.toUpperCase()} (Att: ${stu.attendancePercentage}%, CA: ${stu.caPercentage}%). Report to Level Coordinator office immediately.`
    });

    toast.info(`Simulated warning SMS dispatched to ${stu.name} (${stu.phone}).`);
    setActionNotice(`Simulated SMS alert dispatched to ${stu.name} (${stu.phone})!`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'critical') return s.riskStatus === 'Critical At-Risk';
    if (activeTab === 'attendance') return s.riskProfile.overallRisk.attendanceRisk;
    if (activeTab === 'ca') return s.riskProfile.overallRisk.caRisk;
    return true; // 'all'
  });

  const criticalCount = students.filter(s => s.riskStatus === 'Critical At-Risk').length;
  const attendanceWarningCount = students.filter(s => s.riskProfile.overallRisk.attendanceRisk).length;
  const caWarningCount = students.filter(s => s.riskProfile.overallRisk.caRisk).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold text-slate-900">At-Risk Student Triage Station</h1>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {students.length} Flagged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Intervention workflow for students with attendance below 60% or CA scores below 40%.
          </p>
        </div>

        <button
          onClick={openSmsModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded-xl text-xs font-semibold transition self-start sm:self-auto"
        >
          <Smartphone size={15} className="text-sky-600" />
          <span>View SMS Alert Logs</span>
        </button>
      </div>

      {actionNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Triage Tabs & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'all'
                  ? 'bg-fud-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All At-Risk ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'critical'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              Critical At-Risk ({criticalCount})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'attendance'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Attendance &lt; 60% ({attendanceWarningCount})
            </button>
            <button
              onClick={() => setActiveTab('ca')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'ca'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              CA Score &lt; 40% ({caWarningCount})
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or matric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fud-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Triage Cards Grid */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <ShieldAlert size={36} className="mx-auto text-emerald-500 mb-2" />
            <h3 className="font-semibold text-slate-900 text-sm">No At-Risk Students in this View</h3>
            <p className="text-xs text-slate-500 mt-0.5">All students in this filter meet academic compliance criteria.</p>
          </div>
        ) : (
          filteredStudents.map((stu) => (
            <div
              key={stu.id}
              className={`bg-white rounded-xl border shadow-subtle p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                stu.riskStatus === 'Critical At-Risk'
                  ? 'border-rose-200 bg-rose-50/15'
                  : 'border-amber-200 bg-amber-50/15'
              }`}
            >
              {/* Student Academic Snapshot */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900">{stu.name}</span>
                  <span className="font-mono text-xs text-fud-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
                    {stu.matricNumber}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {stu.level} Level
                  </span>
                  <RiskBadge status={stu.riskStatus} size="sm" />
                </div>

                {/* Risk Reasons from Risk Engine */}
                <div className="space-y-1 text-xs">
                  {stu.riskProfile.overallRisk.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-rose-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                {/* Metrics Breakdown */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <div>
                    Attendance: <strong className={stu.attendancePercentage < 60 ? 'text-rose-600' : 'text-slate-900'}>
                      {stu.attendancePercentage}%
                    </strong> (Threshold: 60%)
                  </div>
                  <span>•</span>
                  <div>
                    CA Average: <strong className={stu.caPercentage < 40 ? 'text-rose-600' : 'text-slate-900'}>
                      {stu.caPercentage}%
                    </strong> (Pass: 40%)
                  </div>
                  <span>•</span>
                  <div>
                    Phone: <span className="font-mono text-slate-500">{stu.phone}</span>
                  </div>
                </div>
              </div>

              {/* Triage Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => handleQuickSimulateSms(stu)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-semibold transition"
                  title="Send Simulated Warning SMS"
                >
                  <Smartphone size={13} />
                  <span>Send SMS</span>
                </button>

                <button
                  onClick={() => handleOpenInterventionModal(stu)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <MessageSquare size={13} />
                  <span>Log Intervention</span>
                </button>

                <Link
                  to={`/coordinator/reports?student=${stu.id}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                >
                  <FileText size={13} />
                  <span>Print Dossier</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Intervention Modal */}
      {selectedStudentForIntervention && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Log Academic Counseling Intervention</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedStudentForIntervention.name} ({selectedStudentForIntervention.matricNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentForIntervention(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveIntervention} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intervention Action Type</label>
                <select
                  value={interventionActionType}
                  onChange={(e) => setInterventionActionType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 bg-white"
                >
                  <option value="Counseling Session">Coordinator Counseling Session</option>
                  <option value="Remedial Tutorial Assigned">Assigned Departmental Remedial Tutorial</option>
                  <option value="Parent / Guardian Contacted">Parent / Guardian Contacted</option>
                  <option value="Official Warning Notice Issued">Official Academic Warning Issued</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-Up Review Date</label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Counselor Notes & Directives</label>
                <textarea
                  rows={4}
                  required
                  value={interventionNotes}
                  onChange={(e) => setInterventionNotes(e.target.value)}
                  placeholder="Record discussion outcomes, student explanations, and improvement milestones..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForIntervention(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-fud-900 hover:bg-fud-800 text-white rounded-lg font-semibold shadow-sm transition"
                >
                  Save Intervention Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
