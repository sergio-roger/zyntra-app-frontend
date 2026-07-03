import { KanbanColumn } from './kanban-column';
import { DealPipeline } from './deal-pipeline';

export interface KanbanResponse {
  columns: KanbanColumn[];
  pipeline: DealPipeline;
}
