import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

interface Player {
  id: string;
  name: string;
  number: string;
  status: 'joined' | 'pending';
  avatar?: string;
}

const PlayersScreen: React.FC = () => {
  // Mock data - replace with real data later
  const totalPlayers = 5;
  const joinedPlayers = 3;
  const pendingPlayers = 2;

  const players: Player[] = [
    { id: '1', name: 'Marcus Silva', number: '#10', status: 'joined' },
    { id: '2', name: 'Jake Thompson', number: '#7', status: 'joined' },
    { id: '3', name: 'Player #23', number: '', status: 'pending' },
    { id: '4', name: 'David Chen', number: '#15', status: 'joined' },
    { id: '5', name: 'Player #9', number: '', status: 'pending' },
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
          <TouchableOpacity key={player.id} style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              {player.status === 'joined' ? (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color={COLORS.textSecondary} />
                </View>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              {player.status === 'joined' ? (
                <Text style={styles.playerNumber}>{player.number}</Text>
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
