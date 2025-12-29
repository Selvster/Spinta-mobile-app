import { create } from 'zustand';

interface PlayerStore {
  // Player-specific state will go here
  // For example: training sessions, stats, etc.
}

export const usePlayerStore = create<PlayerStore>()((set) => ({}));
