import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export const useAuth = () => {
  const { user, tokens, isAuthenticated, isLoading, logout, setLoading } = useAuthStore();

  const isPlayer = user?.role === UserRole.PLAYER;
  const isCoach = user?.role === UserRole.COACH;

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    isPlayer,
    isCoach,
    logout,
    setLoading,
  };
};
