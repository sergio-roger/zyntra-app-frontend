import React, { useState } from 'react';
import { LucideIcon, X } from 'lucide-react';

interface TagInputProps {
  label?: string;
  icon?: LucideIcon;
  hint?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxItems: number;
  maxItemLength: number;
  placeholder?: string;
  containerClassName?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label,
  icon: Icon,
  hint,
  error,
  value,
  onChange,
  maxItems,
  maxItemLength,
  placeholder = 'Escribe y presiona Enter',
  containerClassName = '',
}) => {
  const [draft, setDraft] = useState('');
  const atLimit = value.length >= maxItems;

  const addTag = () => {
    const tag = draft.trim().slice(0, maxItemLength);
    if (!tag || atLimit || value.includes(tag)) {
      setDraft('');
      return;
    }
    onChange([...value, tag]);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
          {Icon && <Icon size={14} className="text-slate-500" />}
          {label}
        </label>
      )}

      <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900/40 px-2 py-2 min-h-[42px]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Quitar ${tag}`}
              className="text-slate-500 hover:text-rose-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {!atLimit && (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
          />
        )}
      </div>

      {error ? (
        <p className="text-[10px] font-medium text-rose-400 ml-1">{error}</p>
      ) : (
        hint && <p className="text-[10px] text-slate-500 ml-1">{hint}</p>
      )}
    </div>
  );
};
