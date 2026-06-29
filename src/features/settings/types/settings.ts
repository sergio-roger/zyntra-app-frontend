export type UserRole = string;
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  avatarUrl?: string | null;
  businessId: string;
  createdAt: string;
  email: string;
  firstName?: string;
  id: string;
  isAccountActivated?: boolean;
  isActive: boolean;
  jobTitle?: string | null;
  lastName?: string;
  name: string;
  role: UserRole;
  status?: UserStatus;
  teams: Team[];
}

export interface Team {
  businessId: string;
  color: string;
  createdAt: string;
  description: string | null;
  id: string;
  members: User[];
  name: string;
}

export interface CreateUserInput {
  avatarUrl?: string;
  email: string;
  firstName?: string;
  isAccountActivated?: boolean;
  isActive?: boolean;
  jobTitle?: string;
  lastName?: string;
  name?: string;
  role: UserRole;
  status?: UserStatus;
}

export interface CreateTeamInput {
  color?: string;
  description?: string;
  memberIds?: string[];
  name: string;
}

export interface Menu {
  description: string | null;
  id: string;
  key: string;
  label: string;
  parentKey: string | null;
  path: string;
}

export interface Role {
  badge: string | null;
  badgeColor: string | null;
  description: string;
  iconColor: string | null;
  id: string;
  isEditable: boolean;
  label: string;
  name: string;
}

export interface RolePermissions {
  menuIds: string[];
  role: string;
}
