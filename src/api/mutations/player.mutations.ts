import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { ToggleExerciseRequest, ToggleExerciseResponse } from '../../types';
import { playerQueryKeys } from '../queries/player.queries';

/**
 * Toggle exercise completion status
 * PUT /api/player/training/exercises/{exercise_id}/toggle
 */
export const useToggleExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      exerciseId,
      completed,
    }: {
      exerciseId: string;
      completed: boolean;
    }) => {
      const { data } = await apiClient.put<ToggleExerciseResponse>(
        ENDPOINTS.PLAYER.TOGGLE_EXERCISE(exerciseId),
        { completed } as ToggleExerciseRequest
      );
      return data;
    },
    onSuccess: (data) => {
      // Invalidate training plan detail to refresh exercise list
      queryClient.invalidateQueries({
        queryKey: playerQueryKeys.trainingDetail(data.plan_progress.plan_id),
      });
      // Invalidate training list to refresh statuses
      queryClient.invalidateQueries({
        queryKey: playerQueryKeys.training(),
      });
    },
  });
};
