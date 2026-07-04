import { Plan } from '@features/auth/types/plan';

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

export type UserRole = string;
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Team {
  id: string;
  name: string;
  color: string;
  businessId?: string;
  createdAt?: string;
  description?: string | null;
  members?: User[];
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
  businessId?: string;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  bio?: string | null;
  isAccountActivated?: boolean;
  isActive?: boolean;
  status?: UserStatus;
  activatedAt?: string | null;
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
  phone?: string;
  bio?: string;
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
