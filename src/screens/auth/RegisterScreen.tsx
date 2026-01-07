import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { CoachRegistrationForm } from '../../components/auth/CoachRegistrationForm';
import { PlayerRegistrationForm } from '../../components/auth/PlayerRegistrationForm';
import { RegistrationForm } from '../../components/auth/RegistrationForm';
import { UserRole } from '../../types';
import { AUTH_ROUTES, COLORS } from '../../constants';

type Props = NativeStackScreenProps<any, typeof AUTH_ROUTES.REGISTER>;

type RegistrationStep = 'role' | 'details';

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('role');

  const handleContinue = () => {
    if (selectedRole) {
      setCurrentStep('details');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('role');
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {currentStep === 'role' && (
          <Image
            source={require('../../../assets/identity/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        )}

        {currentStep === 'role' ? (
          <RoleSelector
            onSelectRole={setSelectedRole}
            onContinue={handleContinue}
            selectedRole={selectedRole}
          />
        ) : selectedRole === UserRole.COACH ? (
          <CoachRegistrationForm
            onRegisterSuccess={(data) => {
              // Navigate to success screen with coach data
              navigation.navigate(AUTH_ROUTES.REGISTRATION_SUCCESS, {
                name: data.fullName || 'Coach',
                role: UserRole.COACH,
                clubName: data.clubName || 'Football Club',
                teamLevel: data.ageGroup || 'U16',
              });
            }}
          />
        ) : selectedRole === UserRole.PLAYER ? (
          <PlayerRegistrationForm
            onRegisterSuccess={(data) => {
              // Navigate to success screen with player data
              // Calculate age from dateOfBirth if available
              const age = data.dateOfBirth ?
                new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() :
                18;

              navigation.navigate(AUTH_ROUTES.REGISTRATION_SUCCESS, {
                name: data.playerName || 'Player',
                role: UserRole.PLAYER,
                clubName: 'FC Barcelona Youth', // From prefilled data
                jerseyNumber: '10', // From prefilled data
                position: 'Forward', // From prefilled data
                age,
              });
            }}
          />
        ) : (
          <RegistrationForm
            role={selectedRole!}
            onRegisterSuccess={(data) => {
              // Generic registration success
              navigation.navigate(AUTH_ROUTES.REGISTRATION_SUCCESS, {
                name: `${data.firstName} ${data.lastName}`,
                role: selectedRole!,
                clubName: 'Football Club',
              });
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
});

export default RegisterScreen;
