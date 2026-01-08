import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  AIGeneratedPlanResponse,
  CreateTrainingPlanRequest,
  CreateTrainingPlanResponse,
  UpdateTrainingPlanRequest,
  UpdateTrainingPlanResponse,
  DeleteTrainingPlanResponse,
  GenerateAIPlanRequest,
} from '../../types';
import { coachQueryKeys } from '../queries/coach.queries';

/**
 * Generate AI training plan for a player
 * POST /api/coach/training-plans/generate-ai
 */
export const useGenerateAIPlan = () => {
  return useMutation({
    mutationFn: async (request: GenerateAIPlanRequest) => {
      const { data } = await apiClient.post<AIGeneratedPlanResponse>(
        ENDPOINTS.COACH.TRAINING_PLAN_GENERATE_AI,
        request
      );
      return data;
    },
  });
};

/**
 * Create a new training plan
 * POST /api/coach/training-plans
 */
export const useCreateTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateTrainingPlanRequest) => {
      const { data } = await apiClient.post<CreateTrainingPlanResponse>(
        ENDPOINTS.COACH.TRAINING_PLAN_CREATE,
        request
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate player detail to refresh training plans list
      queryClient.invalidateQueries({
        queryKey: coachQueryKeys.playerDetail(variables.player_id),
      });
    },
  });
};

/**
 * Update an existing training plan
 * PUT /api/coach/training-plans/{plan_id}
 */
export const useUpdateTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      data: updateData,
    }: {
      planId: string;
      data: UpdateTrainingPlanRequest;
    }) => {
      const { data } = await apiClient.put<UpdateTrainingPlanResponse>(
        ENDPOINTS.COACH.TRAINING_PLAN_UPDATE(planId),
        updateData
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate training plan detail
      queryClient.invalidateQueries({
        queryKey: coachQueryKeys.trainingPlanDetail(data.plan_id),
      });
      // Invalidate player detail to refresh training plans list
      queryClient.invalidateQueries({
        queryKey: coachQueryKeys.playerDetail(data.player_id),
      });
    },
  });
};

/**
 * Delete a training plan
 * DELETE /api/coach/training-plans/{plan_id}
 */
export const useDeleteTrainingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const { data } = await apiClient.delete<DeleteTrainingPlanResponse>(
        ENDPOINTS.COACH.TRAINING_PLAN_DELETE(planId)
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate all coach queries to refresh data
      queryClient.invalidateQueries({
        queryKey: coachQueryKeys.all,
      });
    },
  });
};
