import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  LoginRequest,
  LoginResponse,
  CoachRegistrationRequest,
  CoachRegistrationResponse,
  VerifyInviteRequest,
  VerifyInviteResponse,
  PlayerRegistrationRequest,
  PlayerRegistrationResponse,
} from '../../types';
import { useAuthStore } from '../../stores/authStore';

/**
 * Login mutation
 * POST /api/auth/login
 */
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await apiClient.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      // Clear all cached data from previous user before setting new auth
      queryClient.clear();
      setAuth(data.user, data.token);
    },
  });
};

/**
 * Coach registration mutation
 * POST /api/auth/register/coach
 */
export const useRegisterCoach = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registerData: CoachRegistrationRequest) => {
      const { data } = await apiClient.post<CoachRegistrationResponse>(
        ENDPOINTS.AUTH.REGISTER_COACH,
        registerData
      );
      return data;
    },
    onSuccess: (data) => {
      // Clear all cached data from previous user before setting new auth
      queryClient.clear();
      setAuth(data.user, data.token);
    },
  });
};

/**
 * Verify invite code mutation (Step 1 of player registration)
 * POST /api/auth/verify-invite
 */
export const useVerifyInvite = () => {
  return useMutation({
    mutationFn: async (request: VerifyInviteRequest) => {
      const { data } = await apiClient.post<VerifyInviteResponse>(
        ENDPOINTS.AUTH.VERIFY_INVITE,
        request
      );
      return data;
    },
  });
};

/**
 * Player registration mutation (Step 2 of player registration)
 * POST /api/auth/register/player
 */
export const useRegisterPlayer = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (registerData: PlayerRegistrationRequest) => {
      const { data } = await apiClient.post<PlayerRegistrationResponse>(
        ENDPOINTS.AUTH.REGISTER_PLAYER,
        registerData
      );
      return data;
    },
    onSuccess: (data) => {
      // Clear all cached data from previous user before setting new auth
      queryClient.clear();
      setAuth(data.user, data.token);
    },
  });
};

/**
 * Logout function (client-side only)
 * No API call needed - just clear local state
 */
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Logout is client-side only for JWT
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached data before logout
      queryClient.clear();
      logout();
    },
  });
};
