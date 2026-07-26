import { CompetitorDetailKpiRow } from '@features/youtube-analytics/components/CompetitorDetailKpiRow';
import { CompetitorVideoTable } from '@features/youtube-analytics/components/CompetitorVideoTable';
import {
  useCompetitorsDashboard,
  useCompetitorVideos,
} from '@features/youtube-analytics/hooks/useCompetitors';
import { buildChannelUrl } from '@features/youtube-analytics/utils/build-channel-url.util';
import { formatCompetitorHandle } from '@features/youtube-analytics/utils/format-competitor-handle.util';
import { Button } from '@core/ui/Button';
import { PageHeader } from '@shared/components/PageHeader';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const CompetitorDetailPage: React.FC = () => {
  const { competitorId } = useParams<{ competitorId: string }>();
  const navigate = useNavigate();
  const { data: dashboard } = useCompetitorsDashboard();
  const { data: videos = [], isLoading } = useCompetitorVideos(competitorId ?? '');

  const competitor = dashboard?.competitors.find((c) => c.id === competitorId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title={
          competitor ? (
            <a
              href={buildChannelUrl(competitor.channelHandleOrUrl)}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary hover:underline"
            >
              {formatCompetitorHandle(competitor.channelHandleOrUrl)}
            </a>
          ) : (
            'Competidor'
          )
        }
        subtitle="Todos los videos monitoreados"
        actions={
          <Button
            variant="secondary"
            outline
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/redes-sociales/youtube')}
          >
            Volver a Competencia
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : videos.length === 0 ? (
        <p className="text-sm text-base-content/60">
          Todavía no hay videos monitoreados para este competidor.
        </p>
      ) : (
        <>
          <CompetitorDetailKpiRow videos={videos} />
          <CompetitorVideoTable videos={videos} />
        </>
      )}
    </div>
  );
};
