import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert, Modal, Animated, Easing, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '../../constants';
import { COACH_ROUTES } from '../../constants/routes';
import { AttributeRadar, Attribute } from '../../components/coach';
import { useCoachPlayerDetail } from '../../api/queries/coach.queries';
import { useGenerateAIPlan } from '../../api/mutations/coach.mutations';
import { AIGeneratedPlanResponse } from '../../types';

type TabType = 'summary' | 'matches' | 'training';

type PlayerDetailRouteParams = {
  PlayerDetail: { playerId: string };
};

type CoachStackParamList = {
  [COACH_ROUTES.TRAINING_PLAN_DETAIL]: { planId: string };
  [COACH_ROUTES.CREATE_TRAINING_PLAN]: { playerId: string; aiGeneratedPlan: AIGeneratedPlanResponse };
  [COACH_ROUTES.PLAYER_MATCH_DETAIL]: { playerId: string; matchId: string };
};

interface StatRow {
  label: string;
  value: string | number;
}

const AI_LOADING_MESSAGES = [
  'Getting player stats...',
  'Analyzing player weaknesses...',
  'Finding optimal training exercises...',
  'Building personalized plan...',
];

const PlayerDetailScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CoachStackParamList>>();
  const route = useRoute<RouteProp<PlayerDetailRouteParams, 'PlayerDetail'>>();
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [showAILoading, setShowAILoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Get playerId from route params
  const playerId = route.params?.playerId;
  const { data, isLoading, error } = useCoachPlayerDetail(playerId || '');

  // AI plan generation mutation
  const generateAIPlan = useGenerateAIPlan();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading player details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load player details</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { player, invite_code, attributes, season_statistics, matches, training_plans } = data;
  const isPendingPlayer = !player.is_linked;

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

  const handleCopyCode = async () => {
    if (invite_code) {
      await Clipboard.setStringAsync(invite_code);
      Alert.alert('Copied!', 'Invitation code copied to clipboard');
    }
  };

  const handleShareCode = async () => {
    if (invite_code) {
      try {
        await Share.share({
          message: `Join my team on Spinta! Use this invitation code: ${invite_code}`,
        });
      } catch (error) {
        console.error('Error sharing code:', error);
      }
    }
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

  // Start spinning animation for loading
  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleCreateTrainingPlan = () => {
    setShowAILoading(true);
    setCurrentMessageIndex(0);
    startSpinAnimation();

    // Rotate through messages while API is called
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % AI_LOADING_MESSAGES.length;
      setCurrentMessageIndex(messageIndex);
    }, 1250);

    // Call the AI plan generation API
    generateAIPlan.mutate(
      { player_id: player.player_id },
      {
        onSuccess: (aiPlan) => {
          clearInterval(messageInterval);
          setShowAILoading(false);
          setCurrentMessageIndex(0);
          navigation.navigate(COACH_ROUTES.CREATE_TRAINING_PLAN, {
            playerId: player.player_id,
            aiGeneratedPlan: aiPlan,
          });
        },
        onError: () => {
          clearInterval(messageInterval);
          setShowAILoading(false);
          setCurrentMessageIndex(0);
          Alert.alert('Error', 'Failed to generate training plan. Please try again.');
        },
      }
    );
  };

  // Helper to format match result from API result code
  const getMatchResult = (result: 'W' | 'D' | 'L'): 'Win' | 'Draw' | 'Loss' => {
    switch (result) {
      case 'W': return 'Win';
      case 'L': return 'Loss';
      case 'D': return 'Draw';
    }
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper to map training plan status
  const mapPlanStatus = (status: string): 'Completed' | 'In Progress' | 'Not Started' => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
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
            <Text style={styles.largeAvatarText}>{player.jersey_number}</Text>
          </View>

          {/* Player Name */}
          <Text style={styles.playerName}>{player.player_name}</Text>

          {/* For Joined Players: Show Jersey • Height • Age */}
          {!isPendingPlayer && (
            <Text style={styles.playerDetails}>
              #{player.jersey_number}{player.height ? ` • ${player.height}cm` : ''}{player.age ? ` • ${player.age}` : ''}
            </Text>
          )}

          {/* Status Badge - Only show for Pending players */}
          {isPendingPlayer && (
            <View style={[styles.statusBadge, { backgroundColor: COLORS.warning }]}>
              <Text style={styles.statusText}>Pending Invitation</Text>
            </View>
          )}
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
            {/* Player Stats Code - Only for Pending Players */}
            {isPendingPlayer && invite_code && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Player Stats Code</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeText}>{invite_code}</Text>
                  <View style={styles.codeButtons}>
                    <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                      <Ionicons name="copy-outline" size={16} color={COLORS.text} />
                      <Text style={styles.copyButtonText}>Copy Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
                      <Ionicons name="share-outline" size={16} color={COLORS.textOnPrimary} />
                      <Text style={styles.shareButtonText}>Share Code</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

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
            {matches.matches.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="football-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>No matches yet</Text>
              </View>
            ) : (
              <View style={styles.matchHistoryList}>
                {matches.matches.map((match) => {
                  const result = getMatchResult(match.result);
                  return (
                    <TouchableOpacity
                      key={match.match_id}
                      style={[
                        styles.matchHistoryCard,
                        { backgroundColor: getResultBackgroundColor(result) },
                      ]}
                      onPress={() => navigation.navigate(COACH_ROUTES.PLAYER_MATCH_DETAIL, { playerId: player.player_id, matchId: match.match_id })}
                      activeOpacity={0.7}
                    >
                      <View style={styles.matchHistoryContent}>
                        <Text style={styles.matchHistoryDate}>{formatDate(match.match_date)}</Text>
                        <Text style={styles.matchHistoryTitle} numberOfLines={1}>
                          vs {match.opponent_name} ({match.our_score} - {match.opponent_score})
                        </Text>
                        <View style={styles.matchHistoryResult}>
                          <View
                            style={[
                              styles.matchResultDot,
                              { backgroundColor: getResultColor(result) },
                            ]}
                          />
                          <Text
                            style={[
                              styles.matchResultText,
                              { color: getResultColor(result) },
                            ]}
                          >
                            {result}
                          </Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {activeTab === 'training' && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Training Plans</Text>

            {/* AI Create Button */}
            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleCreateTrainingPlan}
              activeOpacity={0.8}
            >
              <Ionicons name="flash" size={20} color={COLORS.textOnPrimary} />
              <Text style={styles.aiButtonText}>Create Training Plan Using AI</Text>
            </TouchableOpacity>

            {/* Training Plans List */}
            {training_plans.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="fitness-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>No training plans yet</Text>
                <Text style={styles.emptyStateSubtext}>Create one using the AI button above</Text>
              </View>
            ) : (
              <View style={styles.trainingPlansList}>
                {training_plans.map((plan) => {
                  const status = mapPlanStatus(plan.status);
                  return (
                    <TouchableOpacity
                      key={plan.plan_id}
                      style={styles.trainingPlanCard}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate(COACH_ROUTES.TRAINING_PLAN_DETAIL, { planId: plan.plan_id })}
                    >
                      <View style={styles.trainingPlanContent}>
                        <Text style={styles.trainingPlanTitle}>{plan.plan_name}</Text>
                        <Text style={styles.trainingPlanDate}>{formatDate(plan.created_at)}</Text>
                      </View>
                      <View style={styles.trainingPlanRight}>
                        <View
                          style={[
                            styles.trainingStatusBadge,
                            { backgroundColor: getStatusColor(status) },
                          ]}
                        >
                          <Text style={styles.trainingStatusText}>{status}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* AI Loading Modal */}
      <Modal
        visible={showAILoading}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="flash" size={48} color={COLORS.primary} />
            </Animated.View>
            <Text style={styles.loadingTitle}>Creating Training Plan</Text>
            <Text style={styles.loadingMessage}>
              {AI_LOADING_MESSAGES[currentMessageIndex]}
            </Text>
            <View style={styles.loadingProgress}>
              {AI_LOADING_MESSAGES.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index <= currentMessageIndex && styles.progressDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  backButtonError: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  playerPosition: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
    marginBottom: 4,
  },
  playerDetails: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
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
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  shareButtonText: {
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
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
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
  // AI Loading Modal Styles
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
  },
  loadingTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  loadingMessage: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingProgress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
});

export default PlayerDetailScreen;
