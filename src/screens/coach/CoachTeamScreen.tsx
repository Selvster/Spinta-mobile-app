import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const CoachTeamScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teams</Text>
      <Text style={styles.subtitle}>Manage your teams</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default CoachTeamScreen;
