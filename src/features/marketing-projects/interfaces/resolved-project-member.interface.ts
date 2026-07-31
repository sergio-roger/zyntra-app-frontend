import { MarketingProjectMemberType } from '@features/marketing-projects/enums/marketing-project-member-type.enum';

export interface ResolvedProjectMember {
  id: string;
  memberType: MarketingProjectMemberType;
  name: string;
  avatarUrl: string | null;
}
