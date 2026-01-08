// This component is deprecated.
// Use CoachRegistrationForm or PlayerRegistrationForm instead.
// Kept for backward compatibility.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { UserRole } from '../../types';

interface RegistrationFormProps {
  role: UserRole;
  onRegisterSuccess?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  role,
  onRegisterSuccess,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Please use the role-specific registration form.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  text: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
