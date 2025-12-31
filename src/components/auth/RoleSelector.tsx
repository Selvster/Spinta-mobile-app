import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../../types';
import { ROLE_CONFIG, COLORS } from '../../constants';
import { Card, Button } from '../common';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  selectedRole?: UserRole;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  onContinue,
  selectedRole,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Choose your role to get started
      </Text>

      <View style={styles.rolesContainer}>
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const isSelected = selectedRole === role;
          const iconName = role === UserRole.PLAYER ? 'football' : 'clipboard';
          const iconColor = isSelected ? COLORS.primary : COLORS.textSecondary;

          return (
            <TouchableOpacity
              key={role}
              onPress={() => onSelectRole(role as UserRole)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardSelected,
                ]}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={iconName} size={48} color={iconColor} />
                </View>
                <Text
                  style={[styles.roleLabel, isSelected && styles.roleLabelSelected]}
                >
                  {config.label}
                </Text>
                <Text style={styles.roleDescription}>
                  {config.description}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <Button
        title="Continue"
        onPress={onContinue}
        disabled={!selectedRole}
        fullWidth
        style={styles.continueButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    borderWidth: 3,
    borderColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: 24,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F0',
  },
  iconContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 22,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  roleLabelSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  continueButton: {
    marginTop: 24,
  },
});
