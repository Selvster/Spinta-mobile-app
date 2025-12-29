import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '../common';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { useRegister } from '../../api/mutations/auth.mutations';
import { UserRole } from '../../types';

interface RegistrationFormProps {
  role: UserRole;
  onRegisterSuccess?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  role,
  onRegisterSuccess,
}) => {
  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role,
      position: '',
      certification: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      onRegisterSuccess?.();
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Unable to create account'
      );
    }
  };

  const isPlayer = role === UserRole.PLAYER;

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.lastName?.message}
            autoCapitalize="words"
          />
        )}
      />

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
            placeholder="Create a password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureTextEntry
            autoCapitalize="none"
          />
        )}
      />

      {isPlayer && (
        <Controller
          control={control}
          name="position"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Position (Optional)"
              placeholder="e.g., Forward, Midfielder"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.position?.message}
            />
          )}
        />
      )}

      {!isPlayer && (
        <Controller
          control={control}
          name="certification"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Certification (Optional)"
              placeholder="e.g., UEFA A License"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.certification?.message}
            />
          )}
        />
      )}

      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={registerMutation.isPending}
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
