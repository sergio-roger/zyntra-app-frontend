import { StageType } from "@crm/types/pipeline-settings";

export const PIPELINE_STAGE_COLORS = [
  "#4f46e5", // indigo
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
] as const;

export const STAGE_TYPE_LABELS: Record<StageType, string> = {
  active: "Activa",
  won: "Ganado",
  lost: "Perdido",
};
