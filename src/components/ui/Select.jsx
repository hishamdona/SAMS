import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Select({
  label,
  helperText,
  error,
  options = [],
  children,
  className = '',
  required = false,
  id,
  ...props
}) {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`w-full appearance-none pl-3.5 pr-9 py-2 text-xs rounded-xl border bg-white transition-all duration-150 focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 text-slate-900 focus:ring-fud-500 focus:border-fud-500 hover:border-slate-400'
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown size={14} />
        </div>
      </div>

      {error ? (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
