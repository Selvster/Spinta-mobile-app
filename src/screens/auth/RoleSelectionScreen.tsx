import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { RegistrationForm } from '../../components/auth/RegistrationForm';
import { CoachRegistrationForm } from '../../components/auth/CoachRegistrationForm';
import { UserRole } from '../../types';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<any>;

type RegistrationStep = 'role' | 'details';

const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
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
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {currentStep === 'role' ? (
          <RoleSelector
            onSelectRole={setSelectedRole}
            onContinue={handleContinue}
            selectedRole={selectedRole}
          />
        ) : selectedRole === UserRole.COACH ? (
          <CoachRegistrationForm
            onRegisterSuccess={() => {}}
          />
        ) : (
          <RegistrationForm
            role={selectedRole!}
            onRegisterSuccess={() => {}}
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
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
});

export default RoleSelectionScreen;
