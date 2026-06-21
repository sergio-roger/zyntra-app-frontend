export type UserRole = 'admin' | 'manager' | 'agent';

export interface CrmUser {
  id: string;
  business_id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  teams: Team[];
  created_at: string;
}

export interface Team {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  color: string;
  members: CrmUser[];
  created_at: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  color?: string;
  member_ids?: string[];
}

export interface Menu {
  id: string;
  key: string;
  label: string;
  path: string;
  parent_key: string | null;
  description: string | null;
}

export interface RolePermissions {
  role: string;
  menu_ids: string[];
}

export const SYSTEM_ROLES = [
  { key: 'admin',   label: 'Administrador', description: 'Acceso total a la plataforma' },
  { key: 'manager', label: 'Gerente',       description: 'Gestión de CRM y equipos' },
  { key: 'agent',   label: 'Agente',        description: 'Operación diaria' },
] as const;

export type SystemRole = typeof SYSTEM_ROLES[number]['key'];
