import React, { useState } from "react";
import {
  Plus,
  Users,
  Loader2,
  ChevronDown,
  Filter,
  Edit2,
  Trash2,
} from "lucide-react";
import { EmptyState } from "@shared/components/EmptyState";
import { SOURCE_LABELS } from "@crm/types/crm";
import { Segment } from "@crm/types/segment";
import { SegmentCondition } from "@crm/types/segment-condition";
import { useLifecycleStages } from "@crm/hooks/useLifecycleStages";

const FIELD_LABELS: Record<string, string> = {
  source: "Origen",
  lifecycleStageId: "Ciclo de vida",
  deal_value: "Valor trato",
  tags: "Etiqueta",
};

const OP_LABELS: Record<string, string> = {
  equals: "=",
  not_equals: "≠",
  contains: "contiene",
  greater_than: ">",
  less_than: "<",
  in: "en",
  is_empty: "vacío",
  is_not_empty: "no vacío",
};

function conditionSummary(c: SegmentCondition, stages: any[]) {
  const field = c.field.startsWith("customFields.")
    ? c.field.replace("customFields.", "")
    : (FIELD_LABELS[c.field] ?? c.field);
  const op = OP_LABELS[c.operator] ?? c.operator;
  let value = "";
  if (c.operator !== "is_empty" && c.operator !== "is_not_empty") {
    if (c.field === "lifecycleStageId") {
      const stageObj = stages.find((s) => s.id === c.value);
      value = stageObj ? stageObj.name : String(c.value ?? "");
    } else if (c.field === "source")
      value =
        (SOURCE_LABELS as Record<string, string>)[c.value] ??
        String(c.value ?? "");
    else value = String(c.value ?? "");
  }
  return { field, op, value };
}

interface SegmentListPanelProps {
  segments: Segment[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (seg: Segment) => void;
  onDelete: (id: string) => void;
}

export const SegmentListPanel: React.FC<SegmentListPanelProps> = ({
  segments,
  isLoading,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { data: stages = [] } = useLifecycleStages();

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-slate-900/40 border border-slate-700/40 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/15 flex items-center justify-center">
            <Users size={13} className="text-indigo-400" />
          </div>
          <h3 className="text-sm font-black text-white tracking-tight">
            Segmentos
          </h3>
          {segments.length > 0 && (
            <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full">
              {segments.length}
            </span>
          )}
        </div>
        <button
          onClick={onCreate}
          className="h-7 w-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
          title="Crear segmento"
        >
          <Plus size={14} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-500" size={22} />
        </div>
      ) : segments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin segmentos"
          description="Aún no tienes segmentos inteligentes. Crea el primero."
          actionLabel="Nuevo segmento"
          onAction={onCreate}
        />
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[360px] lg:max-h-none -mx-1 px-1">
          {segments.map((seg) => {
            const active = selectedId === seg.id;
            const expanded = expandedIds.has(seg.id);
            const hasConditions = seg.conditions?.length > 0;
            return (
              <div key={seg.id} className="flex flex-col">
                <div
                  onClick={() => onSelect(seg.id)}
                  className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                    active
                      ? "bg-indigo-600/10 border-indigo-500/20 text-white"
                      : "border-transparent hover:bg-slate-900/50 text-slate-300 hover:text-white"
                  }`}
                >
                  {/* Chevron — toggles rule expansion */}
                  <button
                    onClick={(e) => toggleExpand(seg.id, e)}
                    className={`shrink-0 p-0.5 rounded transition-all ${
                      hasConditions
                        ? "opacity-100 hover:text-indigo-400"
                        : "opacity-0 pointer-events-none"
                    }`}
                    title={expanded ? "Ocultar reglas" : "Ver reglas"}
                  >
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        expanded
                          ? "rotate-0 text-indigo-400"
                          : "-rotate-90 text-slate-500 group-hover:text-slate-400"
                      }`}
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate leading-tight">
                      {seg.name}
                    </p>
                    {seg.description && (
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {seg.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          seg.type === "static"
                            ? "bg-slate-800 text-slate-400"
                            : "bg-indigo-500/20 text-indigo-400"
                        }`}
                      >
                        {seg.type === "static" ? "Estático" : "Dinámico"}
                      </span>
                      {hasConditions && !expanded && (
                        <div className="flex items-center gap-1">
                          <Filter size={9} className="text-slate-600" />
                          <span className="text-[9px] text-slate-600 font-medium">
                            {seg.conditions.length} regla
                            {seg.conditions.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(seg);
                      }}
                      className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/8 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={11} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(seg.id);
                      }}
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Expanded rules — tree view */}
                {expanded && hasConditions && (
                  <div className="mx-3 mb-2 px-3 py-1.5 rounded-lg border border-slate-700/30 bg-slate-950/30">
                    {seg.conditions.map((c, i) => {
                      const { field, op, value } = conditionSummary(c, stages);
                      const isFirst = i === 0;
                      const isLast = i === seg.conditions.length - 1;
                      const multiNode = seg.conditions.length > 1;
                      return (
                        <div
                          key={i}
                          className="relative flex items-center gap-1.5 text-[10px] py-[5px] pl-7"
                        >
                          {/* Vertical tree line */}
                          {multiNode && (
                            <div
                              className="absolute left-[7px] w-px bg-slate-700/50"
                              style={{
                                top: isFirst ? "50%" : 0,
                                bottom: isLast ? "50%" : 0,
                              }}
                            />
                          )}
                          {/* Horizontal branch */}
                          <div className="absolute left-[7px] top-1/2 w-[14px] h-px bg-slate-700/50" />
                          {/* Node dot */}
                          <div
                            className={`absolute left-[18px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${
                              isLast
                                ? "bg-indigo-500/60 ring-1 ring-indigo-500/20"
                                : "bg-slate-600"
                            }`}
                          />
                          <span className="text-slate-300 font-semibold">
                            {field}
                          </span>
                          <span className="text-slate-600 text-[9px]">
                            {op}
                          </span>
                          {value && (
                            <span className="text-indigo-300 font-bold truncate max-w-[72px]">
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
