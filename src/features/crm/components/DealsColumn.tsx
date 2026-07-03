import { Deal } from "@crm/types/deal";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { useDroppable } from "@dnd-kit/core";
import { Pencil } from "lucide-react";
import React from "react";
import { DealCard } from "./DealCard";

interface DealsColumnProps {
  stage: DealPipelineStage;
  deals: Deal[];
  totalValue: number;
  onDealClick?: (deal: Deal) => void;
  onEditStage?: (stage: DealPipelineStage) => void;
}

export const DealsColumn: React.FC<DealsColumnProps> = ({
  stage,
  deals,
  totalValue,
  onDealClick,
  onEditStage,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  const formattedTotal = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(totalValue);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-4 min-w-[280px] w-full max-w-[320px] rounded-2xl p-4 border backdrop-blur-sm transition-colors duration-200 ${
        isOver
          ? "bg-indigo-500/10 border-indigo-500/40"
          : "bg-slate-900/40 border-white/[0.03]"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div
          className="h-1 w-full rounded-full opacity-80"
          style={{ backgroundColor: stage.color }}
        />
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              {stage.name}
            </h3>
            <span className="flex h-5 min-w-[22px] items-center justify-center rounded-full bg-slate-800 border border-white/5 px-1.5 text-[10px] font-bold text-slate-400">
              {deals.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {onEditStage && (
              <button
                onClick={() => onEditStage(stage)}
                className="p-1 rounded-lg bg-white/5 hover:bg-slate-700/60 text-slate-500 hover:text-slate-300 border border-white/5 transition-all active:scale-95"
                title="Editar esta etapa"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() =>
                onDealClick?.({ id: "new", stage_id: stage.id } as any)
              }
              className="p-1 rounded-lg bg-white/5 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 border border-white/5 transition-all active:scale-95"
              title="Añadir negocio a esta etapa"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border"
              style={{
                color: stage.color,
                borderColor: `${stage.color}40`,
                backgroundColor: `${stage.color}15`,
              }}
            >
              {stage.probability_percent}%
            </span>
          </div>
        </div>
        <div className="px-1">
          <span className="text-xs font-bold text-slate-500">Total: </span>
          <span className="text-sm font-black text-indigo-400">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Card list */}
      <div className="flex flex-col gap-3 min-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
        ))}

        {deals.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl transition-colors ${
              isOver
                ? "border-indigo-500/50 bg-indigo-500/5 opacity-100"
                : "border-white/5 bg-white/[0.02] opacity-30"
            }`}
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {isOver ? "Soltar aquí" : "Vacío"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
