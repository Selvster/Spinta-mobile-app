export const AUTH_ROUTES = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  ROLE_SELECTION: 'RoleSelection',
  REGISTRATION_SUCCESS: 'RegistrationSuccess',
} as const;

export const PLAYER_ROUTES = {
  HOME: 'PlayerHome',
  MATCHES: 'PlayerMatches',
  TRAINING: 'PlayerTraining',
  PROFILE: 'PlayerProfile',
  MATCH_DETAIL: 'PlayerMatchDetail',
  TRAINING_PLAN_DETAIL: 'PlayerTrainingPlanDetail',
} as const;

export const COACH_ROUTES = {
  CLUB: 'Club',
  PLAYERS: 'Players',
  CHATBOT: 'Chatbot',
  PROFILE: 'Profile',
  MATCH_DETAIL: 'MatchDetail',
  PLAYER_DETAIL: 'PlayerDetail',
  PLAYER_MATCH_DETAIL: 'PlayerMatchDetail',
  CREATE_TRAINING_PLAN: 'CreateTrainingPlan',
  TRAINING_PLAN_DETAIL: 'TrainingPlanDetail',
} as const;
