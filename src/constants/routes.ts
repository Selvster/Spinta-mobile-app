export const AUTH_ROUTES = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  ROLE_SELECTION: 'RoleSelection',
} as const;

export const PLAYER_ROUTES = {
  HOME: 'PlayerHome',
  TRAINING: 'PlayerTraining',
  PROFILE: 'PlayerProfile',
  SETTINGS: 'Settings',
} as const;

export const COACH_ROUTES = {
  HOME: 'CoachHome',
  TEAM: 'CoachTeam',
  PROFILE: 'CoachProfile',
  SETTINGS: 'Settings',
} as const;
