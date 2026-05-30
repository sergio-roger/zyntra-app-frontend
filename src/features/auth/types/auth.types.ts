import { Plan } from './plan';

export type User = {
  id: string;
  name: string;
  email: string;
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
