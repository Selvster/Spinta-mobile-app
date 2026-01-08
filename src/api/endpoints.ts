export const ENDPOINTS = {
  // Auth endpoints (4 endpoints)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_COACH: '/auth/register/coach',
    VERIFY_INVITE: '/auth/verify-invite',
    REGISTER_PLAYER: '/auth/register/player',
  },

  // Coach endpoints (11 endpoints)
  COACH: {
    DASHBOARD: '/coach/dashboard',
    MATCH_DETAIL: (matchId: string) => `/coach/matches/${matchId}`,
    PLAYERS: '/coach/players',
    PLAYER_DETAIL: (playerId: string) => `/coach/players/${playerId}`,
    PLAYER_MATCH_DETAIL: (playerId: string, matchId: string) =>
      `/coach/players/${playerId}/matches/${matchId}`,
    PROFILE: '/coach/profile',
    TRAINING_PLAN_GENERATE_AI: '/coach/training-plans/generate-ai',
    TRAINING_PLAN_CREATE: '/coach/training-plans',
    TRAINING_PLAN_DETAIL: (planId: string) => `/coach/training-plans/${planId}`,
    TRAINING_PLAN_UPDATE: (planId: string) => `/coach/training-plans/${planId}`,
    TRAINING_PLAN_DELETE: (planId: string) => `/coach/training-plans/${planId}`,
  },

  // Player endpoints (7 endpoints)
  PLAYER: {
    DASHBOARD: '/player/dashboard',
    MATCHES: '/player/matches',
    MATCH_DETAIL: (matchId: string) => `/player/matches/${matchId}`,
    TRAINING: '/player/training',
    TRAINING_DETAIL: (planId: string) => `/player/training/${planId}`,
    TOGGLE_EXERCISE: (exerciseId: string) =>
      `/player/training/exercises/${exerciseId}/toggle`,
    PROFILE: '/player/profile',
  },

  // Chat endpoints (3 endpoints)
  CHAT: {
    SEND_MESSAGE: '/chat/messages',
    GET_HISTORY: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
    CLEAR_SESSION: (sessionId: string) => `/chat/sessions/${sessionId}`,
  },
} as const;
