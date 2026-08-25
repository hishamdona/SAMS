import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  padding = 'normal', // 'none' | 'sm' | 'normal' | 'lg'
  onClick,
  ...props
}) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    normal: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding] || 'p-5 sm:p-6';

  const hoverClasses = hoverable ? 'hover:shadow-card hover:border-slate-300 transition-all duration-150 cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-subtle ${paddingClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  title,
  subtitle,
  action,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4 ${className}`}>
      {children ? (
        children
      ) : (
        <>
          <div>
            {title && <h3 className="font-bold text-sm text-slate-900 leading-snug">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </>
      )}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-3 text-xs ${className}`}>
      {children}
    </div>
  );
};
