import { UserRole } from '../types';

export const ROLE_CONFIG = {
  [UserRole.PLAYER]: {
    label: 'Player',
    description: 'Join teams and track your training',
  },
  [UserRole.COACH]: {
    label: 'Coach',
    description: 'Manage teams and monitor player progress',
  },
} as const;
