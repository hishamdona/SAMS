import React from 'react';

export default function Table({ children, className = '', containerClassName = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs ${containerClassName}`}>
      <table className={`w-full text-left text-xs ${className}`}>
        {children}
      </table>
    </div>
  );
}

Table.Header = function TableHeader({ children, className = '' }) {
  return (
    <thead className={`bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 ${className}`}>
      {children}
    </thead>
  );
};

Table.Body = function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-slate-100 ${className}`}>
      {children}
    </tbody>
  );
};

Table.Row = function TableRow({ children, className = '', onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-slate-50/80 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

Table.Head = function TableHead({ children, className = '', align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th className={`py-3 px-4 ${alignClass} ${className}`}>
      {children}
    </th>
  );
};

Table.Cell = function TableCell({ children, className = '', align = 'left' }) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td className={`py-3.5 px-4 ${alignClass} ${className}`}>
      {children}
    </td>
  );
};
