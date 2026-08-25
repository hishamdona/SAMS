import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { studentService } from '../../services/studentService';
import { alertService } from '../../services/alertService';
import { 
  Bell, 
  Smartphone, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCheck, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Phone,
  CheckCircle2,
  Inbox
} from 'lucide-react';

export default function StudentAlertsPage() {
  const [dossier, setDossier] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'sms'

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

  const handleMarkAsRead = (alertId) => {
    alertService.markAsRead(alertId);
    loadData();
  };

  const handleMarkAllRead = () => {
    alertService.markAllAsRead();
    loadData();
  };

  if (!dossier) return null;

  const { student, alerts, smsLogs } = dossier;
  const unreadAlerts = alerts.filter(a => a.status === 'unread');

  const displayedAlerts = activeTab === 'unread' ? unreadAlerts : alerts;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">Academic Notifications & Mobile SMS Inbox</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official departmental early-warning notices and simulated cellular messages delivered to {student.phone}.
          </p>
        </div>

        {unreadAlerts.length > 0 && activeTab !== 'sms' && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'all'
              ? 'border-fud-900 bg-white text-fud-900 shadow-2xs font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Bell size={14} />
          <span>All Academic Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'unread'
              ? 'border-fud-900 bg-white text-fud-900 shadow-2xs font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <span>Unread Notices</span>
          {unreadAlerts.length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {unreadAlerts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'sms'
              ? 'border-fud-900 bg-white text-fud-900 shadow-2xs font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <Smartphone size={14} />
          <span>Simulated SMS Messages ({smsLogs.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab !== 'sms' ? (
        <div className="space-y-3">
          {displayedAlerts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
              <ShieldCheck size={36} className="text-emerald-500 mb-1" />
              <h3 className="font-bold text-slate-900 text-sm">No Warning Alerts in this View</h3>
              <p className="text-xs text-slate-500">Your academic performance is within compliant statutory parameters.</p>
            </div>
          ) : (
            displayedAlerts.map((al) => {
              const isCritical = al.severity === 'critical' || al.type.includes('Critical');
              const isUnread = al.status === 'unread';

              return (
                <div
                  key={al.id}
                  className={`bg-white rounded-2xl border shadow-subtle p-5 transition flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    isUnread ? 'border-fud-300 ring-1 ring-fud-200 bg-slate-50/40' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCritical ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {isCritical ? <AlertOctagon size={20} /> : <AlertTriangle size={20} />}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{al.type}</span>
                        <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          {al.courseCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {al.severity?.toUpperCase() || 'WARNING'}
                        </span>
                        {isUnread ? (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            New
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.2 rounded-full">
                            Read
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {al.message}
                      </p>

                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
                        <span>Sender: <strong>Level Coordinator</strong></span>
                        <span className="flex items-center gap-1 font-mono text-slate-400">
                          <Clock size={11} />
                          {new Date(al.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(al.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer self-end sm:self-auto shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* SMS Tab */
        <div className="space-y-3">
          {smsLogs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <Smartphone size={36} className="mx-auto text-slate-300 mb-2" />
              <h3 className="font-semibold text-slate-900 text-sm">No SMS Alerts Recorded</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated SMS messages will appear here when risk thresholds are breached.</p>
            </div>
          ) : (
            smsLogs.map((sms) => (
              <div
                key={sms.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Cellular Notice to {sms.recipientPhone || sms.phone}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCheck size={10} />
                    {sms.status}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl font-mono text-[11px] text-slate-700 leading-relaxed">
                  {sms.message}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>Carrier: FUD Dept CS Simulation Network</span>
                  <span>{new Date(sms.dispatchedAt || sms.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
