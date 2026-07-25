import { useAuthStore } from '@features/auth/store/authStore';
import { AddCompetitorModal } from '@features/youtube-analytics/components/AddCompetitorModal';
import { CompetitorCard } from '@features/youtube-analytics/components/CompetitorCard';
import { useCompetitorsDashboard } from '@features/youtube-analytics/hooks/useCompetitors';
import { Button } from '@core/ui/Button';
import { EmptyState } from '@shared/components/EmptyState';
import { Loader2, Radar, Plus } from 'lucide-react';
import React, { useState } from 'react';

export const CompetitorsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = useCompetitorsDashboard();
  const currentUser = useAuthStore((s) => s.user);

  const competitorLimit = currentUser?.plan?.youtubeCompetitorLimit ?? 0;

  const competitors = data?.competitors ?? [];
  const isLimitReached = competitors.length >= competitorLimit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>No se pudo cargar la competencia. Intenta de nuevo.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-base-content">Competencia</h2>
        <Button
          icon={Plus}
          size="sm"
          onClick={() => setIsModalOpen(true)}
          disabled={isLimitReached}
        >
          {competitors.length === 0 ? 'Agregar canal' : 'Agregar otro'}
        </Button>
      </div>

      {isLimitReached && (
        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-content">
          Alcanzaste el límite de {competitorLimit} canales de competencia de tu
          plan actual.
        </div>
      )}

      {competitors.length === 0 ? (
        <EmptyState
          icon={Radar}
          title="Todavía no monitoreás competencia"
          description={
            isLimitReached
              ? 'Tu plan actual no incluye canales de competencia.'
              : 'Agregá canales de YouTube de tu competencia para comparar su rendimiento con el tuyo.'
          }
          actionLabel={isLimitReached ? undefined : 'Agregar canal'}
          onAction={isLimitReached ? undefined : () => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((competitor) => (
            <CompetitorCard
              key={competitor.id}
              competitor={competitor}
              videos={(data?.competitorVideoStats ?? []).filter(
                (video) => video.competitorChannelId === competitor.id,
              )}
            />
          ))}
        </div>
      )}

      <AddCompetitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
