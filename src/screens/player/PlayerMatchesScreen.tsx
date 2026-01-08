import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants';
import { PLAYER_ROUTES } from '../../constants/routes';
import { usePlayerMatches } from '../../api/queries/player.queries';

type PlayerStackParamList = {
  [PLAYER_ROUTES.MATCH_DETAIL]: { matchId: string };
};

const PlayerMatchesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PlayerStackParamList>>();
  const { data, isLoading, error } = usePlayerMatches();

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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load matches</Text>
      </View>
    );
  }

  const matches = data?.matches || [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Match History</Text>

        {matches.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="football-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>No matches yet</Text>
          </View>
        ) : (
          <View style={styles.matchHistoryList}>
            {matches.map((match) => {
              const result = getMatchResult(match.result);
              return (
                <TouchableOpacity
                  key={match.match_id}
                  style={[
                    styles.matchHistoryCard,
                    { backgroundColor: getResultBackgroundColor(result) },
                  ]}
                  onPress={() => navigation.navigate(PLAYER_ROUTES.MATCH_DETAIL, { matchId: match.match_id })}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginTop: 16,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 20,
  },
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
});

export default PlayerMatchesScreen;
