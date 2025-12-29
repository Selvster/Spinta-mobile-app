import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRole } from '../../types';
import { ROLE_CONFIG, COLORS } from '../../constants';
import { Card } from '../common';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  selectedRole?: UserRole;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  selectedRole,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Text style={styles.subtitle}>
        Choose how you want to use the app
      </Text>

      <View style={styles.rolesContainer}>
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const isSelected = selectedRole === role;
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
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
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F0',
  },
  roleLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  roleLabelSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
