import { Tabs } from '@core/ui/Tabs';
import { CompetitorsSection } from '@features/youtube-analytics/components/CompetitorsSection';
import { YoutubeChannelTab } from '@features/youtube-analytics/components/YoutubeChannelTab';
import { YoutubeComparisonDashboard } from '@features/youtube-analytics/components/YoutubeComparisonDashboard';
import { BarChart3, Radar, Video } from 'lucide-react';
import React, { useState } from 'react';

type ConnectedTabKey = 'canal' | 'competencia' | 'dashboard';

export const YoutubeConnectedTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConnectedTabKey>('canal');

  return (
    <div className="space-y-6">
      <Tabs
        tabs={[
          { key: 'canal', label: 'Canal', icon: Video },
          { key: 'competencia', label: 'Competencia', icon: Radar },
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        compact
      />

      {activeTab === 'canal' && <YoutubeChannelTab />}
      {activeTab === 'competencia' && <CompetitorsSection />}
      {activeTab === 'dashboard' && <YoutubeComparisonDashboard />}
    </div>
  );
};
