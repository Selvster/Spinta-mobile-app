import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';

interface StatRow {
  label: string;
  value: string | number;
}

interface MatchData {
  id: string;
  date: string;
  homeTeam: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamLogo: string;
  homeScore: number;
  awayScore: number;
}

interface PlayerMatchStats {
  playerName: string;
  goals: number;
  assists: number;
  attacking: StatRow[];
  passing: StatRow[];
  defending: StatRow[];
}

const PlayerMatchDetailScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock data - will be replaced with actual data from navigation params
  const matchData: MatchData = {
    id: '1',
    date: 'Oct 8, 2025',
    homeTeam: 'Thunder United FC',
    homeTeamLogo: 'T',
    awayTeam: 'City Strikers',
    awayTeamLogo: 'C',
    homeScore: 3,
    awayScore: 2,
  };

  const playerStats: PlayerMatchStats = {
    playerName: 'Marcus Silva',
    goals: 2,
    assists: 1,
    attacking: [
      { label: 'Goals', value: 2 },
      { label: 'Assists', value: 1 },
      { label: 'Expected Goals (xG)', value: 1.8 },
      { label: 'Total Shots', value: 5 },
      { label: 'Shots on Target', value: 4 },
      { label: 'Total Dribbles', value: 6 },
      { label: 'Successful Dribbles', value: 4 },
    ],
    passing: [
      { label: 'Total Passes', value: 32 },
      { label: 'Passes Completed', value: 28 },
      { label: 'Short Passes', value: 24 },
      { label: 'Long Passes', value: 8 },
      { label: 'Final Third', value: 12 },
      { label: 'Crosses', value: 3 },
    ],
    defending: [
      { label: 'Tackles', value: 2 },
      { label: 'Tackle Success %', value: '100%' },
      { label: 'Interceptions', value: 1 },
      { label: 'Interception Success %', value: '100%' },
    ],
  };

  const getPlayerContribution = () => {
    const parts = [];
    if (playerStats.goals > 0) {
      parts.push(`${playerStats.goals} Goal${playerStats.goals > 1 ? 's' : ''}`);
    }
    if (playerStats.assists > 0) {
      parts.push(`${playerStats.assists} Assist${playerStats.assists > 1 ? 's' : ''}`);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Match Info Section */}
        <View style={styles.matchInfoSection}>
          <Text style={styles.matchDate}>{matchData.date}</Text>

          {/* Teams and Score */}
          <View style={styles.teamsContainer}>
            {/* Home Team */}
            <View style={styles.teamSection}>
              <View style={[styles.teamLogo, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.teamLogoText}>{matchData.homeTeamLogo}</Text>
              </View>
              <Text style={styles.teamName} numberOfLines={2}>{matchData.homeTeam}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{matchData.homeScore}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreText}>{matchData.awayScore}</Text>
              </View>
            </View>

            {/* Away Team */}
            <View style={styles.teamSection}>
              <View style={[styles.teamLogo, { backgroundColor: COLORS.secondary }]}>
                <Text style={styles.teamLogoText}>{matchData.awayTeamLogo}</Text>
              </View>
              <Text style={styles.teamName} numberOfLines={2}>{matchData.awayTeam}</Text>
            </View>
          </View>
        </View>

        {/* Player Contribution */}
        <View style={styles.playerContributionSection}>
          <Text style={styles.playerName}>{playerStats.playerName}</Text>
          <Text style={styles.playerContribution}>{getPlayerContribution()}</Text>
        </View>

        {/* Stats Sections */}
        <View style={styles.statsContent}>
          {renderStatSection('Attacking', playerStats.attacking)}
          {renderStatSection('Passing', playerStats.passing)}
          {renderStatSection('Defending', playerStats.defending)}
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
