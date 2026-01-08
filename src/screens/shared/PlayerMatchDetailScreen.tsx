import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { useCoachPlayerMatchDetail } from '../../api/queries/coach.queries';
import { usePlayerMatchDetail } from '../../api/queries/player.queries';
import { Loading } from '../../components/common/Loading';
import {
  PlayerMatchDetailResponse,
  PlayerMatchAttackingStats,
  PlayerMatchPassingStats,
  PlayerMatchDefendingStats,
} from '../../types';

// Route params type
type PlayerMatchDetailRouteParams = {
  PlayerMatchDetail: {
    matchId: string;
    playerId?: string; // Optional - only present for coach view
  };
};

interface StatRow {
  label: string;
  value: string | number;
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

// Helper to convert API stats to StatRow array
const mapAttackingStats = (stats: PlayerMatchAttackingStats): StatRow[] => [
  { label: 'Goals', value: stats.goals },
  { label: 'Assists', value: stats.assists },
  { label: 'Expected Goals (xG)', value: stats.xg },
  { label: 'Total Shots', value: stats.total_shots },
  { label: 'Shots on Target', value: stats.shots_on_target },
  { label: 'Total Dribbles', value: stats.total_dribbles },
  { label: 'Successful Dribbles', value: stats.successful_dribbles },
];

const mapPassingStats = (stats: PlayerMatchPassingStats): StatRow[] => [
  { label: 'Total Passes', value: stats.total_passes },
  { label: 'Passes Completed', value: stats.passes_completed },
  { label: 'Short Passes', value: stats.short_passes },
  { label: 'Long Passes', value: stats.long_passes },
  { label: 'Final Third', value: stats.final_third },
  { label: 'Crosses', value: stats.crosses },
];

const mapDefendingStats = (stats: PlayerMatchDefendingStats): StatRow[] => [
  { label: 'Tackles', value: stats.tackles },
  { label: 'Tackle Success %', value: `${stats.tackle_success_rate}%` },
  { label: 'Interceptions', value: stats.interceptions },
  { label: 'Interception Success %', value: `${stats.interception_success_rate}%` },
];

const PlayerMatchDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PlayerMatchDetailRouteParams, 'PlayerMatchDetail'>>();

  // Get route params - playerId is only present for coach view
  const { matchId, playerId } = route.params || {};
  const isCoachView = !!playerId;

  // Use the appropriate hook based on view type
  // Coach view: fetch player's stats in a match from coach endpoint
  // Player view: fetch own stats in a match from player endpoint
  const coachQuery = useCoachPlayerMatchDetail(playerId || '', matchId || '');
  const playerQuery = usePlayerMatchDetail(matchId || '');

  // Select the appropriate query result
  const { data, isLoading, error, refetch, isRefetching } = isCoachView ? coachQuery : playerQuery;

  // Helper to get player contribution text
  const getPlayerContribution = (goals: number, assists: number) => {
    const parts = [];
    if (goals > 0) {
      parts.push(`${goals} Goal${goals > 1 ? 's' : ''}`);
    }
    if (assists > 0) {
      parts.push(`${assists} Assist${assists > 1 ? 's' : ''}`);
    }
    return parts.length > 0 ? parts.join(' • ') : 'No goals or assists';
  };

  const renderStatSection = (title: string, stats: StatRow[]) => (
    <View style={styles.statsSection}>
      <Text style={styles.statsSectionTitle}>{title}</Text>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statRow,
              index === stats.length - 1 && styles.statRowLast
            ]}
          >
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Handle loading state
  if (isLoading) {
    return <Loading message="Loading match stats..." />;
  }

  // Handle error or missing data
  if (error || !data || !matchId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load match statistics</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </View>
    );
  }

  // Extract data from API response
  const { match, teams, player_summary, statistics } = data;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
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
              <Text style={styles.teamName} numberOfLines={2}>{teams.our_club.club_name}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{match.our_score}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreText}>{match.opponent_score}</Text>
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
              <Text style={styles.teamName} numberOfLines={2}>{teams.opponent.opponent_name}</Text>
            </View>
          </View>
        </View>

        {/* Player Contribution */}
        <View style={styles.playerContributionSection}>
          <Text style={styles.playerName}>{player_summary.player_name}</Text>
          <Text style={styles.playerContribution}>
            {getPlayerContribution(player_summary.goals, player_summary.assists)}
          </Text>
        </View>

        {/* Stats Sections */}
        <View style={styles.statsContent}>
          {renderStatSection('Attacking', mapAttackingStats(statistics.attacking))}
          {renderStatSection('Passing', mapPassingStats(statistics.passing))}
          {renderStatSection('Defending', mapDefendingStats(statistics.defending))}
        </View>
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
  // Match Info Section
  matchInfoSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamLogoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  teamLogoText: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  teamName: {
    fontSize: 12,
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
  },
  scoreText: {
    fontSize: 36,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  scoreDivider: {
    fontSize: 36,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textSecondary,
    marginHorizontal: 10,
  },
  // Player Contribution Section
  playerContributionSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.backgroundSecondary,
  },
  playerName: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 4,
  },
  playerContribution: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
  // Stats Content
  statsContent: {
    padding: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsSectionTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
});

export default PlayerMatchDetailScreen;
