import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '@shared/components/PageHeader';
import { CardWrapper } from '@shared/components/CardWrapper';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Button } from '@core/ui/Button';
import { ProjectCoverUploader } from '@features/marketing-projects/components/ProjectCoverUploader';
import { ProjectTeamPicker, TeamOption } from '@features/marketing-projects/components/ProjectTeamPicker';
import { useCreateMarketingProject } from '@features/marketing-projects/hooks/use-create-marketing-project';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { useAuthStore } from '@features/auth/store/authStore';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';

export const CreateMarketingProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const businessId = useAuthStore((s) => s.user?.businessId);
  const createProject = useCreateMarketingProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MarketingProjectType>(MarketingProjectType.GENERAL);
  const [kpiName, setKpiName] = useState('');
  const [kpiTargetValue, setKpiTargetValue] = useState('');
  const [roiPercent, setRoiPercent] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPrompt, setCoverPrompt] = useState('');
  const [team, setTeam] = useState<TeamOption[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const project = await createProject.mutateAsync({
      name,
      description: description || undefined,
      type,
      kpiName: kpiName || undefined,
      kpiTargetValue: kpiTargetValue ? Number(kpiTargetValue) : undefined,
      roiPercent: roiPercent ? Number(roiPercent) : undefined,
    });

    await Promise.all([
      coverFile ? marketingProjectsApi.uploadCover(businessId!, project.id, coverFile) : Promise.resolve(),
      coverPrompt ? marketingProjectsApi.generateCover(businessId!, project.id, coverPrompt) : Promise.resolve(),
      team.length
        ? marketingProjectsApi.updateMembers(
            businessId!,
            project.id,
            team.map(({ memberType, memberId }) => ({ memberType, memberId })),
          )
        : Promise.resolve(),
    ]);

    navigate(`/agents/projects/${project.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader title="Nuevo Proyecto" subtitle="Definí el proyecto que vas a gestionar con IA" />

      <CardWrapper hoverable={false} className="p-5">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input aria-label="Nombre" label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            aria-label="Descripción"
            label="Descripción"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-2">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Tipo de proyecto
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="primary"
                outline={type !== MarketingProjectType.GENERAL}
                size="sm"
                onClick={() => setType(MarketingProjectType.GENERAL)}
              >
                General
              </Button>
              <Button
                type="button"
                variant="primary"
                outline={type !== MarketingProjectType.CONTENT_PLAN}
                size="sm"
                onClick={() => setType(MarketingProjectType.CONTENT_PLAN)}
              >
                Plan de Contenido
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input aria-label="KPI principal" label="KPI principal" value={kpiName} onChange={(e) => setKpiName(e.target.value)} />
            <Input
              aria-label="Meta del KPI"
              label="Meta del KPI"
              type="number"
              value={kpiTargetValue}
              onChange={(e) => setKpiTargetValue(e.target.value)}
            />
            <Input
              aria-label="ROI (%)"
              label="ROI (%)"
              type="number"
              value={roiPercent}
              onChange={(e) => setRoiPercent(e.target.value)}
            />
          </div>

          <ProjectCoverUploader
            file={coverFile}
            onFileSelected={setCoverFile}
            aiPrompt={coverPrompt}
            onAiPromptChange={setCoverPrompt}
          />

          <ProjectTeamPicker value={team} onChange={setTeam} />

          <Button type="submit" variant="primary" icon={Sparkles} loading={createProject.isPending}>
            Crear proyecto
          </Button>
        </form>
      </CardWrapper>
    </div>
  );
};

export default CreateMarketingProjectPage;
