import { useEffect, useRef, useId } from 'react';
import { create } from 'zustand';
import { SelectOption } from '@core/ui/select.types';

interface SelectState {
  openStates: Record<string, boolean>;
  focusedIndices: Record<string, number>;
  setOpen: (id: string, open: boolean) => void;
  setFocusedIndex: (id: string, index: number) => void;
  resetSelect: (id: string) => void;
}

const useSelectStore = create<SelectState>((set) => ({
  openStates: {},
  focusedIndices: {},
  setOpen: (id, open) =>
    set((state) => ({
      openStates: { ...state.openStates, [id]: open },
      focusedIndices: open
        ? state.focusedIndices
        : { ...state.focusedIndices, [id]: -1 },
    })),
  setFocusedIndex: (id, index) =>
    set((state) => ({
      focusedIndices: { ...state.focusedIndices, [id]: index },
    })),
  resetSelect: (id) =>
    set((state) => {
      const openStates = { ...state.openStates };
      const focusedIndices = { ...state.focusedIndices };
      delete openStates[id];
      delete focusedIndices[id];
      return { openStates, focusedIndices };
    }),
}));

export function useSelect<TValue>(
  idProp: string | undefined,
  options: SelectOption<TValue>[],
  clearable: boolean,
  onChange: (value: TValue | null) => void,
) {
  const generatedId = useId();
  const selectId = idProp || generatedId;

  const open = useSelectStore((s) => s.openStates[selectId] ?? false);
  const focusedIndex = useSelectStore((s) => s.focusedIndices[selectId] ?? -1);
  const setOpen = useSelectStore((s) => s.setOpen);
  const setFocusedIndex = useSelectStore((s) => s.setFocusedIndex);
  const resetSelect = useSelectStore((s) => s.resetSelect);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const totalItems = (clearable ? 1 : 0) + options.length;

  useEffect(() => {
    return () => {
      resetSelect(selectId);
    };
  }, [selectId, resetSelect]);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(selectId, false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(selectId, false);
    };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [selectId, setOpen]);

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const domItems =
      listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
    domItems[focusedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [focusedIndex]);

  const selectAtIndex = (idx: number) => {
    if (clearable && idx === 0) {
      onChange(null);
    } else {
      const opt = options[clearable ? idx - 1 : idx];
      if (opt && !opt.disabled) onChange(opt.value);
    }
    setOpen(selectId, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(selectId, true);
        setFocusedIndex(selectId, e.key === 'ArrowDown' ? 0 : totalItems - 1);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(
          selectId,
          focusedIndex < totalItems - 1 ? focusedIndex + 1 : focusedIndex,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(selectId, focusedIndex > 0 ? focusedIndex - 1 : 0);
        break;
      case 'Enter':
      case ' ':
        if (focusedIndex >= 0) {
          e.preventDefault();
          selectAtIndex(focusedIndex);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(selectId, false);
        break;
    }
  };

  return {
    selectId,
    open,
    focusedIndex,
    setOpen: (val: boolean) => setOpen(selectId, val),
    setFocusedIndex: (idx: number) => setFocusedIndex(selectId, idx),
    containerRef,
    listRef,
    handleKeyDown,
    selectAtIndex,
  };
}
