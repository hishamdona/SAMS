import React from 'react';
import Modal from './Modal';
import { AlertTriangle, AlertOctagon, RotateCcw, Trash2, UserX } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to proceed with this operation?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'primary'
  isLoading = false
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          variant === 'danger'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : variant === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <div className="shrink-0 mt-0.5">
            {variant === 'danger' ? (
              <AlertOctagon size={20} className="text-rose-600" />
            ) : (
              <AlertTriangle size={20} className="text-amber-600" />
            )}
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="font-bold text-xs">{title}</h4>
            <p className="text-[11px] leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-xl font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5 ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-fud-900 hover:bg-fud-800'
            }`}
          >
            {isLoading ? (
              <span className="inline-block animate-spin mr-1">⏳</span>
            ) : null}
            <span>{isLoading ? 'Processing...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
