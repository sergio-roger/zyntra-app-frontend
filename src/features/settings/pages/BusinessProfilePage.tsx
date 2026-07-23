import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { MultiSelectChips } from '@core/ui/MultiSelectChips';
import { Select } from '@core/ui/Select';
import { TagInput } from '@core/ui/TagInput';
import { Tabs, TabItem } from '@core/ui/Tabs';
import { Textarea } from '@core/ui/Textarea';
import { useIndustrys } from '@crm/hooks/useCompanies';
import { useChannelsQuery } from '@features/channels/hooks/channels.queries';
import {
  BRAND_TONE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  BUSINESS_MODEL_OPTIONS,
  GEOGRAPHIC_SCOPE_OPTIONS,
  MAX_ACTIVE_CHANNELS,
  MAX_COMPETITOR_LENGTH,
  MAX_COMPETITORS,
  PRIMARY_GOAL_OPTIONS,
  TEAM_SIZE_MAX,
  TEAM_SIZE_MIN,
} from '@features/settings/constants/business-profile.constants';
import {
  useBusinessProfileQuery,
  useUpdateBusinessProfile,
} from '@features/settings/hooks/useBusinessProfile';
import {
  BusinessProfileFormValues,
  businessProfileSchema,
} from '@features/settings/schemas/business-profile.schema';
import { UpdateBusinessProfileInput } from '@features/settings/types/business-profile.types';
import { PageHeader } from '@shared/components/PageHeader';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Briefcase,
  Building2,
  Globe2,
  Loader2,
  MapPin,
  Megaphone,
  Palette,
  Save,
  Sparkles,
  Swords,
  Target,
  Users,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';
import { Controller, Control, FieldErrors, useForm } from 'react-hook-form';

type ProfileTab = 'general' | 'audience' | 'brand' | 'goals';

const TABS: TabItem<ProfileTab>[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'audience', label: 'Audiencia', icon: Users },
  { key: 'brand', label: 'Marca', icon: Palette },
  { key: 'goals', label: 'Objetivos', icon: Target },
];

const buildDefaultValues = (
  profile: ReturnType<typeof useBusinessProfileQuery>['data'],
): BusinessProfileFormValues => ({
  industryId: profile?.industryId ?? null,
  nicheDetail: profile?.nicheDetail ?? '',
  valueProposition: profile?.valueProposition ?? '',
  mission: profile?.mission ?? '',
  competitors: profile?.competitors ?? [],
  targetAudience: profile?.targetAudience ?? '',
  audienceAgeRange: profile?.audienceAgeRange ?? '',
  businessModel: profile?.businessModel ?? 'b2c',
  geographicScope: profile?.geographicScope ?? 'local',
  country: profile?.country ?? '',
  city: profile?.city ?? '',
  tone: profile?.tone ?? 'friendly',
  brandVoiceNotes: profile?.brandVoiceNotes ?? '',
  locale: profile?.locale ?? 'es',
  brandColors: {
    primary: profile?.brandColors?.primary ?? '',
    secondary: profile?.brandColors?.secondary ?? '',
    accent: profile?.brandColors?.accent ?? '',
  },
  primaryGoal: profile?.primaryGoal ?? 'leads',
  monthlyBudgetRange: profile?.monthlyBudgetRange ?? null,
  activeChannels: profile?.activeChannels ?? [],
  teamSize: profile?.teamSize ?? null,
});

export const BusinessProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useBusinessProfileQuery();
  const { data: industries } = useIndustrys();
  const { data: channels } = useChannelsQuery();
  const updateProfile = useUpdateBusinessProfile();
  const [activeTab, setActiveTab] = useState<ProfileTab>('general');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    values: buildDefaultValues(profile),
  });

  const onSubmit = async (data: BusinessProfileFormValues) => {
    const changedKeys = Object.keys(
      dirtyFields,
    ) as Array<keyof BusinessProfileFormValues>;
    if (changedKeys.length === 0) return;

    const payload: UpdateBusinessProfileInput = {};
    changedKeys.forEach((key) => {
      (payload as Record<string, unknown>)[key] = data[key];
    });

    await updateProfile.mutateAsync(payload);
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  const industryOptions = (industries ?? []).map((i) => ({
    value: i.id,
    label: i.name,
  }));
  const channelOptions = buildChannelOptions(channels);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Configuración"
        subtitle="Contexto de marca y negocio usado para personalizar tus agentes de IA."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl"
      >
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} compact className="px-6" />

        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralFields
              control={control}
              register={register}
              errors={errors}
              industryOptions={industryOptions}
            />
          )}
          {activeTab === 'audience' && (
            <AudienceFields control={control} register={register} errors={errors} />
          )}
          {activeTab === 'brand' && (
            <BrandFields control={control} register={register} errors={errors} />
          )}
          {activeTab === 'goals' && (
            <GoalsFields
              control={control}
              register={register}
              errors={errors}
              channelOptions={channelOptions}
            />
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-white/5">
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={updateProfile.isPending}
            icon={Save}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

const buildChannelOptions = (
  channels: ReturnType<typeof useChannelsQuery>['data'],
): { value: string; label: string }[] => {
  const seen = new Map<string, string>();
  (channels ?? []).forEach((channel) => {
    seen.set(channel.channelType.key, channel.channelType.label);
  });
  return Array.from(seen, ([value, label]) => ({ value, label }));
};

interface SectionProps {
  control: Control<BusinessProfileFormValues>;
  register: ReturnType<typeof useForm<BusinessProfileFormValues>>['register'];
  errors: FieldErrors<BusinessProfileFormValues>;
}

const GeneralFields: React.FC<
  SectionProps & { industryOptions: { value: string; label: string }[] }
> = ({ control, register, errors, industryOptions }) => (
  <div className="space-y-4">
    <Controller
      control={control}
      name="industryId"
      render={({ field }) => (
        <Select
          label="Industria"
          icon={Briefcase}
          options={industryOptions}
          value={field.value}
          onChange={field.onChange}
          searchable
          searchPlaceholder="Buscar industria..."
          clearable
          clearLabel="Sin industria"
        />
      )}
    />
    <Input
      label="Detalle del nicho"
      icon={Sparkles}
      hint="Un matiz más específico que la industria general."
      error={errors.nicheDetail?.message}
      {...register('nicheDetail')}
    />
    <Textarea
      label="Propuesta de valor"
      rows={3}
      hint="Qué te hace diferente frente a la competencia."
      error={errors.valueProposition?.message}
      {...register('valueProposition')}
    />
    <Textarea
      label="Misión"
      rows={2}
      error={errors.mission?.message}
      {...register('mission')}
    />
    <Controller
      control={control}
      name="competitors"
      render={({ field }) => (
        <TagInput
          label="Competidores"
          icon={Swords}
          hint="Hasta 10 competidores."
          value={field.value}
          onChange={field.onChange}
          maxItems={MAX_COMPETITORS}
          maxItemLength={MAX_COMPETITOR_LENGTH}
          placeholder="Ej. Acme Inc."
        />
      )}
    />
  </div>
);

const AudienceFields: React.FC<SectionProps> = ({ control, register, errors }) => (
  <div className="space-y-4">
    <Textarea
      label="Audiencia objetivo"
      rows={3}
      error={errors.targetAudience?.message}
      {...register('targetAudience')}
    />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input
        label="Rango de edad de la audiencia"
        placeholder="Ej. 25-34"
        error={errors.audienceAgeRange?.message}
        {...register('audienceAgeRange')}
      />
      <Controller
        control={control}
        name="businessModel"
        render={({ field }) => (
          <Select
            label="Modelo de negocio"
            options={[...BUSINESS_MODEL_OPTIONS]}
            value={field.value}
            onChange={(v) => field.onChange(v ?? 'b2c')}
          />
        )}
      />
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Controller
        control={control}
        name="geographicScope"
        render={({ field }) => (
          <Select
            label="Alcance geográfico"
            icon={Globe2}
            options={[...GEOGRAPHIC_SCOPE_OPTIONS]}
            value={field.value}
            onChange={(v) => field.onChange(v ?? 'local')}
          />
        )}
      />
      <Input
        label="País"
        icon={MapPin}
        error={errors.country?.message}
        {...register('country')}
      />
      <Input label="Ciudad" error={errors.city?.message} {...register('city')} />
    </div>
  </div>
);

const BrandFields: React.FC<SectionProps> = ({ control, register, errors }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Controller
        control={control}
        name="tone"
        render={({ field }) => (
          <Select
            label="Tono de marca"
            icon={Megaphone}
            options={[...BRAND_TONE_OPTIONS]}
            value={field.value}
            onChange={(v) => field.onChange(v ?? 'friendly')}
          />
        )}
      />
      <Input
        label="Idioma / locale"
        placeholder="es"
        error={errors.locale?.message}
        {...register('locale')}
      />
    </div>
    <Textarea
      label="Notas de voz de marca"
      rows={3}
      hint="Detalles de estilo que un agente de IA debería seguir al escribir."
      error={errors.brandVoiceNotes?.message}
      {...register('brandVoiceNotes')}
    />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Input
        label="Color primario"
        placeholder="#6366f1"
        error={errors.brandColors?.primary?.message}
        {...register('brandColors.primary')}
      />
      <Input
        label="Color secundario"
        placeholder="#7c3aed"
        error={errors.brandColors?.secondary?.message}
        {...register('brandColors.secondary')}
      />
      <Input
        label="Color de acento"
        placeholder="#b95f00"
        error={errors.brandColors?.accent?.message}
        {...register('brandColors.accent')}
      />
    </div>
  </div>
);

const GoalsFields: React.FC<
  SectionProps & { channelOptions: { value: string; label: string }[] }
> = ({ control, channelOptions }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Controller
        control={control}
        name="primaryGoal"
        render={({ field }) => (
          <Select
            label="Objetivo principal"
            icon={Target}
            options={[...PRIMARY_GOAL_OPTIONS]}
            value={field.value}
            onChange={(v) => field.onChange(v ?? 'leads')}
          />
        )}
      />
      <Controller
        control={control}
        name="monthlyBudgetRange"
        render={({ field }) => (
          <Select
            label="Presupuesto mensual"
            icon={Wallet}
            options={[...BUDGET_RANGE_OPTIONS]}
            value={field.value}
            onChange={field.onChange}
            clearable
            clearLabel="Sin definir"
          />
        )}
      />
    </div>
    <Controller
      control={control}
      name="activeChannels"
      render={({ field }) =>
        channelOptions.length === 0 ? (
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Canales activos
            </label>
            <p className="text-xs text-slate-500 ml-1">
              Aún no configuraste ningún canal. Creá uno desde Canales para
              poder marcarlo acá.
            </p>
          </div>
        ) : (
          <MultiSelectChips
            label="Canales activos"
            options={channelOptions}
            value={field.value}
            onChange={field.onChange}
            maxItems={MAX_ACTIVE_CHANNELS}
          />
        )
      }
    />
    <Controller
      control={control}
      name="teamSize"
      render={({ field }) => (
        <Input
          label="Tamaño del equipo"
          type="number"
          min={TEAM_SIZE_MIN}
          max={TEAM_SIZE_MAX}
          value={field.value ?? ''}
          onChange={(e) =>
            field.onChange(e.target.value === '' ? null : Number(e.target.value))
          }
        />
      )}
    />
  </div>
);
