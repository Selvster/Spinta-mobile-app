import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, ApiUser } from '../types';

export const useRole = () => {
  const { user, isPlayer, isCoach } = useAuth();

  const playerData = useMemo(() => {
    return isPlayer ? user : null;
  }, [user, isPlayer]);

  const coachData = useMemo(() => {
    return isCoach ? user : null;
  }, [user, isCoach]);

  return {
    role: user?.user_type,
    isPlayer,
    isCoach,
    playerData,
    coachData,
  };
};
