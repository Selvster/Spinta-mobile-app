import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { useAuth } from '../../hooks';
import { useCoachProfile } from '../../api/queries/coach.queries';
import { convertDateFromISO } from '../../utils/validators';

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { data, isLoading, error, refetch } = useCoachProfile();

  const handleLogOut = () => {
    logout();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profile = data?.coach;
  const club = data?.club;
  const clubStats = data?.club_stats;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.logoContainer}>
            {club?.logo_url ? (
              <Image
                source={{ uri: club.logo_url }}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../../assets/identity/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            )}
          </View>
          <Text style={styles.name}>{profile?.full_name || 'Coach'}</Text>
          <Text style={styles.club}>{club?.club_name || 'Club'}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile?.email || '-'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profile?.gender || '-'}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Birthdate</Text>
              <Text style={styles.infoValue}>
                {profile?.birth_date ? convertDateFromISO(profile.birth_date) : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Club Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club Stats</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clubStats?.total_players ?? 0}</Text>
              <Text style={styles.statLabel}>Total Players</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clubStats?.total_matches ?? 0}</Text>
              <Text style={styles.statLabel}>Total Matches</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clubStats?.win_rate_percentage ?? 0}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
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
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 22,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 4,
  },
  club: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 12,
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
    maxWidth: 400,
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

export default ProfileScreen;
