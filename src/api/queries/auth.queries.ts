import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { User } from '../../types';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
