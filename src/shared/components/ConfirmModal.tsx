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
    danger: 'bg-error hover:opacity-90 shadow-error/20',
    primary: 'bg-tertiary hover:opacity-90 shadow-tertiary/20 text-tertiary-content',
    warning: 'bg-warning hover:opacity-90 shadow-warning/20',
  };

  const iconStyles = {
    danger: 'text-error bg-error/10',
    primary: 'text-tertiary bg-tertiary/10',
    warning: 'text-warning bg-warning/10',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-base-200 border border-base-300 shadow-xl transition-all">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyles[variant]}`}
            >
              <AlertTriangle size={20} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-base-content leading-6">
                {title}
              </h3>
              <p className="mt-2 text-sm text-base-content/60 leading-relaxed">
                {description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-base-content/50 hover:text-base-content hover:bg-base-300/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-base-300/20 px-6 py-4 flex flex-row-reverse gap-3 border-t border-base-300">
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
            className="inline-flex justify-center rounded-xl px-4 py-2 text-sm font-bold text-base-content/70 border border-base-300 hover:bg-base-300/50 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
