import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { PLAYER_ROUTES } from '../../constants/routes';

interface MatchHistoryItem {
  id: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  result: 'Win' | 'Draw' | 'Loss';
}

const PlayerMatchesScreen: React.FC = () => {
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Match History</Text>

        <View style={styles.matchHistoryList}>
          {matchHistory.map((match) => (
            <TouchableOpacity
              key={match.id}
              style={[
                styles.matchHistoryCard,
                { backgroundColor: getResultBackgroundColor(match.result) },
              ]}
              onPress={() => navigation.navigate(PLAYER_ROUTES.MATCH_DETAIL as never)}
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
