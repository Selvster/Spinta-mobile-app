import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, logout, setLoading } = useAuthStore();

  const isPlayer = user?.user_type === UserRole.PLAYER;
  const isCoach = user?.user_type === UserRole.COACH;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isPlayer,
    isCoach,
    logout,
    setLoading,
  };
};
