import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  onChange,
}) => {
  if (total === 0) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between text-sm text-slate-400">
      <span>
        Página <span className="text-slate-200">{page}</span> de{' '}
        <span className="text-slate-200">{totalPages}</span> ·{' '}
        <span className="text-slate-200">{total}</span> contactos
      </span>
      <div className="inline-flex gap-1">
        <button
          disabled={!canPrev}
          onClick={() => onChange(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs transition-colors enabled:hover:border-white/20 enabled:hover:bg-white/5 disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Anterior
        </button>
        <button
          disabled={!canNext}
          onClick={() => onChange(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-1.5 text-xs transition-colors enabled:hover:border-white/20 enabled:hover:bg-white/5 disabled:opacity-40"
        >
          Siguiente <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
