import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const usePlayer = () => {
  const { user } = useAuth();
  const isPlayer = user?.user_type === UserRole.PLAYER;

  return {
    isPlayer,
    player: isPlayer ? user : null,
  };
};
