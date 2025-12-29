import { useAuth } from './useAuth';
import { UserRole } from '../types';

export const useCoach = () => {
  const { user } = useAuth();
  const isCoach = user?.role === UserRole.COACH;

  // Add coach-specific queries here later
  // const teams = useCoachTeams(isCoach ? user.id : '');

  return {
    isCoach,
    coach: isCoach ? user : null,
    // teams,
  };
};
