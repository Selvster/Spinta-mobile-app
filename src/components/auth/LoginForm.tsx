import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '../common';
import { loginSchema, LoginFormData } from '../../utils/validators';
import { useLogin } from '../../api/mutations/auth.mutations';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const loginMutation = useLogin();
  const { setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Determine role based on email (temporary until backend is ready)
    // Use player@test.com for Player, any other email for Coach
    const isPlayerEmail = data.email.toLowerCase().includes('player');

    setUser({
      id: '1',
      email: data.email,
      firstName: 'Test',
      lastName: isPlayerEmail ? 'Player' : 'Coach',
      role: isPlayerEmail ? UserRole.PLAYER : UserRole.COACH,
      teamIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onLoginSuccess?.();

    // Original code (commented out for now):
    // try {
    //   await loginMutation.mutateAsync(data);
    //   onLoginSuccess?.();
    // } catch (error: any) {
    //   Alert.alert(
    //     'Login Failed',
    //     error.response?.data?.message || 'Invalid credentials'
    //   );
    // }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="Enter your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />

      <Button
        title="Log in"
        onPress={handleSubmit(onSubmit)}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
