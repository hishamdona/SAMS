import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import Modal from '../../components/ui/Modal';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  ShieldAlert, 
  School, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Database,
  Sliders,
  Sparkles,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState(storage.getItem(storage.KEYS.SETTINGS, {}));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const current = storage.getItem(storage.KEYS.SETTINGS, {});
    setSettings(current);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...settings,
      lastUpdated: new Date().toISOString()
    };
    storage.setItem(storage.KEYS.SETTINGS, updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleRestoreSystemDefaults = () => {
    setSettings(prev => ({
      ...prev,
      attendanceThreshold: 60,
      caThreshold: 40
    }));
  };

  const handleExecuteReset = () => {
    setIsResetting(true);
    storage.resetAll();
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false);
      window.location.reload();
    }, 400);
  };

  const handleExportData = () => {
    const exportBundle = {
      settings: storage.getItem(storage.KEYS.SETTINGS),
      students: storage.getItem(storage.KEYS.STUDENTS),
      courses: storage.getItem(storage.KEYS.COURSES),
      attendance: storage.getItem(storage.KEYS.ATTENDANCE),
      scores: storage.getItem(storage.KEYS.SCORES),
      alerts: storage.getItem(storage.KEYS.ALERTS),
      smsLogs: storage.getItem(storage.KEYS.SMS_LOGS),
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fud_sams_state_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-bold text-slate-900">System Configuration & Alert Parameters</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage statutory university early-warning rules, SMS simulation parameters, and LocalStorage state.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>System parameters updated successfully and applied across all monitoring modules.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Engine Thresholds (The Thesis Core) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldAlert size={18} className="text-amber-500" />
              <span>System Default Thresholds & Alert Configuration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                System Default Thresholds
              </span>
              <button
                type="button"
                onClick={handleRestoreSystemDefaults}
                className="text-[11px] text-fud-700 hover:text-fud-900 font-semibold underline cursor-pointer"
              >
                Restore 60% / 40% Defaults
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Attendance Threshold */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900">
                  Attendance Warning Threshold
                </label>
                <span className="font-mono text-xs font-bold text-fud-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Default: 60%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Students whose lecture attendance falls below this mark are classified as <strong>At-Risk (Attendance)</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="20"
                  max="90"
                  required
                  value={settings.attendanceThreshold || 60}
                  onChange={(e) => handleChange('attendanceThreshold', Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 font-bold text-center bg-white"
                />
                <span className="font-semibold text-slate-700">% statutory minimum</span>
              </div>
            </div>

            {/* CA Threshold */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900">
                  Continuous Assessment (CA) Threshold
                </label>
                <span className="font-mono text-xs font-bold text-fud-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Default: 40%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Students whose continuous assessment falls below this mark are classified as <strong>At-Risk (CA)</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="20"
                  max="70"
                  required
                  value={settings.caThreshold || 40}
                  onChange={(e) => handleChange('caThreshold', Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 font-bold text-center bg-white"
                />
                <span className="font-semibold text-slate-700">% pass mark (out of 40)</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl text-[11px] text-sky-900 flex items-start gap-2.5">
            <Info size={16} className="shrink-0 mt-0.5 text-sky-600" />
            <div>
              <strong className="block text-sky-950 font-bold">Thesis Risk Engine Evaluation Logic:</strong>
              <p className="mt-0.5 leading-relaxed">
                • <strong>Critical At-Risk:</strong> Triggered when Attendance &lt; {settings.attendanceThreshold || 60}% <em>AND</em> CA &lt; {settings.caThreshold || 40}%.<br/>
                • <strong>Moderate At-Risk:</strong> Triggered when only one metric violates the minimum threshold.<br/>
                • <strong>Safe:</strong> Meeting or exceeding both parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Institutional Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <School size={16} className="text-fud-500" />
            <span>Institutional Identity & Academic Session</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Name</label>
              <input
                type="text"
                value={settings.institution || 'Federal University Dutse'}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={settings.department || 'Department of Computer Science'}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Session</label>
              <input
                type="text"
                value={settings.session || '2025/2026'}
                onChange={(e) => handleChange('session', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                value={settings.semester || 'First Semester'}
                onChange={(e) => handleChange('semester', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-fud-500 bg-white"
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>
          </div>
        </div>

        {/* SMS Simulator Parameters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Smartphone size={16} className="text-sky-500" />
            <span>Simulated SMS Alert Dispatch Gateway</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-800">Automated SMS Trigger on Risk Detection</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Dispatches simulated mobile alerts to student phone numbers and level coordinator registry.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsSimulationEnabled !== false}
                onChange={(e) => handleChange('smsSimulationEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fud-900"></div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-fud-900 hover:bg-fud-800 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Save size={15} />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>

      {/* Data Management & Demo Reset Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
          <Database size={16} className="text-slate-600" />
          <span>Demo Data Management & Persistence</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The SAMS MVP persists all student enrollments, attendances, continuous assessment marks, and alerts in browser LocalStorage. You can export a JSON backup or restore pristine FUD mock datasets during supervisor demonstrations.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export Database State (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
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
