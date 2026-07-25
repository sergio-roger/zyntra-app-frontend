export type ChatAgentWorkStatus = 'active' | 'working' | 'idle';

export type ChatPanelTab = 'process' | 'tools' | 'tasks' | 'files';

export interface ChatAgentRosterItem {
  slug: string;
  displayName: string;
  role: string;
  status: ChatAgentWorkStatus;
  color: string;
}

export interface ActionPlanStep {
  order: number;
  label: string;
  ownerDisplayName: string;
  isCurrent: boolean;
}

export type DeliverableStatus = 'in_progress' | 'completed' | 'pending';

export interface Deliverable {
  label: string;
  status: DeliverableStatus;
}

export interface MetricItem {
  label: string;
  value: string;
  target: string | null;
}

export interface ChatMessage {
  id: string;
  authorDisplayName: string;
  isFromUser: boolean;
  time: string;
  text: string;
  actionPlan?: { steps: ActionPlanStep[] };
  deliverables?: Deliverable[];
  metrics?: MetricItem[];
}

export type ProcessEventStatus = 'completed' | 'in_progress' | 'pending';

export interface ProcessTimelineEvent {
  id: string;
  time: string;
  actorDisplayName: string;
  actorRole: string | null;
  description: string;
  status: ProcessEventStatus;
  tools?: string[];
}

export interface ToolMockItem {
  name: string;
  ownerDisplayName: string;
  usageCount: number;
}

export interface TaskMockItem {
  label: string;
  ownerDisplayName: string;
  status: ProcessEventStatus;
}

export interface FileMockItem {
  name: string;
  ownerDisplayName: string;
  sizeLabel: string;
}
