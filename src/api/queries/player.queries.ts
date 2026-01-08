import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  PlayerDashboardResponse,
  PlayerMatchesResponse,
  PlayerMatchDetailResponse,
  PlayerTrainingListResponse,
  TrainingPlanDetailResponse,
  PlayerProfileResponse,
} from '../../types';

// Query keys for cache management
export const playerQueryKeys = {
  all: ['player'] as const,
  dashboard: () => [...playerQueryKeys.all, 'dashboard'] as const,
  matches: () => [...playerQueryKeys.all, 'matches'] as const,
  matchDetail: (matchId: string) => [...playerQueryKeys.all, 'matches', matchId] as const,
  training: () => [...playerQueryKeys.all, 'training'] as const,
  trainingDetail: (planId: string) => [...playerQueryKeys.all, 'training', planId] as const,
  profile: () => [...playerQueryKeys.all, 'profile'] as const,
};

/**
 * Fetch player dashboard (My Stats)
 * GET /api/player/dashboard
 */
export const usePlayerDashboard = () => {
  return useQuery({
    queryKey: playerQueryKeys.dashboard(),
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerDashboardResponse>(
        ENDPOINTS.PLAYER.DASHBOARD
      );
      return data;
    },
  });
};

/**
 * Fetch player matches list
 * GET /api/player/matches
 */
export const usePlayerMatches = (limit: number = 20, offset: number = 0) => {
  return useQuery({
    queryKey: [...playerQueryKeys.matches(), { limit, offset }],
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerMatchesResponse>(
        ENDPOINTS.PLAYER.MATCHES,
        { params: { limit, offset } }
      );
      return data;
    },
  });
};

/**
 * Fetch player match detail
 * GET /api/player/matches/{match_id}
 */
export const usePlayerMatchDetail = (matchId: string) => {
  return useQuery({
    queryKey: playerQueryKeys.matchDetail(matchId),
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerMatchDetailResponse>(
        ENDPOINTS.PLAYER.MATCH_DETAIL(matchId)
      );
      return data;
    },
    enabled: !!matchId,
  });
};

/**
 * Fetch player training plans list
 * GET /api/player/training
 */
export const usePlayerTraining = () => {
  return useQuery({
    queryKey: playerQueryKeys.training(),
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerTrainingListResponse>(
        ENDPOINTS.PLAYER.TRAINING
      );
      return data;
    },
  });
};

/**
 * Fetch player training plan detail
 * GET /api/player/training/{plan_id}
 */
export const usePlayerTrainingDetail = (planId: string) => {
  return useQuery({
    queryKey: playerQueryKeys.trainingDetail(planId),
    queryFn: async () => {
      console.log('Fetching player training detail for planId:', planId);
      console.log('Endpoint:', ENDPOINTS.PLAYER.TRAINING_DETAIL(planId));
      try {
        const { data } = await apiClient.get<TrainingPlanDetailResponse>(
          ENDPOINTS.PLAYER.TRAINING_DETAIL(planId)
        );
        console.log('Player training detail response:', JSON.stringify(data, null, 2));
        return data;
      } catch (error: any) {
        console.log('=== Player Training Detail Error ===');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
        console.log('Response Headers:', JSON.stringify(error.response?.headers, null, 2));
        console.log('Request URL:', error.config?.url);
        console.log('Request Method:', error.config?.method);
        console.log('Full Error:', error.message);
        console.log('===================================');
        throw error;
      }
    },
    enabled: !!planId,
  });
};

/**
 * Fetch player profile
 * GET /api/player/profile
 */
export const usePlayerProfile = () => {
  return useQuery({
    queryKey: playerQueryKeys.profile(),
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerProfileResponse>(
        ENDPOINTS.PLAYER.PROFILE
      );
      return data;
    },
  });
};
