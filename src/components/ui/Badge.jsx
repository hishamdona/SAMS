import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  size = 'md',        // 'sm' | 'md' | 'lg'
  dot = false,
  icon: Icon,
  className = '',
}) {
  const variants = {
    primary: 'bg-fud-50 text-fud-800 border-fud-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    primary: 'bg-fud-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-600',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 font-semibold',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    lg: 'px-3 py-1.5 text-xs gap-2 font-bold',
  };

  const currentVariant = variants[variant] || variants.neutral;
  const currentDot = dots[variant] || dots.neutral;
  const currentSize = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs ${currentVariant} ${currentSize} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${currentDot} shrink-0`}></span>}
      {Icon && <Icon size={size === 'sm' ? 10 : 12} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
