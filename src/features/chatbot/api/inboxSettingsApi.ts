import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';

export interface InboxSoundSetting {
  enabled: boolean;
}

export const inboxSettingsApi = {
  getInboxSound: (): Promise<InboxSoundSetting> =>
    api
      .get<unknown, ApiResponse<InboxSoundSetting>>('/chat/settings/inbox-sound')
      .then(unwrap),

  setInboxSound: (enabled: boolean): Promise<InboxSoundSetting> =>
    api
      .put<unknown, ApiResponse<InboxSoundSetting>>('/chat/settings/inbox-sound', {
        enabled,
      })
      .then(unwrap),
};
