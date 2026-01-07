import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../constants';
import { AttributeRadar, Attribute } from '../../components/shared';

interface StatRow {
  label: string;
  value: string | number;
}

const PlayerHomeScreen: React.FC = () => {
  // Mock player data - will come from auth context or API
  const playerData = {
    name: 'Marcus Silva',
    jerseyNumber: 10,
    height: "5'11\"",
    age: 23,
    position: 'Forward',
  };

  const attributeScores: Attribute[] = [
    { label: 'PAC', value: 85, maxValue: 100 },
    { label: 'SHO', value: 78, maxValue: 100 },
    { label: 'PAS', value: 72, maxValue: 100 },
    { label: 'DRI', value: 80, maxValue: 100 },
    { label: 'DEF', value: 45, maxValue: 100 },
    { label: 'PHY', value: 68, maxValue: 100 },
  ];

  const seasonStats: StatRow[] = [
    { label: 'Matches Played', value: 12 },
    { label: 'Goals', value: 8 },
    { label: 'Assists', value: 5 },
    { label: 'Expected Goals (xG)', value: 6.5 },
    { label: 'Shots per Game', value: 2.7 },
    { label: 'Shots on Target per Game', value: 2.5 },
    { label: 'Total Passes', value: 450 },
    { label: 'Passes Completed', value: 385 },
    { label: 'Total Dribbles', value: 42 },
    { label: 'Successful Dribbles', value: 36 },
    { label: 'Tackles', value: 32 },
    { label: 'Tackle Success Rate', value: '78%' },
    { label: 'Interceptions', value: 18 },
    { label: 'Interceptions Success %', value: '75%' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Player Info Section */}
        <View style={styles.playerInfoSection}>
          <View style={styles.largeAvatar}>
            <Text style={styles.largeAvatarText}>{playerData.jerseyNumber}</Text>
          </View>
          <Text style={styles.playerName}>{playerData.name}</Text>
          <Text style={styles.playerDetails}>
            #{playerData.jerseyNumber} • {playerData.height} • {playerData.age} years
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
