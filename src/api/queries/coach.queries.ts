import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

// Example coach query
export const useCoachTeams = (coachId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['coach', coachId, 'teams'],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.COACH.TEAMS(coachId));
      return data;
    },
    enabled: enabled && !!coachId,
  });
};

export const useCoachPlayers = (coachId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['coach', coachId, 'players'],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.COACH.PLAYERS(coachId));
      return data;
    },
    enabled: enabled && !!coachId,
  });
};
