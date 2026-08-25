import React from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';
import FudLogo from './FudLogo';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SAMS Application Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetAndReload = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl space-y-6">
            <div className="flex justify-center">
              <FudLogo className="w-20 h-20 drop-shadow-md" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                <AlertTriangle size={14} />
                <span>Runtime Diagnostics Active</span>
              </div>
              <h1 className="text-xl font-bold font-display">Student Academic Monitoring System</h1>
              <p className="text-xs text-slate-300">
                Department of Computer Science • Federal University Dutse
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl text-left font-mono text-[11px] text-rose-300 border border-slate-800 overflow-x-auto max-h-40">
              {this.state.error?.toString()}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleResetAndReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-fud-600 hover:bg-fud-500 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Reset Demo State & Reload</span>
              </button>

              <a
                href="/login"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                <Home size={15} />
                <span>Go to Login</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
