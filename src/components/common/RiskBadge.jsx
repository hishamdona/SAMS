import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

export default function RiskBadge({ status, showIcon = true, size = 'md', className = '' }) {
  const normStatus = (status || '').trim();

  let bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotBg = 'bg-emerald-500';
  let Icon = ShieldCheck;
  let label = 'Safe';

  if (normStatus === 'Critical At-Risk') {
    bg = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-300/40';
    dotBg = 'bg-rose-600 animate-pulse';
    Icon = AlertOctagon;
    label = 'Critical At-Risk';
  } else if (normStatus === 'At-Risk') {
    bg = 'bg-amber-50 text-amber-700 border-amber-200';
    dotBg = 'bg-amber-500';
    Icon = AlertTriangle;
    label = 'At-Risk';
  } else if (normStatus === 'Safe') {
    bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotBg = 'bg-emerald-500';
    Icon = ShieldCheck;
    label = 'Safe';
  } else {
    bg = 'bg-slate-100 text-slate-700 border-slate-200';
    dotBg = 'bg-slate-400';
    Icon = HelpCircle;
    label = normStatus || 'Unknown';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-semibold',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }[size] || 14;

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm ${bg} ${sizeClasses} ${className}`}>
      {showIcon ? (
        <Icon size={iconSizes} className="shrink-0" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${dotBg} shrink-0`}></span>
      )}
      <span>{label}</span>
    </span>
  );
}
