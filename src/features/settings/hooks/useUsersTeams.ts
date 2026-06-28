import {
  CreateTeamInput,
  CreateUserInput,
  CrmUser,
  Team,
} from '@features/settings/types/settings';
import api from '@shared/api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsersList() {
  return useQuery<CrmUser[]>({
    queryKey: ['settings-users'],
    queryFn: async () => {
      const { data } = await api.get('/settings/users');
      return data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const { data } = await api.post('/settings/users', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      queryClient.invalidateQueries({ queryKey: ['settings-teams'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CrmUser> & { id: string }) => {
      const { data } = await api.patch(`/settings/users/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
      queryClient.invalidateQueries({ queryKey: ['settings-teams'] });
    },
  });
}

export function useTeamsList() {
  return useQuery<Team[]>({
    queryKey: ['settings-teams'],
    queryFn: async () => {
      const { data } = await api.get('/settings/teams');
      return data;
    },
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTeamInput) => {
      const { data } = await api.post('/settings/teams', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-teams'] });
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: Partial<Team> & { id: string; member_ids?: string[] }) => {
      const { data } = await api.patch(`/settings/teams/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-teams'] });
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/settings/teams/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-teams'] });
      queryClient.invalidateQueries({ queryKey: ['settings-users'] });
    },
  });
}
