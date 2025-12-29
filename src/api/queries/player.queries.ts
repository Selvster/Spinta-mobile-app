import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

// Example player query
export const usePlayerTraining = (playerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['player', playerId, 'training'],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.PLAYER.TRAINING(playerId));
      return data;
    },
    enabled: enabled && !!playerId,
  });
};

export const usePlayerStats = (playerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['player', playerId, 'stats'],
    queryFn: async () => {
      const { data } = await apiClient.get(ENDPOINTS.PLAYER.STATS(playerId));
      return data;
    },
    enabled: enabled && !!playerId,
  });
};
