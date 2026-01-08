import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const useCoach = () => {
  const { user } = useAuth();
  const isCoach = user?.user_type === UserRole.COACH;

  return {
    isCoach,
    coach: isCoach ? user : null,
  };
};
