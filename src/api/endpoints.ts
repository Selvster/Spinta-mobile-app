export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Player endpoints
  PLAYER: {
    PROFILE: (id: string) => `/players/${id}`,
    TRAINING: (id: string) => `/players/${id}/training`,
    STATS: (id: string) => `/players/${id}/stats`,
  },

  // Coach endpoints
  COACH: {
    PROFILE: (id: string) => `/coaches/${id}`,
    TEAMS: (id: string) => `/coaches/${id}/teams`,
    PLAYERS: (id: string) => `/coaches/${id}/players`,
  },
} as const;
