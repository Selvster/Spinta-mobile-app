import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  CoachDashboardResponse,
  CoachPlayersResponse,
  CoachPlayerDetailResponse,
  CoachProfileResponse,
  CoachMatchDetailResponse,
  PlayerMatchDetailResponse,
  TrainingPlanDetailResponse,
} from '../../types';

// Query keys for cache management
export const coachQueryKeys = {
  all: ['coach'] as const,
  dashboard: () => [...coachQueryKeys.all, 'dashboard'] as const,
  players: () => [...coachQueryKeys.all, 'players'] as const,
  playerDetail: (playerId: string) => [...coachQueryKeys.all, 'players', playerId] as const,
  playerMatchDetail: (playerId: string, matchId: string) =>
    [...coachQueryKeys.all, 'players', playerId, 'matches', matchId] as const,
  matchDetail: (matchId: string) => [...coachQueryKeys.all, 'matches', matchId] as const,
  profile: () => [...coachQueryKeys.all, 'profile'] as const,
  trainingPlanDetail: (planId: string) => [...coachQueryKeys.all, 'training-plans', planId] as const,
};

/**
 * Fetch coach dashboard data
 * GET /api/coach/dashboard
 */
export const useCoachDashboard = () => {
  return useQuery({
    queryKey: coachQueryKeys.dashboard(),
    queryFn: async () => {
      const { data } = await apiClient.get<CoachDashboardResponse>(
        ENDPOINTS.COACH.DASHBOARD
      );
      return data;
    },
  });
};

/**
 * Fetch all players for coach
 * GET /api/coach/players
 */
export const useCoachPlayers = () => {
  return useQuery({
    queryKey: coachQueryKeys.players(),
    queryFn: async () => {
      const { data } = await apiClient.get<CoachPlayersResponse>(
        ENDPOINTS.COACH.PLAYERS
      );
      return data;
    },
  });
};

/**
 * Fetch specific player details (coach view)
 * GET /api/coach/players/{player_id}
 */
export const useCoachPlayerDetail = (playerId: string) => {
  return useQuery({
    queryKey: coachQueryKeys.playerDetail(playerId),
    queryFn: async () => {
      const { data } = await apiClient.get<CoachPlayerDetailResponse>(
        ENDPOINTS.COACH.PLAYER_DETAIL(playerId)
      );
      return data;
    },
    enabled: !!playerId,
  });
};

/**
 * Fetch player's match detail (coach view)
 * GET /api/coach/players/{player_id}/matches/{match_id}
 */
export const useCoachPlayerMatchDetail = (playerId: string, matchId: string) => {
  return useQuery({
    queryKey: coachQueryKeys.playerMatchDetail(playerId, matchId),
    queryFn: async () => {
      const { data } = await apiClient.get<PlayerMatchDetailResponse>(
        ENDPOINTS.COACH.PLAYER_MATCH_DETAIL(playerId, matchId)
      );
      return data;
    },
    enabled: !!playerId && !!matchId,
  });
};

/**
 * Fetch match detail (team statistics, lineup, etc.)
 * GET /api/coach/matches/{match_id}
 */
export const useCoachMatchDetail = (matchId: string) => {
  return useQuery({
    queryKey: coachQueryKeys.matchDetail(matchId),
    queryFn: async () => {
      const { data } = await apiClient.get<CoachMatchDetailResponse>(
        ENDPOINTS.COACH.MATCH_DETAIL(matchId)
      );
      return data;
    },
    enabled: !!matchId,
  });
};

/**
 * Fetch coach profile
 * GET /api/coach/profile
 */
export const useCoachProfile = () => {
  return useQuery({
    queryKey: coachQueryKeys.profile(),
    queryFn: async () => {
      const { data } = await apiClient.get<CoachProfileResponse>(
        ENDPOINTS.COACH.PROFILE
      );
      return data;
    },
  });
};

/**
 * Fetch training plan detail
 * GET /api/coach/training-plans/{plan_id}
 */
export const useCoachTrainingPlanDetail = (planId: string) => {
  return useQuery({
    queryKey: coachQueryKeys.trainingPlanDetail(planId),
    queryFn: async () => {
      const { data } = await apiClient.get<TrainingPlanDetailResponse>(
        ENDPOINTS.COACH.TRAINING_PLAN_DETAIL(planId)
      );
      return data;
    },
    enabled: !!planId,
  });
};
