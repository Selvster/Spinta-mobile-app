import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants';
import { COACH_ROUTES } from '../../constants/routes';
import { useCoachPlayers } from '../../api/queries/coach.queries';

type CoachStackParamList = {
  [COACH_ROUTES.PLAYER_DETAIL]: { playerId: string };
};

const PlayersScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<CoachStackParamList>>();
  const { data, isLoading, error } = useCoachPlayers();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading players...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load players</Text>
      </View>
    );
  }

  const { summary, players } = data || { summary: { total_players: 0, joined: 0, pending: 0 }, players: [] };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Team Players</Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.primary }]}>
            {summary.total_players}
          </Text>
          <Text style={styles.summaryLabel}>Total Players</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.success }]}>
            {summary.joined}
          </Text>
          <Text style={styles.summaryLabel}>Joined</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>
            {summary.pending}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Players List */}
      <View style={styles.playersList}>
        {players.map((player) => (
          <TouchableOpacity
            key={player.player_id}
            style={styles.playerCard}
            onPress={() => navigation.navigate(COACH_ROUTES.PLAYER_DETAIL, { playerId: player.player_id })}
            activeOpacity={0.7}
          >
            <View style={styles.playerAvatar}>
              {player.profile_image_url ? (
                <Image
                  source={{ uri: player.profile_image_url }}
                  style={styles.avatarImage}
                />
              ) : player.is_linked ? (
                <View style={[styles.avatarPlaceholder, { backgroundColor: COLORS.primary }]}>
                  <Text style={styles.avatarText}>{player.jersey_number}</Text>
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.player_name}</Text>
              {player.is_linked ? (
                <Text style={styles.playerNumber}>#{player.jersey_number}</Text>
              ) : (
                <Text style={styles.pendingText}>Pending Invitation</Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
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
  title: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 20,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    fontSize: 32,
    fontFamily: 'FranklinGothic-Heavy',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  playersList: {
    gap: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  playerAvatar: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 2,
  },
  playerNumber: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  pendingText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.warning,
  },
});

export default PlayersScreen;
