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
  CLUB: 'Club',
  PLAYERS: 'Players',
  CHATBOT: 'Chatbot',
  PROFILE: 'Profile',
  MATCH_DETAIL: 'MatchDetail',
  PLAYER_DETAIL: 'PlayerDetail',
  CREATE_TRAINING_PLAN: 'CreateTrainingPlan',
} as const;
