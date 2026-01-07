import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/common';
import { COLORS } from '../../constants';
import { UserRole } from '../../types';

type Props = NativeStackScreenProps<any, 'RegistrationSuccess'>;

interface RegistrationData {
  name: string;
  role: UserRole;
  clubName: string;
  // For Coach
  teamLevel?: string;
  // For Player
  jerseyNumber?: string;
  position?: string;
  age?: number;
}

export const RegistrationSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const data = route.params as RegistrationData;

  const getClubInitial = (clubName: string) => {
    return clubName?.charAt(0).toUpperCase() || 'C';
  };

  const handleGoToDashboard = () => {
    // Navigation will be handled by RootNavigator based on auth state
    // This just clears the auth stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
      </View>

      {/* Welcome Message */}
      <Text style={styles.title}>Welcome, {data.name}!</Text>
      <Text style={styles.subtitle}>
        Your account is all set up and ready to go.
      </Text>

      {/* Club Card */}
      <View style={styles.card}>
        {/* Club Avatar */}
        <View style={styles.clubAvatar}>
          <Text style={styles.clubAvatarText}>{getClubInitial(data.clubName)}</Text>
        </View>

        {/* Club Name */}
        <Text style={styles.clubName}>{data.clubName}</Text>

        <View style={styles.divider} />

        {/* Role-specific Information */}
        {data.role === UserRole.COACH ? (
          // Coach Info
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Coach</Text>
              <Text style={styles.infoValue}>{data.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Team</Text>
              <Text style={styles.infoValue}>{data.teamLevel || 'U16'}</Text>
            </View>
          </>
        ) : (
          // Player Info
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Jersey Number</Text>
              <Text style={styles.infoValue}>#{data.jerseyNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>{data.position}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{data.age} years</Text>
            </View>
          </>
        )}
      </View>

      {/* Go to Dashboard Button */}
      <Button
        title="Go to Dashboard"
        onPress={handleGoToDashboard}
        fullWidth
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 32,
    alignItems: 'center',
  },
  clubAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  clubAvatarText: {
    fontSize: 32,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  clubName: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  button: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
