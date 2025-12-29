import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { AUTH_ROUTES, COLORS } from '../../constants';

type Props = NativeStackScreenProps<any, typeof AUTH_ROUTES.REGISTER>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        First, select your role to get started
      </Text>

      <Button
        title="Choose Your Role"
        onPress={() => navigation.navigate(AUTH_ROUTES.ROLE_SELECTION)}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
});

export default RegisterScreen;
