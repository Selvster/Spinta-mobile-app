import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, FlatList } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../common';
import {
  coachRegistrationSchema,
  CoachRegistrationFormData,
  convertDateToISO,
} from '../../utils/validators';
import { useRegisterCoach } from '../../api/mutations/auth.mutations';
import { COLORS } from '../../constants';

interface CoachRegistrationFormProps {
  onRegisterSuccess?: () => void;
}

type CoachStep = 'basic' | 'club';

const AGE_GROUP_OPTIONS = [
  { label: 'U6', value: 'U6' },
  { label: 'U8', value: 'U8' },
  { label: 'U10', value: 'U10' },
  { label: 'U12', value: 'U12' },
  { label: 'U14', value: 'U14' },
  { label: 'U16', value: 'U16' },
  { label: 'U18', value: 'U18' },
  { label: 'U21', value: 'U21' },
  { label: 'Senior (18+)', value: 'Senior' },
];

export const CoachRegistrationForm: React.FC<CoachRegistrationFormProps> = ({
  onRegisterSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<CoachStep>('basic');
  const [showAgeGroupPicker, setShowAgeGroupPicker] = useState(false);

  const registerCoachMutation = useRegisterCoach();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CoachRegistrationFormData>({
    resolver: zodResolver(coachRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      birth_date: '',
      gender: '',
      club: {
        club_name: '',
        country: '',
        age_group: '',
        stadium: '',
        logo_url: '',
      },
    },
  });

  const handleNext = async () => {
    const isValid = await trigger(['full_name', 'email', 'password', 'confirmPassword']);
    if (isValid) {
      setCurrentStep('club');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'club') {
      setCurrentStep('basic');
    }
  };

  const handleImagePick = () => {
    Alert.alert(
      'Image Upload',
      'Image picker will be implemented here. You can add expo-image-picker library for full functionality.',
      [{ text: 'OK' }]
    );
  };

  const onSubmit = async (data: CoachRegistrationFormData) => {
    try {
      // Convert date to ISO format if provided
      const birthDate = data.birth_date ? convertDateToISO(data.birth_date) : undefined;

      await registerCoachMutation.mutateAsync({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        birth_date: birthDate,
        gender: data.gender || undefined,
        club: {
          club_name: data.club.club_name,
          country: data.club.country || undefined,
          age_group: data.club.age_group || undefined,
          stadium: data.club.stadium || undefined,
          logo_url: data.club.logo_url || undefined,
        },
      });
      onRegisterSuccess?.();
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      Alert.alert('Registration Failed', message);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'basic', label: 'Coach Info' },
      { key: 'club', label: 'Club Info' },
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
      <Text style={styles.title}>Coach Registration</Text>
      <Text style={styles.subtitle}>
        {currentStep === 'basic' && 'Tell us about yourself'}
        {currentStep === 'club' && 'Tell us about your club'}
      </Text>

      {renderStepIndicator()}

      <View style={styles.formContainer}>
        {currentStep === 'basic' && (
          <>
            <Controller
              control={control}
              name="full_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.full_name?.message}
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
                  placeholder="Create a password (min 8 characters)"
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
              name="birth_date"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Date of Birth (Optional)"
                  placeholder="DD/MM/YYYY"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.birth_date?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Gender (Optional)"
                  placeholder="Male / Female / Other"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.gender?.message}
                />
              )}
            />
          </>
        )}

        {currentStep === 'club' && (
          <>
            <View style={styles.uploadContainer}>
              <Text style={styles.uploadLabel}>Club Logo (Optional)</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePick}
              >
                <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
                <Text style={styles.uploadButtonText}>Upload Image</Text>
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="club.club_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Club Name"
                  placeholder="Enter club name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.club?.club_name?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="club.country"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Country (Optional)"
                  placeholder="Enter country"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.club?.country?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="club.age_group"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text style={styles.uploadLabel}>Age Group / Level (Optional)</Text>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowAgeGroupPicker(true)}
                  >
                    <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
                      {value || 'Select age group'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>

                  <Modal
                    visible={showAgeGroupPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowAgeGroupPicker(false)}
                  >
                    <TouchableOpacity
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setShowAgeGroupPicker(false)}
                    >
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Select Age Group</Text>
                          <TouchableOpacity onPress={() => setShowAgeGroupPicker(false)}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                          </TouchableOpacity>
                        </View>
                        <FlatList
                          data={AGE_GROUP_OPTIONS}
                          keyExtractor={(item) => item.value}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.optionItem}
                              onPress={() => {
                                onChange(item.value);
                                setShowAgeGroupPicker(false);
                              }}
                            >
                              <Text style={styles.optionText}>{item.label}</Text>
                              {value === item.value && (
                                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                              )}
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              )}
            />

            <Controller
              control={control}
              name="club.stadium"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Stadium (Optional)"
                  placeholder="Enter stadium name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.club?.stadium?.message}
                  autoCapitalize="words"
                />
              )}
            />
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {currentStep === 'basic' ? (
          <Button
            title="Next"
            onPress={handleNext}
            fullWidth
          />
        ) : (
          <>
            <Button
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              style={styles.previousButton}
              disabled={registerCoachMutation.isPending}
            />
            <Button
              title={registerCoachMutation.isPending ? 'Creating...' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              style={styles.nextButton}
              disabled={registerCoachMutation.isPending}
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
  uploadContainer: {
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.primary,
    marginLeft: 8,
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
  dropdownButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  dropdownPlaceholder: {
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.backgroundSecondary,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
});
