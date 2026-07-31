import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useCreateContentPlan } from '@features/content-planning/hooks/use-create-content-plan';
import { ContentPlan, ContentPlanPlatformConfig } from '@features/content-planning/interfaces/content-plan.interface';
import { PlatformConfigSelector } from '@features/content-planning/components/PlatformConfigSelector';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Button } from '@core/ui/Button';

interface CreatePlanWizardProps {
  onCreated: (plan: ContentPlan) => void;
  projectId?: string;
}

export const CreatePlanWizard: React.FC<CreatePlanWizardProps> = ({ onCreated, projectId }) => {
  const [name, setName] = useState('');
  const [brief, setBrief] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [platformConfigs, setPlatformConfigs] = useState<ContentPlanPlatformConfig[]>([]);
  const createPlan = useCreateContentPlan();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const plan = await createPlan.mutateAsync({
      name,
      periodType: 'custom',
      startDate,
      endDate,
      brief,
      platformConfigs,
      projectId,
    });
    onCreated(plan);
  };

  return (
    <CardWrapper hoverable={false} className="p-5">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          aria-label="Nombre del plan"
          label="Nombre del plan"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          aria-label="Brief"
          label="Brief"
          rows={3}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            aria-label="Desde"
            label="Desde"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            aria-label="Hasta"
            label="Hasta"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            Plataformas
          </span>
          <PlatformConfigSelector configs={platformConfigs} onChange={setPlatformConfigs} />
        </div>

        <Button type="submit" variant="primary" icon={Sparkles} loading={createPlan.isPending}>
          Crear plan
        </Button>
      </form>
    </CardWrapper>
  );
};

export default CreatePlanWizard;
