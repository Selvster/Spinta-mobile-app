// Match-related types matching backend API

// ============================================
// SHARED MATCH TYPES
// ============================================

export type MatchResult = 'W' | 'D' | 'L';

export interface MatchBasic {
  match_id: string;
  opponent_name: string;
  match_date: string;
  our_score: number;
  opponent_score: number;
  result: MatchResult;
}

export interface MatchInfo {
  match_id: string;
  match_date: string;
  our_score: number;
  opponent_score: number;
  result: MatchResult;
}

export interface TeamInfo {
  our_club: {
    club_name: string;
    logo_url: string | null;
  };
  opponent: {
    opponent_name: string;
    logo_url: string | null;
  };
}

// ============================================
// GOAL SCORERS
// ============================================

export interface GoalScorer {
  goal_id: string;
  scorer_name: string;
  minute: number;
  second: number;
  is_our_goal: boolean;
}

// ============================================
// MATCH STATISTICS
// ============================================

export interface StatComparison {
  our_team: number;
  opponent: number;
}

export interface MatchOverviewStats {
  ball_possession: StatComparison;
  expected_goals: StatComparison;
  total_shots: StatComparison;
  goalkeeper_saves: StatComparison;
  total_passes: StatComparison;
  total_dribbles: StatComparison;
}

export interface AttackingStats {
  total_shots: StatComparison;
  shots_on_target: StatComparison;
  shots_off_target: StatComparison;
  total_dribbles: StatComparison;
  successful_dribbles: StatComparison;
}

export interface PassingStats {
  total_passes: StatComparison;
  passes_completed: StatComparison;
  passes_in_final_third: StatComparison;
  long_passes: StatComparison;
  crosses: StatComparison;
}

export interface DefendingStats {
  tackle_success_percentage: StatComparison;
  total_tackles: StatComparison;
  interceptions: StatComparison;
  ball_recoveries: StatComparison;
  goalkeeper_saves: StatComparison;
}

export interface MatchStatistics {
  match_overview: MatchOverviewStats;
  attacking: AttackingStats;
  passing: PassingStats;
  defending: DefendingStats;
}

// ============================================
// LINEUP
// ============================================

export interface OurTeamPlayer {
  player_id: string;
  jersey_number: number;
  player_name: string;
  position: string;
}

export interface OpponentPlayer {
  opponent_player_id: string;
  jersey_number: number;
  player_name: string;
  position: string;
}

export interface MatchLineup {
  our_team: OurTeamPlayer[];
  opponent_team: OpponentPlayer[];
}

// ============================================
// PLAYER MATCH STATISTICS (Individual Performance)
// ============================================

export interface PlayerMatchAttackingStats {
  goals: number;
  assists: number;
  xg: number;
  total_shots: number;
  shots_on_target: number;
  total_dribbles: number;
  successful_dribbles: number;
}

export interface PlayerMatchPassingStats {
  total_passes: number;
  passes_completed: number;
  short_passes: number;
  long_passes: number;
  final_third: number;
  crosses: number;
}

export interface PlayerMatchDefendingStats {
  tackles: number;
  tackle_success_rate: number;
  interceptions: number;
  interception_success_rate: number;
}

export interface PlayerMatchStatistics {
  attacking: PlayerMatchAttackingStats;
  passing: PlayerMatchPassingStats;
  defending: PlayerMatchDefendingStats;
}

export interface PlayerMatchSummary {
  player_name: string;
  goals: number;
  assists: number;
}

// ============================================
// FULL MATCH DETAIL RESPONSE (Coach View)
// ============================================

export interface CoachMatchDetailResponse {
  match: MatchInfo;
  teams: TeamInfo;
  summary: {
    goal_scorers: GoalScorer[];
  };
  statistics: MatchStatistics;
  lineup: MatchLineup;
}

// ============================================
// PLAYER MATCH DETAIL RESPONSE
// ============================================

export interface PlayerMatchDetailResponse {
  match: MatchInfo;
  teams: TeamInfo;
  player_summary: PlayerMatchSummary;
  statistics: PlayerMatchStatistics;
}
