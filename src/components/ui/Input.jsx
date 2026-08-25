import React from 'react';

export default function Input({
  label,
  helperText,
  error,
  icon: Icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  required = false,
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={15} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full px-3.5 py-2 text-xs rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 bg-white ${
            Icon && iconPosition === 'left' ? 'pl-9' : ''
          } ${Icon && iconPosition === 'right' ? 'pr-9' : ''} ${
            error
              ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 text-slate-900 focus:ring-fud-500 focus:border-fud-500 hover:border-slate-400'
          } ${className}`}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Icon size={15} />
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
