import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants';
import { COACH_ROUTES } from '../../constants/routes';
import { useCoachDashboard } from '../../api/queries/coach.queries';
import { Loading } from '../../components/common/Loading';
import { MatchResult, MatchBasic } from '../../types';

type TabType = 'summary' | 'statistics';

// Helper function to format date from "2025-10-08" to "Oct 8, 2025"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to format score
const formatScore = (ourScore: number, opponentScore: number): string => {
  return `${ourScore} - ${opponentScore}`;
};

// Helper function to parse team form string into array
const parseTeamForm = (formString: string): MatchResult[] => {
  return formString.split('').filter((c): c is MatchResult =>
    c === 'W' || c === 'D' || c === 'L'
  );
};

const StatRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const ClubScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Fetch dashboard data using TanStack Query + Axios
  const { data, isLoading, error, refetch, isRefetching } = useCoachDashboard();

  const getResultColor = (result: MatchResult) => {
    switch (result) {
      case 'W':
        return COLORS.success;
      case 'D':
        return COLORS.textSecondary;
      case 'L':
        return COLORS.error;
    }
  };

  const getResultText = (result: MatchResult) => {
    switch (result) {
      case 'W':
        return 'Win';
      case 'D':
        return 'Draw';
      case 'L':
        return 'Loss';
    }
  };

  // Handle loading state
  if (isLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  // Handle error state
  if (error || !data) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Failed to load dashboard</Text>
          <Text style={styles.errorSubtext}>Please try again later</Text>
        </View>
      </View>
    );
  }

  // Extract data from API response
  const clubName = data.club.club_name;
  const clubLogoUrl = data.club.logo_url;
  const coachName = `Coach: ${data.coach.full_name}`;
  const seasonRecord = data.season_record;
  const teamForm = parseTeamForm(data.team_form);
  const matches = data.matches.matches;
  const statistics = data.statistics;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {clubLogoUrl ? (
          <Image source={{ uri: clubLogoUrl }} style={styles.clubLogoImage} />
        ) : (
          <View style={styles.clubLogo}>
            <Text style={styles.clubLogoText}>{clubName.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.clubName}>{clubName}</Text>
          <Text style={styles.coachName}>{coachName}</Text>
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
        }>
        {activeTab === 'summary' && (
        <>
          {/* Season Record */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Season Record</Text>
            <View style={styles.recordContainer}>
              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.success }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.wins}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.recordText}>Wins</Text>
                </View>
              </View>

              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.textSecondary }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.draws}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.textSecondary }]} />
                  <Text style={styles.recordText}>Draws</Text>
                </View>
              </View>

              <View style={styles.recordItem}>
                <View style={[styles.recordBox, { backgroundColor: COLORS.error }]}>
                  <Text style={styles.recordNumber}>{seasonRecord.losses}</Text>
                </View>
                <View style={styles.recordLabel}>
                  <View style={[styles.recordDot, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.recordText}>Losses</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Team Form */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Team Form</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              {teamForm.map((result, index) => (
                <View
                  key={index}
                  style={[styles.formCircle, { backgroundColor: getResultColor(result) }]}
                >
                  <Text style={styles.formText}>{result}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Matches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Matches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {matches.map((match: MatchBasic) => (
              <TouchableOpacity
                key={match.match_id}
                style={styles.matchCard}
                onPress={() => navigation.navigate(COACH_ROUTES.MATCH_DETAIL, { matchId: match.match_id })}
                activeOpacity={0.7}
              >
                <View style={styles.matchContent}>
                  <Text style={styles.matchDate}>{formatDate(match.match_date)}</Text>
                  <View style={styles.matchInfo}>
                    <View style={[styles.resultDot, { backgroundColor: getResultColor(match.result) }]} />
                    <Text style={styles.matchTitle}>
                      {clubName} {formatScore(match.our_score, match.opponent_score)} {match.opponent_name}
                    </Text>
                  </View>
                  <Text style={[styles.matchResult, { color: getResultColor(match.result) }]}>
                    {getResultText(match.result)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

        {activeTab === 'statistics' && (
          <>
            {/* Season Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Season Summary</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Matches Played" value={String(statistics.season_summary.matches_played)} />
                <StatRow label="Goals Scored" value={String(statistics.season_summary.goals_scored)} />
                <StatRow label="Goals Conceded" value={String(statistics.season_summary.goals_conceded)} />
                <StatRow label="Total Assists" value={String(statistics.season_summary.total_assists)} />
              </View>
            </View>

            {/* Attacking */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attacking</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Avg Goals per Match" value={String(statistics.attacking.avg_goals_per_match)} />
                <StatRow label="Avg xG per Match" value={String(statistics.attacking.avg_xg_per_match)} />
                <StatRow label="Avg Total Shots" value={String(statistics.attacking.avg_total_shots)} />
                <StatRow label="Avg Shots on Target" value={String(statistics.attacking.avg_shots_on_target)} />
                <StatRow label="Avg Dribbles" value={String(statistics.attacking.avg_dribbles)} />
                <StatRow label="Avg Successful Dribbles" value={String(statistics.attacking.avg_successful_dribbles)} />
              </View>
            </View>

            {/* Passes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Passes</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Avg Possession %" value={`${statistics.passes.avg_possession_percentage}%`} />
                <StatRow label="Avg Passes" value={String(statistics.passes.avg_passes)} />
                <StatRow label="Pass Completion %" value={`${statistics.passes.pass_completion_percentage}%`} />
                <StatRow label="Avg Final Third Passes" value={String(statistics.passes.avg_final_third_passes)} />
                <StatRow label="Avg Crosses" value={String(statistics.passes.avg_crosses)} />
              </View>
            </View>

            {/* Defending */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Defending</Text>
              <View style={styles.statsContainer}>
                <StatRow label="Total Clean Sheets" value={String(statistics.defending.total_clean_sheets)} />
                <StatRow label="Avg Goals Conceded per Match" value={String(statistics.defending.avg_goals_conceded_per_match)} />
                <StatRow label="Avg Tackles" value={String(statistics.defending.avg_tackles)} />
                <StatRow label="Tackle Success %" value={`${statistics.defending.tackle_success_percentage}%`} />
                <StatRow label="Avg Interceptions" value={String(statistics.defending.avg_interceptions)} />
                <StatRow label="Interception Success %" value={`${statistics.defending.interception_success_percentage}%`} />
                <StatRow label="Avg Ball Recoveries" value={String(statistics.defending.avg_ball_recoveries)} />
                <StatRow label="Avg Saves per Match" value={String(statistics.defending.avg_saves_per_match)} />
              </View>
            </View>
          </>
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
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 45,
    backgroundColor: COLORS.background,
  },
  clubLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubLogoText: {
    fontSize: 28,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  clubLogoImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  clubName: {
    fontSize: 20,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  coachName: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 2,
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
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.primary,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  recordItem: {
    alignItems: 'center',
  },
  recordBox: {
    width: 80,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  recordNumber: {
    fontSize: 28,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  recordLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  recordText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  formContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  formCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  matchContent: {
    flex: 1,
  },
  matchDate: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  matchTitle: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    flex: 1,
  },
  matchResult: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
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
  statLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.primary,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
});

export default ClubScreen;
