export enum BillingCycle {
  ONE_TIME = 'one-time',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface PlanDescription {
  id: string;
  plan_id: string;
  text: string;
  is_included: boolean;
  order: number;
}

export interface Plan {
  id: string;
  name: string;
  price: string | number;
  billing_cycle: BillingCycle;
  is_popular: boolean;
  contact_limit: number;
  task_limit: number;
  stripe_price_id?: string;
  descriptions?: PlanDescription[];
}
