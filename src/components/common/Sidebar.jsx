import { authService } from '../../services/authService';
import FudLogo from './FudLogo';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  CalendarCheck, 
  FileSpreadsheet, 
  AlertTriangle, 
  FileText, 
  Bell, 
  User, 
  BarChart3, 
  ShieldAlert,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const role = currentUser?.role || 'admin';

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'User & Staff', path: '/admin/users', icon: Users },
          { label: 'Students Directory', path: '/admin/students', icon: GraduationCap },
          { label: 'Course Offerings', path: '/admin/courses', icon: BookOpen },
          { label: 'System Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'lecturer':
        return [
          { label: 'Lecturer Dashboard', path: '/lecturer/dashboard', icon: LayoutDashboard },
          { label: 'My Courses', path: '/lecturer/courses', icon: BookOpen },
          { label: 'Record Attendance', path: '/lecturer/attendance', icon: CalendarCheck },
          { label: 'CA Scores Entry', path: '/lecturer/ca-scores', icon: FileSpreadsheet },
        ];
      case 'coordinator':
        return [
          { label: 'Coordinator Dashboard', path: '/coordinator/dashboard', icon: LayoutDashboard },
          { label: 'Students Monitoring', path: '/coordinator/students', icon: Users },
          { label: 'At-Risk Triage', path: '/coordinator/at-risk', icon: ShieldAlert, badge: 'Live' },
          { label: 'Alerts & SMS Logs', path: '/coordinator/alerts', icon: Bell },
          { label: 'Academic Reports', path: '/coordinator/reports', icon: FileText },
        ];
      case 'student':
        return [
          { label: 'Academic Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'My Profile', path: '/student/profile', icon: User },
          { label: 'Course Performance', path: '/student/performance', icon: BarChart3 },
          { label: 'My Alerts & Notices', path: '/student/alerts', icon: Bell },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <FudLogo className="w-9 h-9 shrink-0 drop-shadow-xs" />
            <div>
              <span className="font-display font-bold text-sm text-slate-900">SAMS Portal</span>
              <span className="block text-[10px] text-fud-600 font-semibold uppercase tracking-wider">
                {role} Portal
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-fud-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className={`shrink-0 transition ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    size={13}
                    className={`opacity-0 group-hover:opacity-100 transition ${
                      isActive ? 'opacity-100 text-slate-300' : 'text-slate-400'
                    }`}
                  />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Department Tag & Quick Help */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mb-1">
              <Sparkles size={13} className="text-amber-500" />
              <span>FUD CS Department</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Early Warning & Academic Monitoring System (100L & 200L)
            </p>
            <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Status: Online</span>
              <span className="text-emerald-600 font-medium">● Operational</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
