import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common';
import { AUTH_ROUTES, COLORS } from '../../constants';

type Props = NativeStackScreenProps<any, typeof AUTH_ROUTES.WELCOME>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Spinta</Text>
      <Text style={styles.subtitle}>
        Track your training and connect with your team
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}
          fullWidth
          style={styles.button}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 26,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
});

export default WelcomeScreen;
