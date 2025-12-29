import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoleSelector } from '../../components/auth/RoleSelector';
import { RegistrationForm } from '../../components/auth/RegistrationForm';
import { UserRole } from '../../types';
import { COLORS } from '../../constants';

type Props = NativeStackScreenProps<any>;

const RoleSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!selectedRole ? (
          <RoleSelector
            onSelectRole={setSelectedRole}
            selectedRole={selectedRole}
          />
        ) : (
          <RegistrationForm
            role={selectedRole}
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
});

export default RoleSelectionScreen;
