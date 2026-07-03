export enum BillingCycle {
  MONTHLY = "monthly",
  ONE_TIME = "one-time",
  YEARLY = "yearly",
}

export interface PlanDescription {
  id: string;
  is_included: boolean;
  order: number;
  plan_id: string;
  text: string;
}

export interface Plan {
  ai_agent_limit: number;
  billing_cycle: BillingCycle;
  channel_limit: number;
  chatbot_limit: number;
  contact_limit: number;
  descriptions?: PlanDescription[];
  funnel_limit: number;
  id: string;
  is_popular: boolean;
  name: string;
  price: string | number;
  stripe_price_id?: string;
  task_limit: number;
  user_limit: number;
}
