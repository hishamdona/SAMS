import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = 'neutral',
  accent = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  footer,
  className = '',
}) {
  const accentStyles = {
    primary: {
      bg: 'bg-white',
      border: 'border-slate-200',
      iconBg: 'bg-indigo-50 text-indigo-600',
      valueColor: 'text-slate-900',
    },
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-700',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      valueColor: 'text-amber-700',
    },
    danger: {
      bg: 'bg-white',
      border: 'border-rose-200',
      iconBg: 'bg-rose-100 text-rose-600',
      valueColor: 'text-rose-700',
    },
    info: {
      bg: 'bg-white',
      border: 'border-sky-200',
      iconBg: 'bg-sky-50 text-sky-600',
      valueColor: 'text-slate-900',
    },
  };

  const current = accentStyles[accent] || accentStyles.primary;

  return (
    <div className={`p-5 rounded-2xl border ${current.border} ${current.bg} shadow-subtle hover:shadow-card transition duration-150 flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className={`p-2.5 rounded-xl shrink-0 ${current.iconBg}`}>
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold tracking-tight ${current.valueColor}`}>{value}</span>
          {badge && (
            <span className="text-[11px] font-semibold text-slate-500">{badge}</span>
          )}
        </div>

        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>

      {footer && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}
