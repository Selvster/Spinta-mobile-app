import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const usePlayer = () => {
  const { user } = useAuth();
  const isPlayer = user?.role === UserRole.PLAYER;

  // Add player-specific queries here later
  // const training = usePlayerTraining(isPlayer ? user.id : '');

  return {
    isPlayer,
    player: isPlayer ? user : null,
    // training,
  };
};
