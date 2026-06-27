export interface LifecycleStage {
  color: string;
  description: string | null;
  icon?: string;
  id: string;
  name: string;
  type?: "active" | "lost";
}
