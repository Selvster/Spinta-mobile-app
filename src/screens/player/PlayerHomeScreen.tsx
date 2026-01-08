import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { AttributeRadar, Attribute } from '../../components/shared';
import { usePlayerDashboard } from '../../api/queries/player.queries';

interface StatRow {
  label: string;
  value: string | number;
}

const PlayerHomeScreen: React.FC = () => {
  const { data, isLoading, error } = usePlayerDashboard();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your stats...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load your stats</Text>
      </View>
    );
  }

  const { player, attributes, season_statistics } = data;

  // Map API attributes to radar chart format
  const attributeScores: Attribute[] = [
    { label: 'ATK', value: attributes.attacking_rating, maxValue: 100 },
    { label: 'TEC', value: attributes.technique_rating, maxValue: 100 },
    { label: 'CRE', value: attributes.creativity_rating, maxValue: 100 },
    { label: 'TAC', value: attributes.tactical_rating, maxValue: 100 },
    { label: 'DEF', value: attributes.defending_rating, maxValue: 100 },
  ];

  // Build season stats from API response
  const seasonStats: StatRow[] = [
    { label: 'Matches Played', value: season_statistics.general.matches_played },
    { label: 'Goals', value: season_statistics.attacking.goals },
    { label: 'Assists', value: season_statistics.attacking.assists },
    { label: 'Expected Goals (xG)', value: season_statistics.attacking.expected_goals.toFixed(1) },
    { label: 'Shots per Game', value: season_statistics.attacking.shots_per_game.toFixed(1) },
    { label: 'Shots on Target per Game', value: season_statistics.attacking.shots_on_target_per_game.toFixed(1) },
    { label: 'Total Passes', value: season_statistics.passing.total_passes },
    { label: 'Passes Completed', value: season_statistics.passing.passes_completed },
    { label: 'Total Dribbles', value: season_statistics.dribbling.total_dribbles },
    { label: 'Successful Dribbles', value: season_statistics.dribbling.successful_dribbles },
    { label: 'Tackles', value: season_statistics.defending.tackles },
    { label: 'Tackle Success Rate', value: `${season_statistics.defending.tackle_success_rate}%` },
    { label: 'Interceptions', value: season_statistics.defending.interceptions },
    { label: 'Interceptions Success %', value: `${season_statistics.defending.interception_success_rate}%` },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Player Info Section */}
        <View style={styles.playerInfoSection}>
          <View style={styles.largeAvatar}>
            <Text style={styles.largeAvatarText}>{player.jersey_number}</Text>
          </View>
          <Text style={styles.playerName}>{player.player_name}</Text>
          <Text style={styles.playerDetails}>
            #{player.jersey_number}{player.height ? ` • ${player.height}cm` : ''}{player.age ? ` • ${player.age}` : ''}
          </Text>
        </View>

        {/* Attribute Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attribute Overview</Text>
          <AttributeRadar
            attributes={attributeScores}
            size={300}
            fillColor="rgba(255, 152, 0, 0.3)"
            strokeColor={COLORS.warning}
            gridColor={COLORS.border}
          />
        </View>

        {/* Season Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season Statistics</Text>
          <View style={styles.statsContainer}>
            {seasonStats.map((stat, index) => (
              <View
                key={index}
                style={[
                  styles.statRow,
                  index === seasonStats.length - 1 && styles.statRowLast,
                ]}
              >
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 45,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.error,
  },
  scrollContent: {
    flex: 1,
  },
  // Player Info Section
  playerInfoSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeAvatarText: {
    fontSize: 48,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  playerName: {
    fontSize: 20,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 8,
  },
  playerDetails: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  // Sections
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 16,
  },
  // Stats
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

export default PlayerHomeScreen;
