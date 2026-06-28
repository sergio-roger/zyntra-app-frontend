import { Check, ChevronDown, Loader2, LucideIcon, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncLoadResult<TItem> {
  items: TItem[];
  total: number;
  hasMore: boolean;
}

interface AsyncSelectMultipleProps<TItem> {
  loadOptions: (params: {
    search: string;
    page: number;
    limit: number;
  }) => Promise<AsyncLoadResult<TItem>>;
  getKey: (item: TItem) => string;
  getLabel: (item: TItem) => string;
  getDescription?: (item: TItem) => string | undefined;
  value: TItem[];
  onChange: (selected: TItem[]) => void;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  limit?: number;
  disabled?: boolean;
  error?: string;
}

export function AsyncSelectMultiple<TItem>({
  loadOptions,
  getKey,
  getLabel,
  getDescription,
  value,
  onChange,
  label,
  placeholder = 'Seleccionar...',
  icon: Icon,
  limit = 10,
  disabled = false,
  error,
}: AsyncSelectMultipleProps<TItem>): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<TItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    setFocusedIndex(-1);
  }, [items]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const domItems = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
    domItems[focusedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex]);

  const load = useCallback(
    async (searchTerm: string, pageNum: number, append: boolean) => {
      let cancelled = false;
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const result = await loadOptions({ search: searchTerm, page: pageNum, limit });
        if (!cancelled) {
          setItems((prev) => (append ? [...prev, ...result.items] : result.items));
          setHasMore(result.hasMore);
          setPage(pageNum);
        }
      } finally {
        if (!cancelled) {
          if (append) setLoadingMore(false);
          else setLoading(false);
        }
      }
      return () => { cancelled = true; };
    },
    [loadOptions, limit],
  );

  useEffect(() => {
    if (open) {
      setSearch('');
      setPage(1);
      load('', 1, false);
      const t = setTimeout(() => searchRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load(search, 1, false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const isSelected = (item: TItem) => value.some((v) => getKey(v) === getKey(item));

  const toggle = (item: TItem) => {
    const key = getKey(item);
    if (value.some((v) => getKey(v) === key)) {
      onChange(value.filter((v) => getKey(v) !== key));
    } else {
      onChange([...value, item]);
    }
  };

  const removeTag = (item: TItem) => {
    onChange(value.filter((v) => getKey(v) !== getKey(item)));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((i) => (i < items.length - 1 ? i + 1 : i));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((i) => (i > 0 ? i - 1 : 0));
        break;
      case 'Enter':
        if (focusedIndex >= 0 && items[focusedIndex]) {
          e.preventDefault();
          toggle(items[focusedIndex]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  const hasValue = value.length > 0;

  const triggerLabel = hasValue
    ? value.length === 1
      ? getLabel(value[0])
      : `${value.length} seleccionados`
    : placeholder;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
          {Icon && <Icon size={14} className="text-slate-500" />}
          {label}
        </label>
      )}

      <div ref={containerRef}>
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-multiselectable
          className={`
            w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-left
            flex items-center justify-between gap-2 min-h-[42px]
            focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${open ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-white/20'}
            ${error ? 'border-rose-500/50' : ''}
          `}
        >
          <span className={`truncate ${hasValue ? 'text-white' : 'text-slate-500'}`}>
            {triggerLabel}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Selected tags — visible when 2+ items */}
        {value.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {value.map((item) => (
              <span
                key={getKey(item)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary"
              >
                <span className="max-w-[120px] truncate">{getLabel(item)}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeTag(item); }}
                  className="hover:text-white transition-colors ml-0.5 shrink-0"
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown — inline (not absolute) so form's overflow-y:auto doesn't clip it */}
        {open && (
          <div
            role="listbox"
            aria-multiselectable
            className="w-full mt-1.5 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search input */}
            <div className="p-2 border-b border-white/5">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar... (↑↓ para navegar, Enter para seleccionar)"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Items list */}
            <div ref={listRef} className="max-h-52 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
                  <Loader2 size={15} className="animate-spin" />
                  <span className="text-xs">Cargando...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <span className="text-xs">
                    {search ? 'Sin resultados para esa búsqueda' : 'No hay datos disponibles'}
                  </span>
                </div>
              ) : (
                items.map((item, i) => {
                  const selected = isSelected(item);
                  const focused = focusedIndex === i;
                  const description = getDescription?.(item);
                  return (
                    <button
                      key={getKey(item)}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => toggle(item)}
                      className={`
                        w-full px-4 py-2.5 text-sm text-left transition-colors
                        flex items-center gap-3
                        ${selected ? 'bg-primary/10' : ''}
                        ${focused ? 'bg-white/10' : 'hover:bg-white/5'}
                      `}
                    >
                      {/* Checkbox */}
                      <span
                        className={`
                          w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all
                          ${selected ? 'bg-primary border-primary' : 'border-white/20 bg-slate-900/50'}
                        `}
                      >
                        {selected && <Check size={9} className="text-white" />}
                      </span>

                      {/* Label + description */}
                      <div className="min-w-0 flex-1">
                        <p className={`truncate ${selected ? 'text-white font-medium' : 'text-slate-300'}`}>
                          {getLabel(item)}
                        </p>
                        {description && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Load more */}
            {hasMore && !loading && (
              <div className="border-t border-white/5 p-2">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={() => load(search, page + 1, true)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loadingMore && <Loader2 size={11} className="animate-spin" />}
                  {loadingMore ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}

            {/* Footer: count + clear */}
            {value.length > 0 && (
              <div className="border-t border-white/5 px-4 py-2 flex items-center justify-between bg-slate-900/50">
                <span className="text-[11px] text-slate-500">
                  {value.length} seleccionado{value.length !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => onChange([])}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
