import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { COACH_ROUTES } from '../../constants/routes';
import { AttributeRadar, Attribute } from '../../components/coach';

type TabType = 'summary' | 'matches' | 'training';

interface PlayerData {
  id: string;
  name: string;
  jerseyNumber: number;
  status: 'Active' | 'Pending Invitation';
  code: string;
}


interface StatRow {
  label: string;
  value: string | number;
}

interface MatchHistoryItem {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  result: 'Win' | 'Draw' | 'Loss';
}

interface TrainingPlan {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

const PlayerDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  // Mock data - will be replaced with actual data from navigation params
  const playerData: PlayerData = {
    id: '1',
    name: 'Player #23',
    jerseyNumber: 23,
    status: 'Pending Invitation',
    code: 'SP23TH003',
  };

  const attributeScores: Attribute[] = [
    { label: 'PAC', value: 100, maxValue: 100 },
    { label: 'SHO', value: 75, maxValue: 100 },
    { label: 'PAS', value: 50, maxValue: 100 },
    { label: 'DRI', value: 25, maxValue: 100 },
    { label: 'DEF', value: 75, maxValue: 100 },
    { label: 'PHY', value: 50, maxValue: 100 },
  ];

  const seasonStats: StatRow[] = [
    { label: 'Matches Played', value: 12 },
    { label: 'Goals', value: 8 },
    { label: 'Assists', value: 5 },
    { label: 'Expected Goals (xG)', value: 6.5 },
    { label: 'Total Shots', value: 32 },
    { label: 'Shots on Target per Game', value: 2.5 },
    { label: 'Total Passes', value: 450 },
    { label: 'Passes Completed', value: 385 },
    { label: 'Pass Success %', value: '85%' },
    { label: 'Successful Dribbles', value: 42 },
    { label: 'Fouls', value: 8 },
    { label: 'Tackles', value: 32 },
    { label: 'Interceptions', value: 18 },
    { label: 'Interceptions Success %', value: '75%' },
  ];

  const matchHistory: MatchHistoryItem[] = [
    {
      id: '1',
      date: 'Oct 8, 2025',
      homeTeam: 'Thunder United FC',
      awayTeam: 'City Strikers',
      homeScore: 3,
      awayScore: 2,
      result: 'Win',
    },
    {
      id: '2',
      date: 'Oct 5, 2025',
      homeTeam: 'Thunder United FC',
      awayTeam: 'Eagles FC',
      homeScore: 1,
      awayScore: 1,
      result: 'Draw',
    },
    {
      id: '3',
      date: 'Oct 1, 2025',
      homeTeam: 'Thunder United FC',
      awayTeam: 'Valley Rangers',
      homeScore: 2,
      awayScore: 0,
      result: 'Win',
    },
    {
      id: '4',
      date: 'Sep 28, 2025',
      homeTeam: 'Thunder United FC',
      awayTeam: 'Harbor United',
      homeScore: 1,
      awayScore: 3,
      result: 'Loss',
    },
    {
      id: '5',
      date: 'Sep 24, 2025',
      homeTeam: 'Thunder United FC',
      awayTeam: 'Phoenix FC',
      homeScore: 4,
      awayScore: 1,
      result: 'Win',
    },
  ];

  const trainingPlans: TrainingPlan[] = [
    {
      id: '1',
      title: 'Speed & Agility Development',
      date: 'Oct 7, 2025',
      status: 'Completed',
    },
    {
      id: '2',
      title: 'Shooting Accuracy Program',
      date: 'Oct 14, 2025',
      status: 'In Progress',
    },
  ];

  const handleCopyCode = () => {
    // Copy code to clipboard
    console.log('Code copied:', playerData.code);
  };

  const handleEditDetails = () => {
    // Navigate to edit screen or open modal
    console.log('Edit details');
  };

  const getResultColor = (result: 'Win' | 'Draw' | 'Loss') => {
    switch (result) {
      case 'Win':
        return COLORS.success;
      case 'Draw':
        return COLORS.textSecondary;
      case 'Loss':
        return COLORS.error;
    }
  };

  const getResultBackgroundColor = (result: 'Win' | 'Draw' | 'Loss') => {
    switch (result) {
      case 'Win':
        return 'rgba(52, 199, 89, 0.1)';
      case 'Draw':
        return 'rgba(102, 102, 102, 0.1)';
      case 'Loss':
        return 'rgba(255, 59, 48, 0.1)';
    }
  };

  const getStatusColor = (status: 'Completed' | 'In Progress' | 'Not Started') => {
    switch (status) {
      case 'Completed':
        return COLORS.success;
      case 'In Progress':
        return COLORS.warning;
      case 'Not Started':
        return COLORS.textSecondary;
    }
  };

  const handleCreateTrainingPlan = () => {
    // Navigate to AI training plan creation
    navigation.navigate(COACH_ROUTES.CREATE_TRAINING_PLAN as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back to Players</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Player Info Section */}
        <View style={styles.playerInfoSection}>
          {/* Large Avatar */}
          <View style={styles.largeAvatar}>
            <Text style={styles.largeAvatarText}>{playerData.jerseyNumber}</Text>
          </View>

          {/* Player Name */}
          <Text style={styles.playerName}>{playerData.name}</Text>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  playerData.status === 'Active'
                    ? COLORS.success
                    : COLORS.warning,
              },
            ]}
          >
            <Text style={styles.statusText}>{playerData.status}</Text>
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
            style={[styles.tab, activeTab === 'matches' && styles.tabActive]}
            onPress={() => setActiveTab('matches')}
          >
            <Text style={[styles.tabText, activeTab === 'matches' && styles.tabTextActive]}>
              Matches
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'training' && styles.tabActive]}
            onPress={() => setActiveTab('training')}
          >
            <Text style={[styles.tabText, activeTab === 'training' && styles.tabTextActive]}>
              Training
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <View style={styles.tabContent}>
            {/* Player Stats Code */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Player Stats Code</Text>
              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{playerData.code}</Text>
                <View style={styles.codeButtons}>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                    <Ionicons name="copy-outline" size={16} color={COLORS.text} />
                    <Text style={styles.copyButtonText}>Copy Code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.editButton} onPress={handleEditDetails}>
                    <Text style={styles.editButtonText}>Edit Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Attribute Scores */}
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
                  <View key={index} style={styles.statRow}>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'matches' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Match History</Text>
            <View style={styles.matchHistoryList}>
              {matchHistory.map((match) => (
                <TouchableOpacity
                  key={match.id}
                  style={[
                    styles.matchHistoryCard,
                    { backgroundColor: getResultBackgroundColor(match.result) },
                  ]}
                  onPress={() => navigation.navigate(COACH_ROUTES.MATCH_DETAIL as never)}
                  activeOpacity={0.7}
                >
                  <View style={styles.matchHistoryContent}>
                    <Text style={styles.matchHistoryDate}>{match.date}</Text>
                    <Text style={styles.matchHistoryTitle} numberOfLines={1}>
                      {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                    </Text>
                    <View style={styles.matchHistoryResult}>
                      <View
                        style={[
                          styles.matchResultDot,
                          { backgroundColor: getResultColor(match.result) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.matchResultText,
                          { color: getResultColor(match.result) },
                        ]}
                      >
                        {match.result}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'training' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Training Plans</Text>

            {/* AI Create Button */}
            <TouchableOpacity
              style={styles.aiButtonContainer}
              onPress={handleCreateTrainingPlan}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FFB800', '#FF6B00', '#FF3000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiButton}
              >
                <Ionicons name="flash" size={20} color={COLORS.textOnPrimary} />
                <Text style={styles.aiButtonText}>Create Training Plan Using AI</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Training Plans List */}
            <View style={styles.trainingPlansList}>
              {trainingPlans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.trainingPlanCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.trainingPlanContent}>
                    <Text style={styles.trainingPlanTitle}>{plan.title}</Text>
                    <Text style={styles.trainingPlanDate}>{plan.date}</Text>
                  </View>
                  <View style={styles.trainingPlanRight}>
                    <View
                      style={[
                        styles.trainingStatusBadge,
                        { backgroundColor: getStatusColor(plan.status) },
                      ]}
                    >
                      <Text style={styles.trainingStatusText}>{plan.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                  </View>
                </TouchableOpacity>
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
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 16,
  },
  // Code Section
  codeContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  codeText: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
  },
  codeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  copyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  // Stats Section
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
    color: COLORS.textSecondary,
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  dummyText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  // Match History Styles
  matchHistoryList: {
    gap: 12,
  },
  matchHistoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  matchHistoryContent: {
    flex: 1,
  },
  matchHistoryDate: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  matchHistoryTitle: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 6,
  },
  matchHistoryResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchResultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  matchResultText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
  },
  // Training Tab Styles
  aiButtonContainer: {
    marginBottom: 24,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  aiButtonText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  trainingPlansList: {
    gap: 16,
  },
  trainingPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  trainingPlanContent: {
    flex: 1,
  },
  trainingPlanTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 6,
  },
  trainingPlanDate: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  trainingPlanRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainingStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trainingStatusText: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
});

export default PlayerDetailScreen;
