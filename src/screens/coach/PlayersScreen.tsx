import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { COACH_ROUTES } from '../../constants/routes';

interface Player {
  id: string;
  name: string;
  jerseyNumber: number;
  status: 'Active' | 'Pending Invitation';
  code?: string;
  height?: string;
  age?: number;
  position?: string;
}

const PlayersScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock data - replace with real data later
  const totalPlayers = 5;
  const joinedPlayers = 3;
  const pendingPlayers = 2;

  const players: Player[] = [
    { id: '1', name: 'Marcus Silva', jerseyNumber: 10, status: 'Active', height: "5'11\"", age: 23, position: 'Forward' },
    { id: '2', name: 'Jake Thompson', jerseyNumber: 7, status: 'Active', height: "5'9\"", age: 21, position: 'Midfielder' },
    { id: '3', name: 'Player #23', jerseyNumber: 23, status: 'Pending Invitation', code: 'SP23TH003' },
    { id: '4', name: 'David Chen', jerseyNumber: 15, status: 'Active', height: "6'0\"", age: 22, position: 'Defender' },
    { id: '5', name: 'Player #9', jerseyNumber: 9, status: 'Pending Invitation', code: 'SP09TH005' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Team Players</Text>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.primary }]}>
            {totalPlayers}
          </Text>
          <Text style={styles.summaryLabel}>Total Players</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.success }]}>
            {joinedPlayers}
          </Text>
          <Text style={styles.summaryLabel}>Joined</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>
            {pendingPlayers}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      {/* Players List */}
      <View style={styles.playersList}>
        {players.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={styles.playerCard}
            onPress={() => navigation.navigate(COACH_ROUTES.PLAYER_DETAIL as never, { player } as never)}
            activeOpacity={0.7}
          >
            <View style={styles.playerAvatar}>
              {player.status === 'Active' ? (
                <View style={[styles.avatarPlaceholder, { backgroundColor: COLORS.primary }]}>
                  <Text style={styles.avatarText}>{player.jerseyNumber}</Text>
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              {player.status === 'Active' ? (
                <Text style={styles.playerNumber}>#{player.jerseyNumber} • {player.position}</Text>
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
