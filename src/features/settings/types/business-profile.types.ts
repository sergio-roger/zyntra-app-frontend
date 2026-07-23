export type BusinessModel = 'b2b' | 'b2c' | 'b2b2c';

export type GeographicScope = 'local' | 'national' | 'international';

export type BrandTone =
  | 'friendly'
  | 'professional'
  | 'playful'
  | 'formal'
  | 'bold'
  | 'luxury'
  | 'minimalist';

export type PrimaryGoal =
  | 'leads'
  | 'sales'
  | 'awareness'
  | 'retention'
  | 'support';

export type BudgetRange =
  | 'under_500'
  | 'from_500_to_1000'
  | 'from_1000_to_5000'
  | 'from_5000_to_10000'
  | 'over_10000';

export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

export interface BusinessProfile {
  id: string;
  businessId: string;
  industryId: string | null;
  nicheDetail: string;
  valueProposition: string;
  mission: string | null;
  competitors: string[];
  targetAudience: string;
  audienceAgeRange: string | null;
  businessModel: BusinessModel;
  geographicScope: GeographicScope;
  country: string | null;
  city: string | null;
  tone: BrandTone;
  brandVoiceNotes: string | null;
  locale: string;
  brandColors: BrandColors | null;
  primaryGoal: PrimaryGoal;
  monthlyBudgetRange: BudgetRange | null;
  activeChannels: string[];
  teamSize: number | null;
}

export interface UpdateBusinessProfileInput {
  industryId?: string;
  nicheDetail?: string;
  valueProposition?: string;
  mission?: string;
  competitors?: string[];
  targetAudience?: string;
  audienceAgeRange?: string;
  businessModel?: BusinessModel;
  geographicScope?: GeographicScope;
  country?: string;
  city?: string;
  tone?: BrandTone;
  brandVoiceNotes?: string;
  locale?: string;
  brandColors?: BrandColors;
  primaryGoal?: PrimaryGoal;
  monthlyBudgetRange?: BudgetRange;
  activeChannels?: string[];
  teamSize?: number;
}
