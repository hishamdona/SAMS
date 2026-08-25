import { authService } from '../../services/authService';
import FudLogo from '../../components/common/FudLogo';
import { 
  Shield, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  School
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sams.fud.edu.ng');
  const [password, setPassword] = useState('Password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      title: 'Administrator',
      name: 'Prof. A. B. Danbaba',
      email: 'admin@sams.fud.edu.ng',
      password: 'Password123',
      icon: Shield,
      badge: 'HOD Office',
      color: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-900',
      iconColor: 'text-indigo-600'
    },
    {
      role: 'coordinator',
      title: 'Level Coordinator',
      name: 'Mal. Ibrahim Sani',
      email: 'coordinator@sams.fud.edu.ng',
      password: 'Password123',
      icon: Users,
      badge: '100L / 200L',
      color: 'border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-900',
      iconColor: 'text-sky-600'
    },
    {
      role: 'lecturer',
      title: 'Course Lecturer',
      name: 'Dr. M. A. Dutse',
      email: 'lecturer@sams.fud.edu.ng',
      password: 'Password123',
      icon: BookOpen,
      badge: 'CSC 201 & 101',
      color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900',
      iconColor: 'text-emerald-600'
    },
    {
      role: 'student',
      title: 'Student (200L)',
      name: 'Usman Aminu Ibrahim',
      email: 'student@sams.fud.edu.ng',
      password: 'Password123',
      icon: GraduationCap,
      badge: 'FCP/CSC/22/001',
      color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-900',
      iconColor: 'text-amber-600'
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authService.login(email, password);
      if (result.success) {
        const dest = authService.getRoleHomePath(result.user.role);
        navigate(dest);
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 300);
  };

  const handleQuickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setLoading(true);

    setTimeout(() => {
      const result = authService.demoLogin(account.role);
      if (result.success) {
        const dest = authService.getRoleHomePath(result.user.role);
        navigate(dest);
      } else {
        setError(result.error);
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background University Accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-fud-700/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Real Official FUD Emblem Seal */}
        <div className="flex justify-center mb-3">
          <FudLogo className="w-20 h-20 drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
        </div>

        <h1 className="text-2xl font-display font-bold tracking-tight text-white sm:text-3xl">
          Student Academic Monitoring System
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Department of Computer Science • Faculty of Computing<br />
          <span className="text-amber-400 font-medium">Federal University Dutse, Jigawa State</span>
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
          <Sparkles size={13} className="text-amber-400" />
          <span>Final-Year Project Prototype Demonstration</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          {/* Quick Demo 1-Click Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Select Demo Persona (1-Click Instant Sign-In)
              </label>
              <span className="text-[11px] text-slate-400">Click any card below</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleQuickLogin(account)}
                    className={`flex items-start gap-3 p-3 text-left rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md hover:scale-[1.01] ${account.color}`}
                  >
                    <div className={`p-2 rounded-lg bg-white shadow-2xs shrink-0 ${account.iconColor}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-slate-900 truncate">{account.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white/80 border border-slate-200 shrink-0">
                          {account.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate mt-0.5">{account.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{account.email}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">Or Sign In Manually</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@sams.fud.edu.ng"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-fud-500 focus:border-fud-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-semibold text-white bg-fud-900 hover:bg-fud-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fud-500 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Enter SAMS Portal</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Thesis Academic Early-Warning Rules Reminder */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 -mx-6 -mb-8 px-6 py-4 rounded-b-2xl">
            <div className="text-[11px] font-semibold text-slate-700 mb-1">
              Thesis Early-Warning Classification Criteria:
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-600">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-emerald-700">Safe:</span> Attendance ≥60% & CA ≥40%
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-amber-700">At-Risk:</span> Att &lt;60% OR CA &lt;40%
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-rose-700">Critical:</span> Att &lt;60% AND CA &lt;40%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
