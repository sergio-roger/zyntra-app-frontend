import React from 'react';
import { Users } from 'lucide-react';
import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { AsyncSelectMultiple } from '@core/ui/AsyncSelectMultiple';
import { useAuthStore } from '@features/auth/store/authStore';
import { MarketingProjectMemberType } from '@features/marketing-projects/enums/marketing-project-member-type.enum';

export interface TeamOption {
  memberType: MarketingProjectMemberType;
  memberId: string;
  name: string;
}

interface UserRecord {
  id: string;
  name: string;
}

interface ImportedAgentRecord {
  systemAgent: { id: string; name: string };
}

interface ProjectTeamPickerProps {
  value: TeamOption[];
  onChange: (value: TeamOption[]) => void;
}

export const ProjectTeamPicker: React.FC<ProjectTeamPickerProps> = ({ value, onChange }) => {
  const businessId = useAuthStore((s) => s.user?.businessId);

  const loadOptions = async ({ search }: { search: string; page: number; limit: number }) => {
    const [users, agents] = await Promise.all([
      api.get<unknown, ApiResponse<UserRecord[]>>('/settings/users').then(unwrap),
      api
        .get<unknown, ApiResponse<ImportedAgentRecord[]>>(`/businesses/${businessId}/system-agents`)
        .then(unwrap),
    ]);

    const options: TeamOption[] = [
      ...users.map((u) => ({ memberType: MarketingProjectMemberType.USER, memberId: u.id, name: u.name })),
      ...agents.map((a) => ({
        memberType: MarketingProjectMemberType.AGENT,
        memberId: a.systemAgent.id,
        name: a.systemAgent.name,
      })),
    ].filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

    return { items: options, total: options.length, hasMore: false };
  };

  return (
    <AsyncSelectMultiple<TeamOption>
      label="Equipo"
      icon={Users}
      loadOptions={loadOptions}
      getKey={(item) => `${item.memberType}:${item.memberId}`}
      getLabel={(item) => item.name}
      getDescription={(item) => (item.memberType === MarketingProjectMemberType.AGENT ? 'Agente de IA' : 'Persona')}
      value={value}
      onChange={onChange}
    />
  );
};

export default ProjectTeamPicker;
