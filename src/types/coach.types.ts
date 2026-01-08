// Coach-specific types matching backend API

import { MatchBasic } from './match.types';
import { TrainingPlanBasic } from './training.types';

// ============================================
// COACH DASHBOARD
// ============================================

export interface CoachInfo {
  full_name: string;
}

export interface ClubInfo {
  club_id: string;
  club_name: string;
  logo_url: string | null;
}

export interface SeasonRecord {
  wins: number;
  draws: number;
  losses: number;
}

export interface SeasonSummaryStats {
  matches_played: number;
  goals_scored: number;
  goals_conceded: number;
  total_assists: number;
}

export interface TeamAttackingStats {
  avg_goals_per_match: number;
  avg_xg_per_match: number;
  avg_total_shots: number;
  avg_shots_on_target: number;
  avg_dribbles: number;
  avg_successful_dribbles: number;
}

export interface TeamPassingStats {
  avg_possession_percentage: number;
  avg_passes: number;
  pass_completion_percentage: number;
  avg_final_third_passes: number;
  avg_crosses: number;
}

export interface TeamDefendingStats {
  total_clean_sheets: number;
  avg_goals_conceded_per_match: number;
  avg_tackles: number;
  tackle_success_percentage: number;
  avg_interceptions: number;
  interception_success_percentage: number;
  avg_ball_recoveries: number;
  avg_saves_per_match: number;
}

export interface DashboardStatistics {
  season_summary: SeasonSummaryStats;
  attacking: TeamAttackingStats;
  passes: TeamPassingStats;
  defending: TeamDefendingStats;
}

export interface MatchesList {
  total_count: number;
  matches: MatchBasic[];
}

export interface CoachDashboardResponse {
  coach: CoachInfo;
  club: ClubInfo;
  season_record: SeasonRecord;
  team_form: string;
  matches: MatchesList;
  statistics: DashboardStatistics;
}

// ============================================
// PLAYERS LIST
// ============================================

export interface PlayersSummary {
  total_players: number;
  joined: number;
  pending: number;
}

export interface PlayerListItem {
  player_id: string;
  player_name: string;
  jersey_number: number;
  profile_image_url: string | null;
  is_linked: boolean;
}

export interface CoachPlayersResponse {
  summary: PlayersSummary;
  players: PlayerListItem[];
}

// ============================================
// PLAYER DETAIL (Coach View)
// ============================================

export interface PlayerInfo {
  player_id: string;
  player_name: string;
  jersey_number: number;
  height: number | null;
  age: string | null;
  profile_image_url: string | null;
  is_linked: boolean;
}

export interface PlayerAttributes {
  attacking_rating: number;
  technique_rating: number;
  creativity_rating: number;
  tactical_rating: number;
  defending_rating: number;
}

export interface PlayerGeneralStats {
  matches_played: number;
}

export interface PlayerAttackingStats {
  goals: number;
  assists: number;
  expected_goals: number;
  shots_per_game: number;
  shots_on_target_per_game: number;
}

export interface PlayerPassingStats {
  total_passes: number;
  passes_completed: number;
}

export interface PlayerDribblingStats {
  total_dribbles: number;
  successful_dribbles: number;
}

export interface PlayerDefendingStats {
  tackles: number;
  tackle_success_rate: number;
  interceptions: number;
  interception_success_rate: number;
}

export interface PlayerSeasonStatistics {
  general: PlayerGeneralStats;
  attacking: PlayerAttackingStats;
  passing: PlayerPassingStats;
  dribbling: PlayerDribblingStats;
  defending: PlayerDefendingStats;
}

export interface CoachPlayerDetailResponse {
  player: PlayerInfo;
  invite_code: string | null;
  attributes: PlayerAttributes;
  season_statistics: PlayerSeasonStatistics;
  matches: MatchesList;
  training_plans: TrainingPlanBasic[];
}

// ============================================
// COACH PROFILE
// ============================================

export interface CoachProfileInfo {
  full_name: string;
  email: string;
  gender: string | null;
  birth_date: string | null;
}

export interface CoachClubInfo {
  club_name: string;
  logo_url: string | null;
}

export interface CoachClubStats {
  total_players: number;
  total_matches: number;
  win_rate_percentage: number;
}

export interface CoachProfileResponse {
  coach: CoachProfileInfo;
  club: CoachClubInfo;
  club_stats: CoachClubStats;
}

// ============================================
// GENERATE AI PLAN REQUEST
// ============================================

export interface GenerateAIPlanRequest {
  player_id: string;
}
