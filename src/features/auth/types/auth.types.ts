import { Plan } from "@features/auth/types/plan";

export type ModuleAccessLevel = "full" | "read_only" | "locked";

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

export type UserRole = string;
export type UserStatus = "active" | "inactive" | "suspended";

export interface Team {
  businessId: string;
  color: string;
  createdAt: string;
  description: string | null;
  id: string;
  members: User[];
  name: string;
}

export type User = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole | null;
  plan: Plan;
  plan_status: string;
  crm_user_id?: string | null;
  businessId?: string;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  isAccountActivated?: boolean;
  isActive?: boolean;
  status?: UserStatus;
  createdAt?: string;
  teams?: Team[];
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

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
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
