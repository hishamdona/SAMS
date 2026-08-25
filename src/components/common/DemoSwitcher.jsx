import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { storage } from '../../services/storage';
import { 
  Shield, 
  BookOpen, 
  Users, 
  GraduationCap, 
  RotateCcw, 
  Smartphone, 
  Sparkles, 
  ChevronDown,
  Info
} from 'lucide-react';

export default function DemoSwitcher({ onOpenSmsModal }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('sams_data_updated', handleUpdate);
    return () => window.removeEventListener('sams_data_updated', handleUpdate);
  }, []);

  const handleRoleSwitch = (role) => {
    const result = authService.demoLogin(role);
    if (result.success) {
      setCurrentUser(result.user);
      const targetPath = authService.getRoleHomePath(role);
      navigate(targetPath);
    }
  };

  const handleResetData = () => {
    setIsResetting(true);
    storage.resetAll();
    setTimeout(() => {
      setIsResetting(false);
      setShowConfirmReset(false);
      // Reload page to re-initialize clean in-memory states
      window.location.reload();
    }, 400);
  };

  const roles = [
    { role: 'admin', label: 'Admin (HOD)', icon: Shield, name: 'Prof. Danbaba', color: 'bg-indigo-600' },
    { role: 'coordinator', label: 'Coordinator', icon: Users, name: 'Mal. I. Sani', color: 'bg-sky-600' },
    { role: 'lecturer', label: 'Lecturer', icon: BookOpen, name: 'Dr. M. A. Dutse', color: 'bg-emerald-600' },
    { role: 'student', label: 'Student (200L)', icon: GraduationCap, name: 'Usman Aminu', color: 'bg-amber-600' },
  ];

  return (
    <aside aria-label="Demo control bar" className="demo-switcher bg-slate-900 text-white text-xs border-b border-slate-800 shadow-md relative z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Academic Demo Badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-medium tracking-wide text-slate-200">
            <span className="font-semibold text-white">FUD SAMS MVP</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">Dept. of Computer Science</span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700 text-amber-300 px-2 py-0.5 rounded text-[11px]">
            <Sparkles size={11} />
            Supervisor Demo Mode
          </span>
        </div>

        {/* Center: 1-Click Role Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-medium text-[11px] hidden lg:inline mr-1">Switch Persona:</span>
          {roles.map((item) => {
            const Icon = item.icon;
            const isActive = currentUser?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleRoleSwitch(item.role)}
                title={`Switch active session to ${item.label}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium text-[11px] whitespace-nowrap ${
                  isActive
                    ? 'bg-fud-500 text-white shadow-sm ring-1 ring-white/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Icon size={12} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Tools (SMS Simulator & Reset Data) */}
        <div className="flex items-center gap-2">
          {onOpenSmsModal && (
            <button
              onClick={onOpenSmsModal}
              title="Open Simulated SMS Alert Inbox"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700 transition"
            >
              <Smartphone size={12} />
              <span className="hidden sm:inline">SMS Logs</span>
            </button>
          )}

          <div className="relative">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                title="Reset all test attendances, scores, and alerts to initial seed state"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 transition"
              >
                <RotateCcw size={11} className={isResetting ? 'animate-spin' : ''} />
                <span className="hidden md:inline">Reset Seed</span>
              </button>
            ) : (
              <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-700 px-2 py-0.5 rounded">
                <span className="text-[11px] text-rose-200">Reset data?</span>
                <button
                  onClick={handleResetData}
                  disabled={isResetting}
                  className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold"
                >
                  {isResetting ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[10px]"
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
