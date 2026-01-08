import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { CoachRegistrationForm } from '../../components/auth/CoachRegistrationForm';
import { PlayerRegistrationForm } from '../../components/auth/PlayerRegistrationForm';
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

  const handleRegistrationSuccess = () => {
    // After successful registration, the auth store is updated
    // and the RootNavigator will automatically redirect to the main app
    // No need to navigate manually
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
            onRegisterSuccess={handleRegistrationSuccess}
          />
        ) : selectedRole === UserRole.PLAYER ? (
          <PlayerRegistrationForm
            onRegisterSuccess={handleRegistrationSuccess}
          />
        ) : null}
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
