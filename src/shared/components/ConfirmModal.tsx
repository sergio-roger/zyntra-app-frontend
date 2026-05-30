import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20',
    primary: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20',
    warning: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20',
  };

  const iconStyles = {
    danger: 'text-rose-400 bg-rose-400/10',
    primary: 'text-indigo-400 bg-indigo-400/10',
    warning: 'text-amber-400 bg-amber-400/10',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyles[variant]}`}>
              <AlertTriangle size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white leading-6">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>

            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white/[0.02] px-6 py-4 flex flex-row-reverse gap-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-white shadow-lg transition-all ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
