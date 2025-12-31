import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../common';
import { RegisterFormData } from '../../utils/validators';
import { COLORS } from '../../constants';

interface PlayerRegistrationFormProps {
  onRegisterSuccess?: (data: RegisterFormData) => void;
}

type PlayerStep = 'invitation' | 'info';

export const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onRegisterSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<PlayerStep>('invitation');
  const [invitationCode, setInvitationCode] = useState('');

  // Dummy prefilled data (would come from invitation code validation)
  const prefilledData = {
    playerName: 'John Smith',
    jerseyNumber: '10',
    position: 'Forward',
    club: 'FC Barcelona Youth',
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      height: '',
    },
  });

  const handleNextFromInvitation = () => {
    if (invitationCode.trim()) {
      // TODO: Validate invitation code with backend
      setCurrentStep('info');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'info') {
      setCurrentStep('invitation');
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    onRegisterSuccess?.(data);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'invitation', label: 'Join Club' },
      { key: 'info', label: 'Player Info' },
    ];
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.stepIndicator}>
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepDot,
                    index <= currentIndex && styles.stepDotActive,
                  ]}
                >
                  {index < currentIndex ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      index <= currentIndex && styles.stepNumberActive
                    ]}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  index <= currentIndex && styles.stepLabelActive
                ]}>
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < currentIndex && styles.stepLineActive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Registration</Text>
      <Text style={styles.subtitle}>
        {currentStep === 'invitation' && 'Enter your invitation code'}
        {currentStep === 'info' && 'Complete your profile'}
      </Text>

      {renderStepIndicator()}

      <View style={styles.formContainer}>
        {currentStep === 'invitation' && (
          <>
            <Input
              label="Invitation Code"
              placeholder="Enter code from your coach"
              value={invitationCode}
              onChangeText={setInvitationCode}
              autoCapitalize="characters"
            />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Ask your coach for the invitation code to join the club
              </Text>
            </View>
          </>
        )}

        {currentStep === 'info' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Club Information</Text>
              <Text style={styles.sectionSubtitle}>(Pre-filled from invitation)</Text>
            </View>

            <Input
              label="Player Name"
              value={prefilledData.playerName}
              editable={false}
              style={styles.disabledInput}
            />

            <Input
              label="Jersey Number"
              value={prefilledData.jerseyNumber}
              editable={false}
              style={styles.disabledInput}
            />

            <Input
              label="Position"
              value={prefilledData.position}
              editable={false}
              style={styles.disabledInput}
            />

            <Input
              label="Club"
              value={prefilledData.club}
              editable={false}
              style={styles.disabledInput}
            />

            <View style={styles.sectionDivider} />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

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

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Date of Birth"
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dateOfBirth?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="height"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Height (cm)"
                  placeholder="Enter your height"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.height?.message}
                  keyboardType="numeric"
                />
              )}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {currentStep === 'invitation' ? (
          <Button
            title="Next"
            onPress={handleNextFromInvitation}
            fullWidth
          />
        ) : (
          <>
            <Button
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              style={styles.previousButton}
            />
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              style={styles.nextButton}
            />
          </>
        )}
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
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  stepIndicatorContainer: {
    marginBottom: 32,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textSecondary,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stepLabelActive: {
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
  stepLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  formContainer: {
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },
  disabledInput: {
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  previousButton: {
    width: '48%',
  },
  nextButton: {
    width: '48%',
  },
});
