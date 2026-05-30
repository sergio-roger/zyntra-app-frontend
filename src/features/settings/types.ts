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
