import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inboxSettingsApi } from '@features/chatbot/api/inboxSettingsApi';

const INBOX_SOUND_QUERY_KEY = ['chat-settings', 'inbox-sound'];

export function useInboxSoundSetting() {
  return useQuery({
    queryKey: INBOX_SOUND_QUERY_KEY,
    queryFn: () => inboxSettingsApi.getInboxSound(),
    staleTime: 60_000,
  });
}

export function useSetInboxSoundSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled: boolean) => inboxSettingsApi.setInboxSound(enabled),
    onSuccess: (data) => {
      queryClient.setQueryData(INBOX_SOUND_QUERY_KEY, data);
    },
  });
}
