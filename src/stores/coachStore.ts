import { create } from 'zustand';

interface CoachStore {
  // Coach-specific state will go here
  // For example: teams, players, etc.
}

export const useCoachStore = create<CoachStore>()((set) => ({}));
