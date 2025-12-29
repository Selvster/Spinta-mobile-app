import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { LoginCredentials, RegisterData, AuthTokens, User } from '../../types';
import { useAuthStore } from '../../stores/authStore';

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const useLogin = () => {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<LoginResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.tokens);
    },
  });
};

export const useRegister = () => {
  const { setUser, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const { data } = await apiClient.post<LoginResponse>(
        ENDPOINTS.AUTH.REGISTER,
        registerData
      );
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setTokens(data.tokens);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    },
    onSuccess: () => {
      logout();
    },
  });
};
