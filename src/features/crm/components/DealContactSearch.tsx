import React, { useState, useRef, useEffect } from 'react';
import { useContactsList } from '@crm/hooks/useContacts';
import { Contact } from '@crm/types/contact';
import { Building2, Search, User, X, ChevronDown, ChevronUp } from 'lucide-react';

interface DealContactSearchProps {
  value: string;
  selectedContact?: Contact | null;
  onChange: (contactId: string, contact: Contact | null) => void;
  required?: boolean;
  error?: string;
}

export const DealContactSearch: React.FC<DealContactSearchProps> = ({
  value,
  selectedContact,
  onChange,
  required,
  error,
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useContactsList(
    { search: search || undefined, limit: 20 },
    { enabled: open },
  );
  const results = data?.items ?? [];

  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [results.length, open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSelect = (c: Contact) => {
    onChange(c.id, c);
    setOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('', null);
    setSearch('');
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="text-xs font-medium text-slate-400 ml-1 flex items-center gap-1.5">
        <User size={14} /> Contacto vinculado {required && '*'}
      </label>

      {value && selectedContact ? (
        <div className="flex items-center justify-between w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4">
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-white font-medium truncate">
              {selectedContact.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {selectedContact.company && (
                <span className="flex items-center gap-1 text-[11px] text-indigo-400">
                  <Building2 size={10} />
                  {selectedContact.company.name}
                </span>
              )}
              {selectedContact.email && (
                <span className="text-[11px] text-slate-500 truncate">
                  {selectedContact.company ? '·' : ''} {selectedContact.email}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="ml-3 p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/5 shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-9 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-white rounded-md transition-colors"
            >
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {open && (
            <div className="w-full bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
              {results.length === 0 ? (
                <p className="px-4 py-3 text-xs text-slate-500 text-center">
                  {search ? 'Sin resultados' : 'Escribe para buscar...'}
                </p>
              ) : (
                <ul className="py-1">
                  {results.map((c, index) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(c)}
                        className={`w-full text-left px-4 py-2.5 transition-colors ${
                          index === selectedIndex ? 'bg-indigo-500/20' : 'hover:bg-white/5'
                        }`}
                      >
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.company && (
                            <span className="flex items-center gap-1 text-[11px] text-indigo-400">
                              <Building2 size={10} />
                              {c.company.name}
                            </span>
                          )}
                          {c.email && (
                            <span className="text-[11px] text-slate-500 truncate">
                              {c.email}
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  );
};
