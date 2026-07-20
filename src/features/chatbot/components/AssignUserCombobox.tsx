import { AssignableUser } from '@features/chatbot/api/aiApi';
import { Loader2, LucideIcon, Search, UserPlus } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

interface AssignUserComboboxProps {
  users: AssignableUser[];
  loading?: boolean;
  disabled?: boolean;
  triggerLabel: string;
  icon?: LucideIcon;
  onSelect: (user: AssignableUser) => void;
}

/**
 * Selector simple de un solo usuario, filtrado en memoria — la lista de
 * usuarios del negocio ya viene completa desde /chat/assignable-users, no
 * hace falta debounce ni paginado de red como en AsyncSelectMultiple.
 */
export const AssignUserCombobox: React.FC<AssignUserComboboxProps> = ({
  users,
  loading = false,
  disabled = false,
  triggerLabel,
  icon: Icon = UserPlus,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term));
  }, [users, search]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen((v) => !v);
    setSearch('');
    if (!open) setTimeout(() => searchRef.current?.focus(), 50);
  };

  const handleSelect = (user: AssignableUser) => {
    setOpen(false);
    onSelect(user);
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="btn btn-ghost btn-xs gap-1 whitespace-nowrap disabled:opacity-50"
      >
        <Icon size={13} /> {triggerLabel}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-56 z-50 bg-base-300 border border-base-content/10 rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-base-content/10">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar usuario..."
                  className="w-full bg-base-100 border border-base-content/10 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-primary/40"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-6 gap-2 text-base-content/50">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Cargando...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-base-content/50">
                  <span className="text-xs">
                    {search ? 'Sin resultados' : 'No hay usuarios disponibles'}
                  </span>
                </div>
              ) : (
                filtered.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelect(user)}
                    className="w-full px-3 py-2 text-xs text-left hover:bg-base-content/5 transition-colors truncate"
                  >
                    {user.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
