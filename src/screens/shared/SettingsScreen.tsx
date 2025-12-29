import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/common';
import { COLORS } from '../../constants';
import { useAuth } from '../../hooks';

const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
        />
      </View>
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
    marginBottom: 24,
  },
  section: {
    marginTop: 'auto',
  },
});

export default SettingsScreen;
