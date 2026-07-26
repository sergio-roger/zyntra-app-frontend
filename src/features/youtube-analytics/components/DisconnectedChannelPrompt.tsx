import { Button } from '@core/ui/Button';
import { MultiSelectChips } from '@core/ui/MultiSelectChips';
import {
  useSaveVideoInterestSelection,
  useVideoInterests,
} from '@features/youtube-analytics/hooks/useVideoInterests';
import { buildYoutubeOAuthConnectUrl } from '@features/youtube-analytics/hooks/useOwnChannel';
import { Video } from 'lucide-react';
import React, { useState } from 'react';

const MIN_SELECTED_INTERESTS = 3;

export const DisconnectedChannelPrompt: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: interests = [] } = useVideoInterests();
  const saveSelection = useSaveVideoInterestSelection();
  const canConnect = selectedIds.length >= MIN_SELECTED_INTERESTS;

  const handleConnect = async () => {
    await saveSelection.mutateAsync(selectedIds);
    window.location.href = buildYoutubeOAuthConnectUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-tertiary/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-base-200 border border-base-300 shadow-lg">
          <Video size={40} className="text-tertiary" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-base-content mb-2 tracking-tight">
        Conectá tu canal de YouTube
      </h3>
      <p className="max-w-sm text-sm text-base-content/60 leading-relaxed mb-6">
        Iniciá sesión con Google para empezar a ver la analítica de tu canal propio.
      </p>

      <MultiSelectChips
        label={`Elegí tus intereses (mínimo ${MIN_SELECTED_INTERESTS})`}
        options={interests.map((interest) => ({
          value: interest.id,
          label: interest.name,
        }))}
        value={selectedIds}
        onChange={setSelectedIds}
        maxItems={interests.length}
        containerClassName="max-w-md mb-8"
      />

      <Button
        variant="primary"
        disabled={!canConnect}
        loading={saveSelection.isPending}
        onClick={handleConnect}
      >
        Conectar con Google
      </Button>
    </div>
  );
};
