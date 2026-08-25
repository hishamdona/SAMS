import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = 'Loading SAMS academic records...',
  type = 'spinner', // 'spinner' | 'skeleton'
  rows = 3,
  className = '',
}) {
  if (type === 'skeleton') {
    return (
      <div className={`space-y-3 p-4 bg-white rounded-2xl border border-slate-200 animate-pulse ${className}`}>
        <div className="h-5 bg-slate-200 rounded-md w-1/3 mb-4"></div>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="space-y-2 py-2 border-b border-slate-100 last:border-0">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-slate-100 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-fud-50 text-fud-700 flex items-center justify-center border border-fud-200">
        <Loader2 size={20} className="animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-600">{message}</p>
    </div>
  );
}
