import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../hooks';

const PlayerProfileScreen: React.FC = () => {
  const { logout } = useAuth();

  // Mock player data - will come from auth context or API
  const profile = {
    name: 'Marcus Silva',
    jerseyNumber: 10,
    club: 'Thunder United FC',
    position: 'Forward',
    email: 'marcus@example.com',
    birthdate: '15/3/2002',
    height: "5'11\"",
  };

  const personalStats = {
    matchesPlayed: 12,
    goals: 8,
    assists: 5,
  };

  const handleLogOut = () => {
    logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.jerseyNumber}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.position}>#{profile.jerseyNumber} • {profile.position}</Text>
          <Text style={styles.club}>{profile.club}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.email}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Birthdate</Text>
              <Text style={styles.infoValue}>{profile.birthdate}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{profile.height}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>{profile.position}</Text>
            </View>
          </View>
        </View>

        {/* Season Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Season Stats</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalStats.matchesPlayed}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalStats.goals}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{personalStats.assists}</Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.textOnPrimary} style={styles.logOutIcon} />
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 45,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  name: {
    fontSize: 22,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 4,
  },
  position: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
    marginBottom: 4,
  },
  club: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  logOutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 30,
    width: '100%',
  },
  logOutIcon: {
    marginRight: 8,
  },
  logOutText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
});

export default PlayerProfileScreen;
