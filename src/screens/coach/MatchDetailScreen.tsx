import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { useCoachMatchDetail } from '../../api/queries/coach.queries';
import { Loading } from '../../components/common/Loading';
import {
  MatchResult,
  GoalScorer,
  OurTeamPlayer,
  OpponentPlayer,
  StatComparison
} from '../../types';

type TabType = 'summary' | 'statistics' | 'lineup';

// Route params type
type MatchDetailRouteParams = {
  MatchDetail: { matchId: string };
};

interface StatBarProps {
  label: string;
  homeValue: number;
  awayValue: number;
  isPercentage?: boolean;
}

interface CircularProgressProps {
  percentage: number;
  label: string;
  size?: number;
}

interface PlayerListItemProps {
  player: OurTeamPlayer | OpponentPlayer;
  isHomeTeam: boolean;
}

// Helper to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper to format goal time
const formatGoalTime = (minute: number, second: number | null): string => {
  return `${minute}'`;
};

// Helper to get result text
const getResultText = (result: MatchResult): string => {
  switch (result) {
    case 'W': return 'Win';
    case 'D': return 'Draw';
    case 'L': return 'Loss';
  }
};

const StatBar: React.FC<StatBarProps> = ({ label, homeValue, awayValue, isPercentage = false }) => {
  const total = homeValue + awayValue;
  const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;

  return (
    <View style={styles.statBarContainer}>
      <Text style={styles.statBarValue}>{isPercentage ? `${homeValue}%` : homeValue}</Text>
      <View style={styles.statBarContent}>
        <View style={styles.barBackground}>
          <View style={[styles.barFillHome, { width: `${homePercentage}%` }]} />
          <View style={[styles.barFillAway, { width: `${awayPercentage}%` }]} />
        </View>
        <Text style={styles.statBarLabel}>{label}</Text>
      </View>
      <Text style={styles.statBarValue}>{isPercentage ? `${awayValue}%` : awayValue}</Text>
    </View>
  );
};

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, label, size = 80 }) => {
  return (
    <View style={styles.circularProgressContainer}>
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <View style={styles.circularProgressInner}>
          <Text style={styles.circularProgressText}>{percentage}%</Text>
        </View>
      </View>
      <Text style={styles.circularProgressLabel}>{label}</Text>
    </View>
  );
};

const PlayerListItem: React.FC<PlayerListItemProps> = ({ player, isHomeTeam }) => {
  return (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <View
          style={[
            styles.playerAvatar,
            { backgroundColor: isHomeTeam ? COLORS.primary : COLORS.textSecondary },
          ]}
        >
          <Text style={styles.playerAvatarText}>{player.jersey_number}</Text>
        </View>
        <Text style={styles.playerName}>{player.player_name}</Text>
      </View>
      <Text style={styles.playerPosition}>{player.position}</Text>
    </View>
  );
};

const MatchDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MatchDetailRouteParams, 'MatchDetail'>>();
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Get matchId from route params
  const matchId = route.params?.matchId;

  // Fetch match data using TanStack Query + Axios
  const { data, isLoading, error, refetch, isRefetching } = useCoachMatchDetail(matchId || '');

  // Helper to get result color
  const getResultColor = (result: MatchResult) => {
    switch (result) {
      case 'W':
        return COLORS.success;
      case 'L':
        return COLORS.error;
      case 'D':
        return COLORS.textSecondary;
    }
  };

  // Handle loading state
  if (isLoading) {
    return <Loading message="Loading match details..." />;
  }

  // Handle error or missing matchId
  if (error || !data || !matchId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            <Text style={styles.backText}>Back to Club</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load match details</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </View>
    );
  }

  // Extract data from API response
  const { match, teams, summary, statistics, lineup } = data;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back to Club</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Match Info Section */}
        <View style={styles.matchInfoSection}>
          <Text style={styles.matchDate}>{formatDate(match.match_date)}</Text>

          {/* Teams and Score */}
          <View style={styles.teamsContainer}>
            {/* Our Team (Home) */}
            <View style={styles.teamSection}>
              {teams.our_club.logo_url ? (
                <Image source={{ uri: teams.our_club.logo_url }} style={styles.teamLogoImage} />
              ) : (
                <View style={[styles.teamLogo, { backgroundColor: COLORS.primary }]}>
                  <Text style={styles.teamLogoText}>{teams.our_club.club_name.charAt(0)}</Text>
                </View>
              )}
              <Text style={styles.teamName}>{teams.our_club.club_name}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{match.our_score}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreText}>{match.opponent_score}</Text>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: getResultColor(match.result) }]}>
                <Text style={styles.resultText}>{getResultText(match.result)}</Text>
              </View>
            </View>

            {/* Opponent Team (Away) */}
            <View style={styles.teamSection}>
              {teams.opponent.logo_url ? (
                <Image source={{ uri: teams.opponent.logo_url }} style={styles.teamLogoImage} />
              ) : (
                <View style={[styles.teamLogo, { backgroundColor: COLORS.secondary }]}>
                  <Text style={styles.teamLogoText}>{teams.opponent.opponent_name.charAt(0)}</Text>
                </View>
              )}
              <Text style={styles.teamName}>{teams.opponent.opponent_name}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'summary' && styles.tabActive]}
            onPress={() => setActiveTab('summary')}
          >
            <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'statistics' && styles.tabActive]}
            onPress={() => setActiveTab('statistics')}
          >
            <Text style={[styles.tabText, activeTab === 'statistics' && styles.tabTextActive]}>
              Statistics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'lineup' && styles.tabActive]}
            onPress={() => setActiveTab('lineup')}
          >
            <Text style={[styles.tabText, activeTab === 'lineup' && styles.tabTextActive]}>
              Lineup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <View style={styles.tabContent}>
            {/* Goal Scorers */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Goal Scorers</Text>
              {summary.goal_scorers.length === 0 ? (
                <Text style={styles.noDataText}>No goals scored</Text>
              ) : (
                summary.goal_scorers.map((scorer: GoalScorer) => (
                  <View
                    key={scorer.goal_id}
                    style={[
                      styles.goalScorerCard,
                      {
                        backgroundColor: scorer.is_our_goal
                          ? 'rgba(52, 199, 89, 0.15)'
                          : 'rgba(255, 48, 0, 0.15)',
                      },
                    ]}
                  >
                    <Text style={styles.goalScorerName}>{scorer.scorer_name}</Text>
                    <Text style={styles.goalScorerTime}>{formatGoalTime(scorer.minute, scorer.second)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {activeTab === 'statistics' && (
          <View style={styles.tabContent}>
            {/* Match Overview */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Match Overview</Text>

              {/* Ball Possession */}
              <View style={styles.possessionContainer}>
                <Text style={styles.possessionLabel}>Ball Possession</Text>
                <View style={styles.possessionBar}>
                  <View style={[styles.possessionFillHome, { width: `${statistics.match_overview.ball_possession.our_team}%` }]}>
                    <Text style={styles.possessionText}>{statistics.match_overview.ball_possession.our_team}%</Text>
                  </View>
                  <View style={[styles.possessionFillAway, { width: `${statistics.match_overview.ball_possession.opponent}%` }]}>
                    <Text style={styles.possessionText}>{statistics.match_overview.ball_possession.opponent}%</Text>
                  </View>
                </View>
              </View>

              <StatBar label="Expected Goals (xG)" homeValue={statistics.match_overview.expected_goals.our_team} awayValue={statistics.match_overview.expected_goals.opponent} />
              <StatBar label="Total Shots" homeValue={statistics.match_overview.total_shots.our_team} awayValue={statistics.match_overview.total_shots.opponent} />
              <StatBar label="Goalkeeper Saves" homeValue={statistics.match_overview.goalkeeper_saves.our_team} awayValue={statistics.match_overview.goalkeeper_saves.opponent} />
              <StatBar label="Total Dribbles" homeValue={statistics.match_overview.total_dribbles.our_team} awayValue={statistics.match_overview.total_dribbles.opponent} />
              <StatBar label="Total Passes" homeValue={statistics.match_overview.total_passes.our_team} awayValue={statistics.match_overview.total_passes.opponent} />
            </View>

            {/* Attacking */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Attacking</Text>
              <StatBar label="Total Shots" homeValue={statistics.attacking.total_shots.our_team} awayValue={statistics.attacking.total_shots.opponent} />
              <StatBar label="Shots on Target" homeValue={statistics.attacking.shots_on_target.our_team} awayValue={statistics.attacking.shots_on_target.opponent} />
              <StatBar label="Shots off Target" homeValue={statistics.attacking.shots_off_target.our_team} awayValue={statistics.attacking.shots_off_target.opponent} />
              <StatBar label="Total Dribbles" homeValue={statistics.attacking.total_dribbles.our_team} awayValue={statistics.attacking.total_dribbles.opponent} />
              <StatBar label="Successful Dribbles" homeValue={statistics.attacking.successful_dribbles.our_team} awayValue={statistics.attacking.successful_dribbles.opponent} />
            </View>

            {/* Passing */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Passing</Text>
              <StatBar label="Total Passes" homeValue={statistics.passing.total_passes.our_team} awayValue={statistics.passing.total_passes.opponent} />
              <StatBar label="Passes Completed" homeValue={statistics.passing.passes_completed.our_team} awayValue={statistics.passing.passes_completed.opponent} />
              <StatBar label="Passes in Final Third" homeValue={statistics.passing.passes_in_final_third.our_team} awayValue={statistics.passing.passes_in_final_third.opponent} />
              <StatBar label="Long Passes" homeValue={statistics.passing.long_passes.our_team} awayValue={statistics.passing.long_passes.opponent} />
              <StatBar label="Crosses" homeValue={statistics.passing.crosses.our_team} awayValue={statistics.passing.crosses.opponent} />
            </View>

            {/* Defending */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Defending</Text>

              {/* Circular Progress for Success Rates */}
              <View style={styles.circularProgressRow}>
                <CircularProgress percentage={statistics.defending.tackle_success_percentage.our_team} label="Tackle Success %" />
                <CircularProgress percentage={statistics.defending.tackle_success_percentage.opponent} label="Opp Success %" />
              </View>

              <StatBar label="Total Tackles" homeValue={statistics.defending.total_tackles.our_team} awayValue={statistics.defending.total_tackles.opponent} />
              <StatBar label="Interceptions" homeValue={statistics.defending.interceptions.our_team} awayValue={statistics.defending.interceptions.opponent} />
              <StatBar label="Ball Recoveries" homeValue={statistics.defending.ball_recoveries.our_team} awayValue={statistics.defending.ball_recoveries.opponent} />
              <StatBar label="Goalkeeper Saves" homeValue={statistics.defending.goalkeeper_saves.our_team} awayValue={statistics.defending.goalkeeper_saves.opponent} />
            </View>
          </View>
        )}

        {activeTab === 'lineup' && (
          <View style={styles.tabContent}>
            {/* Our Team Lineup */}
            <View style={styles.lineupSection}>
              <Text style={styles.lineupTeamName}>{teams.our_club.club_name}</Text>
              <Text style={styles.lineupSubtitle}>Starting XI</Text>
              {lineup.our_team.length === 0 ? (
                <Text style={styles.noDataText}>No lineup available</Text>
              ) : (
                lineup.our_team.map((player: OurTeamPlayer) => (
                  <PlayerListItem key={player.player_id} player={player} isHomeTeam={true} />
                ))
              )}
            </View>

            {/* Opponent Team Lineup */}
            <View style={styles.lineupSection}>
              <Text style={styles.lineupTeamName}>{teams.opponent.opponent_name}</Text>
              <Text style={styles.lineupSubtitle}>Starting XI</Text>
              {lineup.opponent_team.length === 0 ? (
                <Text style={styles.noDataText}>No lineup available</Text>
              ) : (
                lineup.opponent_team.map((player: OpponentPlayer) => (
                  <PlayerListItem key={player.opponent_player_id} player={player} isHomeTeam={false} />
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  matchInfoSection: {
    padding: 20,
    alignItems: 'center',
  },
  matchDate: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamLogoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  teamLogoText: {
    fontSize: 32,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  teamName: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    textAlign: 'center',
  },
  scoreSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  scoreDivider: {
    fontSize: 48,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textSecondary,
    marginHorizontal: 12,
  },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.text,
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  tabContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  goalScorerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  goalScorerName: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  goalScorerTime: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  dummyText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  // Statistics Styles
  statsSection: {
    marginBottom: 24,
  },
  statsSectionTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 16,
  },
  // Ball Possession Styles
  possessionContainer: {
    marginBottom: 16,
  },
  possessionLabel: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  possessionBar: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  possessionFillHome: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  possessionFillAway: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  possessionText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  // Stat Bar Styles
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statBarValue: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    width: 40,
    textAlign: 'center',
  },
  statBarContent: {
    flex: 1,
    marginHorizontal: 12,
  },
  statBarLabel: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  barBackground: {
    flexDirection: 'row',
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFillHome: {
    backgroundColor: COLORS.primary,
    height: '100%',
  },
  barFillAway: {
    backgroundColor: COLORS.textSecondary,
    height: '100%',
  },
  // Circular Progress Styles
  circularProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  circularProgress: {
    borderRadius: 100,
    borderWidth: 8,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  circularProgressInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  circularProgressLabel: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Lineup Styles
  lineupSection: {
    marginBottom: 32,
  },
  lineupTeamName: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 4,
  },
  lineupSubtitle: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerAvatarText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  playerName: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  playerPosition: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
});

export default MatchDetailScreen;
