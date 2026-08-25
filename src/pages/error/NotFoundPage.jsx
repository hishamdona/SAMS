import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import { Home, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const homePath = currentUser ? authService.getRoleHomePath(currentUser.role) : '/login';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background Blurs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-fud-700/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200">
        {/* Emblem */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-fud-900 via-fud-800 to-fud-700 border-2 border-fud-500 shadow-xl text-amber-400 font-display font-extrabold text-2xl mx-auto">
          FUD
        </div>

        <div className="space-y-2">
          <div className="text-4xl font-extrabold font-display text-slate-900 tracking-tight">404</div>
          <h1 className="text-lg font-bold text-slate-800">Page Not Found in SAMS Portal</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested academic monitoring page does not exist or you may not have sufficient role permissions to access this endpoint.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            icon={ArrowLeft}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>

          <Link to={homePath} className="w-full sm:w-auto">
            <Button
              variant="primary"
              icon={Home}
              className="w-full sm:w-auto"
            >
              Return to SAMS Hub
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Department of Computer Science • Federal University Dutse
        </div>
      </div>
    </div>
  );
}
