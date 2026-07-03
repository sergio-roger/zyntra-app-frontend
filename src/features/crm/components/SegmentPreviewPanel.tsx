import { usePreviewContacts } from "@crm/hooks/useSegments";
import { SegmentCondition } from "@crm/types/segment-condition";
import { Loader2, Users } from "lucide-react";
import React from "react";

interface SegmentPreviewPanelProps {
  conditions: SegmentCondition[];
  enabled: boolean;
}

export const SegmentPreviewPanel: React.FC<SegmentPreviewPanelProps> = ({
  conditions,
  enabled,
}) => {
  const { data, isLoading } = usePreviewContacts(
    conditions,
    { page: 1, limit: 5 },
    enabled,
  );

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-950/30 p-4 flex flex-col gap-4 min-h-[280px] xl:h-full">
      <div className="border-b border-slate-700/40 pb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Vista Previa
        </h4>
        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
          Primeros 5 contactos que coinciden.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <Loader2 className="animate-spin text-indigo-500" size={24} />
          <p className="text-[10px] text-slate-500 animate-pulse">
            Calculando…
          </p>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
          <Users size={24} className="text-slate-700" />
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-[180px]">
            Ningún contacto coincide con las reglas actuales.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center bg-indigo-500/8 border border-indigo-500/15 px-3 py-2 rounded-lg text-xs text-indigo-300">
            <span className="text-indigo-400/70">Total coincidencias</span>
            <span className="font-black">{data.total}</span>
          </div>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
            {data.items.map((c) => (
              <div
                key={c.id}
                className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700/40 text-xs"
              >
                <div className="min-w-0 mr-2">
                  <p className="font-bold text-white truncate">{c.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {c.email || c.phone || "Sin contacto"}
                  </p>
                </div>
                {c.lifecycleStage ? (
                  <span
                    className="shrink-0 text-[9px] uppercase font-black px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${c.lifecycleStage.color}15`,
                      color: c.lifecycleStage.color,
                      border: `1px solid ${c.lifecycleStage.color}25`,
                    }}
                  >
                    {c.lifecycleStage.name}
                  </span>
                ) : (
                  <span className="shrink-0 text-[9px] uppercase font-black text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                    —
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
