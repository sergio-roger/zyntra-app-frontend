import React from 'react';
import { Loader2 } from 'lucide-react';

interface PermissionToggleProps {
  menuId: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  isPending?: boolean;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({
  label,
  checked,
  disabled = false,
  onChange,
  isPending = false,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-white">{label}</span>
        {isPending && <Loader2 size={14} className="text-indigo-400 animate-spin" />}
      </div>
      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
          checked ? 'bg-indigo-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
