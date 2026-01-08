// Player-specific types matching backend API

import { MatchBasic } from './match.types';
import { TrainingPlanBasic } from './training.types';

// ============================================
// PLAYER DASHBOARD (My Stats)
// ============================================

export interface PlayerDashboardInfo {
  player_id: string;
  player_name: string;
  jersey_number: number;
  height: number | null;
  age: string | null;
  profile_image_url: string | null;
}

export interface PlayerDashboardAttributes {
  attacking_rating: number;
  technique_rating: number;
  creativity_rating: number;
  tactical_rating: number;
  defending_rating: number;
}

export interface PlayerDashboardGeneralStats {
  matches_played: number;
}

export interface PlayerDashboardAttackingStats {
  goals: number;
  assists: number;
  expected_goals: number;
  shots_per_game: number;
  shots_on_target_per_game: number;
}

export interface PlayerDashboardPassingStats {
  total_passes: number;
  passes_completed: number;
}

export interface PlayerDashboardDribblingStats {
  total_dribbles: number;
  successful_dribbles: number;
}

export interface PlayerDashboardDefendingStats {
  tackles: number;
  tackle_success_rate: number;
  interceptions: number;
  interception_success_rate: number;
}

export interface PlayerDashboardSeasonStats {
  general: PlayerDashboardGeneralStats;
  attacking: PlayerDashboardAttackingStats;
  passing: PlayerDashboardPassingStats;
  dribbling: PlayerDashboardDribblingStats;
  defending: PlayerDashboardDefendingStats;
}

export interface PlayerDashboardResponse {
  player: PlayerDashboardInfo;
  attributes: PlayerDashboardAttributes;
  season_statistics: PlayerDashboardSeasonStats;
}

// ============================================
// PLAYER MATCHES LIST
// ============================================

export interface PlayerMatchesResponse {
  total_count: number;
  matches: MatchBasic[];
}

// ============================================
// PLAYER TRAINING LIST
// ============================================

export interface PlayerTrainingListResponse {
  training_plans: TrainingPlanBasic[];
}

// ============================================
// PLAYER PROFILE
// ============================================

export interface PlayerProfileInfo {
  player_id: string;
  player_name: string;
  email: string;
  jersey_number: number;
  position: string;
  height: number | null;
  birth_date: string | null;
  profile_image_url: string | null;
}

export interface PlayerClubInfo {
  club_name: string;
}

export interface PlayerSeasonSummary {
  matches_played: number;
  goals: number;
  assists: number;
}

export interface PlayerProfileResponse {
  player: PlayerProfileInfo;
  club: PlayerClubInfo;
  season_summary: PlayerSeasonSummary;
}
