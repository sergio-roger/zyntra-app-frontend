export enum BillingCycle {
  MONTHLY = 'monthly',
  ONE_TIME = 'one-time',
  YEARLY = 'yearly',
}

export interface PlanDescription {
  id: string;
  is_included: boolean;
  order: number;
  plan_id: string;
  text: string;
}

export interface Plan {
  aiAgentLimit: number;
  billingCycle: BillingCycle;
  channelLimit: number;
  chatbotLimit: number;
  contactLimit: number;
  descriptions?: PlanDescription[];
  funnelLimit: number;
  id: string;
  isPopular: boolean;
  name: string;
  price: string | number;
  stripePriceId?: string;
  taskLimit: number;
  userLimit: number;
}
