import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUser, UserRole } from '../types';

interface AuthStore {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: ApiUser, token: string) => void;
  setUser: (user: ApiUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;

  // Helpers
  isCoach: () => boolean;
  isPlayer: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      setToken: (token) =>
        set({ token }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      // Helpers
      isCoach: () => get().user?.user_type === UserRole.COACH,
      isPlayer: () => get().user?.user_type === UserRole.PLAYER,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
