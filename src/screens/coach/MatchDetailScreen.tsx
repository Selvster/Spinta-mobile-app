import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants';

type TabType = 'summary' | 'statistics' | 'lineup';

interface GoalScorer {
  id: string;
  name: string;
  time: string;
  isHomeTeam: boolean;
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
  result: 'Win' | 'Loss' | 'Draw';
}

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

interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
}

interface PlayerListItemProps {
  player: Player;
  isHomeTeam: boolean;
}

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
          <Text style={styles.playerAvatarText}>{player.jerseyNumber}</Text>
        </View>
        <Text style={styles.playerName}>{player.name}</Text>
      </View>
      <Text style={styles.playerPosition}>{player.position}</Text>
    </View>
  );
};

const MatchDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('summary');

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
    result: 'Win',
  };

  const goalScorers: GoalScorer[] = [
    { id: '1', name: 'Marcus Silva', time: "23'", isHomeTeam: true },
    { id: '2', name: 'D. Martinez', time: "34'", isHomeTeam: false },
    { id: '3', name: 'Jake Thompson', time: "45'", isHomeTeam: true },
    { id: '4', name: 'R. Johnson', time: "67'", isHomeTeam: false },
    { id: '5', name: 'Marcus Silva', time: "78'", isHomeTeam: true },
  ];

  const homeTeamLineup: Player[] = [
    { id: '1', name: 'Alex Rodriguez', position: 'GK', jerseyNumber: 1 },
    { id: '2', name: 'Ryan Miller', position: 'DF', jerseyNumber: 2 },
    { id: '3', name: 'Tom Wilson', position: 'DF', jerseyNumber: 5 },
    { id: '4', name: 'Chris Brown', position: 'DF', jerseyNumber: 4 },
    { id: '5', name: 'Sam Davis', position: 'DF', jerseyNumber: 3 },
    { id: '6', name: 'Mike Johnson', position: 'MF', jerseyNumber: 6 },
    { id: '7', name: 'Paul Martinez', position: 'MF', jerseyNumber: 8 },
    { id: '8', name: 'David Chen', position: 'MF', jerseyNumber: 10 },
    { id: '9', name: 'Marcus Silva', position: 'FW', jerseyNumber: 9 },
    { id: '10', name: 'Jake Thompson', position: 'FW', jerseyNumber: 11 },
    { id: '11', name: 'Kevin Lee', position: 'FW', jerseyNumber: 7 },
  ];

  const awayTeamLineup: Player[] = [
    { id: '12', name: 'D. Martinez', position: 'GK', jerseyNumber: 1 },
    { id: '13', name: 'R. Johnson', position: 'DF', jerseyNumber: 2 },
    { id: '14', name: 'L. Garcia', position: 'DF', jerseyNumber: 3 },
    { id: '15', name: 'K. White', position: 'DF', jerseyNumber: 4 },
    { id: '16', name: 'P. Taylor', position: 'DF', jerseyNumber: 5 },
    { id: '17', name: 'T. Anderson', position: 'MF', jerseyNumber: 6 },
    { id: '18', name: 'J. Wilson', position: 'MF', jerseyNumber: 8 },
    { id: '19', name: 'M. Harris', position: 'MF', jerseyNumber: 10 },
    { id: '20', name: 'S. Brown', position: 'FW', jerseyNumber: 9 },
    { id: '21', name: 'P. Thompson', position: 'FW', jerseyNumber: 11 },
    { id: '22', name: 'A. Miller', position: 'FW', jerseyNumber: 7 },
  ];

  const getResultColor = () => {
    switch (matchData.result) {
      case 'Win':
        return COLORS.success;
      case 'Loss':
        return COLORS.error;
      case 'Draw':
        return COLORS.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back to Club</Text>
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
              <Text style={styles.teamName}>{matchData.homeTeam}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreSection}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{matchData.homeScore}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.scoreText}>{matchData.awayScore}</Text>
              </View>
              <View style={[styles.resultBadge, { backgroundColor: getResultColor() }]}>
                <Text style={styles.resultText}>{matchData.result}</Text>
              </View>
            </View>

            {/* Away Team */}
            <View style={styles.teamSection}>
              <View style={[styles.teamLogo, { backgroundColor: COLORS.secondary }]}>
                <Text style={styles.teamLogoText}>{matchData.awayTeamLogo}</Text>
              </View>
              <Text style={styles.teamName}>{matchData.awayTeam}</Text>
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
              {goalScorers.map((scorer) => (
                <View
                  key={scorer.id}
                  style={[
                    styles.goalScorerCard,
                    {
                      backgroundColor: scorer.isHomeTeam
                        ? 'rgba(52, 199, 89, 0.15)'
                        : 'rgba(255, 48, 0, 0.15)',
                    },
                  ]}
                >
                  <Text style={styles.goalScorerName}>{scorer.name}</Text>
                  <Text style={styles.goalScorerTime}>{scorer.time}</Text>
                </View>
              ))}
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
                  <View style={[styles.possessionFillHome, { width: '33%' }]}>
                    <Text style={styles.possessionText}>33%</Text>
                  </View>
                  <View style={[styles.possessionFillAway, { width: '67%' }]}>
                    <Text style={styles.possessionText}>67%</Text>
                  </View>
                </View>
              </View>

              <StatBar label="Expected Goals (xG)" homeValue={2.4} awayValue={1.8} />
              <StatBar label="Total Shots" homeValue={9} awayValue={11} />
              <StatBar label="Shots on Target" homeValue={6} awayValue={9} />
              <StatBar label="Total Passes" homeValue={5} awayValue={5} />
            </View>

            {/* Attacking */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Attacking</Text>
              <StatBar label="Total Shots" homeValue={9} awayValue={11} />
              <StatBar label="Shots on Target" homeValue={6} awayValue={9} />
              <StatBar label="Shots off Target" homeValue={3} awayValue={2} />
              <StatBar label="Total Dribbles" homeValue={8} awayValue={6} />
              <StatBar label="Successful Dribbles" homeValue={5} awayValue={4} />
            </View>

            {/* Passing */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Passing</Text>
              <StatBar label="Total Passes" homeValue={487} awayValue={412} />
              <StatBar label="Passes Completed" homeValue={402} awayValue={326} />
              <StatBar label="Passes in Opp Half" homeValue={142} awayValue={98} />
              <StatBar label="Long Passes" homeValue={8} awayValue={15} />
              <StatBar label="Crosses" homeValue={17} awayValue={12} />
            </View>

            {/* Defending */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Defending</Text>

              {/* Circular Progress for Success Rates */}
              <View style={styles.circularProgressRow}>
                <CircularProgress percentage={71} label="Tackle Success %" />
                <CircularProgress percentage={68.2} label="Opp Success %" />
              </View>

              <StatBar label="Total Tackles" homeValue={18} awayValue={22} />
              <StatBar label="Interceptions" homeValue={12} awayValue={8} />
              <StatBar label="Blocks" homeValue={8} awayValue={6} />
              <StatBar label="Goalkeeper Saves" homeValue={6} awayValue={42} />
            </View>
          </View>
        )}

        {activeTab === 'lineup' && (
          <View style={styles.tabContent}>
            {/* Home Team Lineup */}
            <View style={styles.lineupSection}>
              <Text style={styles.lineupTeamName}>{matchData.homeTeam}</Text>
              <Text style={styles.lineupSubtitle}>Starting XI</Text>
              {homeTeamLineup.map((player) => (
                <PlayerListItem key={player.id} player={player} isHomeTeam={true} />
              ))}
            </View>

            {/* Away Team Lineup */}
            <View style={styles.lineupSection}>
              <Text style={styles.lineupTeamName}>{matchData.awayTeam}</Text>
              <Text style={styles.lineupSubtitle}>Starting XI</Text>
              {awayTeamLineup.map((player) => (
                <PlayerListItem key={player.id} player={player} isHomeTeam={false} />
              ))}
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
