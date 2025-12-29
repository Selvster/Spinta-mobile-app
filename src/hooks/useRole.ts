import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, Player, Coach } from '../types';

export const useRole = () => {
  const { user, isPlayer, isCoach } = useAuth();

  const playerData = useMemo(() => {
    return isPlayer ? (user as Player) : null;
  }, [user, isPlayer]);

  const coachData = useMemo(() => {
    return isCoach ? (user as Coach) : null;
  }, [user, isCoach]);

  return {
    role: user?.role,
    isPlayer,
    isCoach,
    playerData,
    coachData,
  };
};
