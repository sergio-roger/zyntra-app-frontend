import { AtSign, Paperclip, Send, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

export const ChatComposer: React.FC = () => {
  const [draft, setDraft] = useState('');

  return (
    <div className="border-t border-base-300 p-4">
      <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200 px-3 py-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Escribe un mensaje o asigna una tarea al equipo..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-base-content/40"
        />
        <button
          onClick={() => setDraft('')}
          disabled={!draft.trim()}
          className="btn btn-sm btn-circle border-none bg-secondary text-white disabled:opacity-40 disabled:bg-base-300"
        >
          <Send size={16} />
        </button>
      </div>
      <div className="flex items-center gap-4 mt-2 px-1 text-xs text-base-content/50">
        <button className="flex items-center gap-1 hover:text-base-content/80">
          <Paperclip size={14} /> Adjuntar
        </button>
        <button className="flex items-center gap-1 hover:text-base-content/80">
          <AtSign size={14} /> Mencionar agente
        </button>
        <button className="flex items-center gap-1 hover:text-base-content/80">
          <Sparkles size={14} /> Sugerir acción
        </button>
      </div>
    </div>
  );
};
