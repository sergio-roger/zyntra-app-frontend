export type {
  User,
  UserRole,
  UserStatus,
  Team,
} from '@features/auth/types/auth.types';

export interface CreateUserInput {
  avatarUrl?: string;
  email: string;
  firstName?: string;
  isAccountActivated?: boolean;
  isActive?: boolean;
  jobTitle?: string;
  lastName?: string;
  name?: string;
  role: string;
  status?: 'active' | 'inactive' | 'suspended';
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

export interface Company {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  website: string | null;
  logoUrl: string | null;
}

export interface UpdateCompanyInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_id?: string;
  website?: string;
}
