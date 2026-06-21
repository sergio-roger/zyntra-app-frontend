import { Plan } from './plan';

export type ModuleAccessLevel = 'full' | 'read_only' | 'locked';

export interface MenuNode {
  id: string;
  key: string;
  label: string;
  path: string;
  parent_key: string | null;
  description: string | null;
  access_level?: ModuleAccessLevel;
  children: MenuNode[];
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'superAdmin' | null;
  plan: Plan;
  plan_status: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type ApiError = {
  code: string;
  description: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  data: null;
  errors: ApiError[];
};
