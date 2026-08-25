import React, { useState, useEffect } from 'react';
import { alertService } from '../../services/alertService';
import { studentService } from '../../services/studentService';
import { 
  X, 
  Smartphone, 
  Send, 
  CheckCheck, 
  Search, 
  Clock, 
  User, 
  Phone, 
  AlertCircle,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

export default function SmsSimulatorModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [students, setStudents] = useState([]);
  
  // Compose state
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setLogs(alertService.getAllSmsLogs());
    setStudents(studentService.getAll());
  };

  if (!isOpen) return null;

  const filteredLogs = logs.filter(log => 
    log.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.recipientPhone?.includes(searchTerm) ||
    log.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendManualSms = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !smsMessage.trim()) return;

    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    setIsSending(true);
    setTimeout(() => {
      alertService.generateSimulatedSms({
        studentId: student.id,
        recipientName: student.name,
        recipientPhone: student.phone,
        message: `FUD SAMS MANUAL NOTICE: ${student.name} (${student.matricNumber}) - ${smsMessage.trim()}`
      });
      setIsSending(false);
      setSmsMessage('');
      setShowCompose(false);
      loadData();
    }, 400);
  };

  const handleSelectStudentForCompose = (studentId) => {
    setSelectedStudentId(studentId);
    const stu = students.find(s => s.id === studentId);
    if (stu) {
      setSmsMessage(`Please report to the Department of Computer Science Level Coordinator office regarding your academic standing.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">SMS Notification Simulator</h3>
                <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  Mock Gateway Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Simulates automated FUD early-warning SMS alerts dispatched to students</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, phone number or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-fud-500 focus:border-fud-500"
            />
          </div>
          <button
            onClick={() => setShowCompose(!showCompose)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-fud-900 hover:bg-fud-800 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <Send size={13} />
            <span>{showCompose ? 'View Log History' : 'Simulate New SMS'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-100/50">
          {showCompose ? (
            /* Manual SMS Composer */
            <form onSubmit={handleSendManualSms} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
                <Send size={16} className="text-fud-500" />
                <span>Simulate Dispatch of Custom Academic Warning SMS</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Target Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleSelectStudentForCompose(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                >
                  <option value="">-- Choose a 100L or 200L Student --</option>
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.matricNumber}) - Level {st.level} - {st.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  SMS Message Body <span className="text-slate-400 font-normal">({smsMessage.length}/160 chars)</span>
                </label>
                <textarea
                  rows={3}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Enter message to simulate sending to the student's mobile number..."
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 focus:border-fud-500"
                ></textarea>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <p>
                  <strong>Academic MVP Note:</strong> This generates a simulated cellular dispatch event in the client-side log database without incurring real SMS gateway charges.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending || !selectedStudentId || !smsMessage.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-fud-500 hover:bg-fud-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium shadow-sm transition"
                >
                  <Send size={13} />
                  <span>{isSending ? 'Simulating...' : 'Dispatch Simulated SMS'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* SMS Logs Feed (Realistic Mobile Bubble Presentation) */
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                  <Smartphone size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No SMS dispatch records found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Automated SMS will appear here when risk thresholds are triggered.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-fud-50 text-fud-700 flex items-center justify-center font-semibold text-xs border border-fud-200">
                          {log.recipientName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900">{log.recipientName}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Phone size={10} />
                            <span>{log.recipientPhone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCheck size={11} className="text-emerald-600" />
                          {log.status}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 mt-1">
                          <Clock size={10} />
                          <span>{new Date(log.dispatchedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message Bubble */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700 leading-relaxed font-mono">
                      {log.message}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                      <span>Gateway: FUD Dept CS SMS Engine (Simulated)</span>
                      <span>Ref: #{log.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total SMS Events: <strong>{logs.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
