import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { alertService } from '../../services/alertService';
import { 
  Bell, 
  Smartphone, 
  LogOut, 
  User, 
  Menu, 
  Check, 
  AlertOctagon, 
  AlertTriangle, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, onOpenSmsModal }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const alertRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    loadAlerts();
    const handleDataUpdate = () => {
      setCurrentUser(authService.getCurrentUser());
      loadAlerts();
    };
    window.addEventListener('sams_data_updated', handleDataUpdate);
    return () => window.removeEventListener('sams_data_updated', handleDataUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setShowAlertDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadAlerts = () => {
    const all = alertService.getAllAlerts();
    setAlerts(all.slice(0, 6));
    setUnreadCount(alertService.getUnreadCount());
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    alertService.markAllAsRead();
    loadAlerts();
  };

  const handleAlertClick = (alert) => {
    alertService.markAsRead(alert.id);
    setShowAlertDropdown(false);
    if (currentUser?.role === 'coordinator') {
      navigate('/coordinator/alerts');
    } else if (currentUser?.role === 'student') {
      navigate('/student/alerts');
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'lecturer': return 'Course Lecturer';
      case 'coordinator': return 'Level Coordinator';
      case 'student': return 'Student (200L)';
      default: return role;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-subtle">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            {/* University Crest / Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fud-900 to-fud-700 flex items-center justify-center text-white shadow-sm border border-fud-800">
              <span className="font-display font-extrabold text-sm tracking-wider text-amber-400">FUD</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-slate-900 tracking-tight group-hover:text-fud-600 transition">
                  SAMS
                </span>
                <span className="hidden sm:inline-block bg-fud-50 text-fud-800 border border-fud-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Computer Science
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                Federal University Dutse • Academic Monitoring
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Session Pill */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>2025/2026 Academic Session</span>
          <span className="text-slate-400">•</span>
          <span className="text-fud-600 font-semibold">1st Semester</span>
        </div>

        {/* Right: SMS Shortcut, Notifications, User Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* SMS Simulator Button */}
          <button
            onClick={onOpenSmsModal}
            title="Simulated SMS Notifications Log"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 text-xs font-medium transition shadow-sm"
          >
            <Smartphone size={15} className="text-sky-600" />
            <span className="hidden sm:inline">SMS Logs</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={alertRef}>
            <button
              onClick={() => setShowAlertDropdown(!showAlertDropdown)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative transition"
              aria-label="Academic alerts"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showAlertDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">Academic Risk Alerts</span>
                    {unreadCount > 0 && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-fud-600 hover:text-fud-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No active alerts in system
                    </div>
                  ) : (
                    alerts.map((al) => (
                      <div
                        key={al.id}
                        onClick={() => handleAlertClick(al)}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition text-xs flex gap-2.5 ${
                          al.status === 'unread' ? 'bg-slate-50/70 font-medium' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {al.severity === 'critical' ? (
                            <AlertOctagon size={16} className="text-rose-600" />
                          ) : (
                            <AlertTriangle size={16} className="text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-slate-900 truncate">{al.type}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(al.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{al.message}</p>
                          <div className="mt-1 text-[10px] text-slate-400 flex items-center gap-2">
                            <span>{al.studentName}</span>
                            <span>•</span>
                            <span>{al.courseCode}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                  <Link
                    to={currentUser?.role === 'coordinator' ? '/coordinator/alerts' : currentUser?.role === 'student' ? '/student/alerts' : '/coordinator/alerts'}
                    onClick={() => setShowAlertDropdown(false)}
                    className="text-xs text-fud-600 hover:text-fud-700 font-semibold inline-flex items-center gap-1"
                  >
                    <span>View all academic alerts</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition focus:outline-none"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser?.name || 'User'}
                </div>
                <div className="text-[10px] font-medium text-slate-500 capitalize">
                  {getRoleLabel(currentUser?.role)}
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 hidden md:block" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5">
                    <span className="inline-block bg-fud-50 text-fud-700 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                      Role: {currentUser?.role}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  {currentUser?.role === 'student' && (
                    <Link
                      to="/student/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User size={14} className="text-slate-400" />
                      <span>My Student Profile</span>
                    </Link>
                  )}
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin/settings"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User size={14} className="text-slate-400" />
                      <span>System Settings</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
