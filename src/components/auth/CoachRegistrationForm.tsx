import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../common';
import { RegisterFormData } from '../../utils/validators';
import { COLORS } from '../../constants';

interface CoachRegistrationFormProps {
  onRegisterSuccess?: (data: RegisterFormData) => void;
}

type CoachStep = 'basic' | 'club';

export const CoachRegistrationForm: React.FC<CoachRegistrationFormProps> = ({
  onRegisterSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<CoachStep>('basic');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    clubLogo: '',
    clubName: '',
    country: '',
    ageGroup: '',
    stadium: '',
  });

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: formData,
  });

  const handleNext = async () => {
    if (currentStep === 'basic') {
      setCurrentStep('club');
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'club') {
      setCurrentStep('basic');
    }
  };

  const handleImagePick = () => {
    // Placeholder for image picker functionality
    // To implement: install expo-image-picker and use it here
    Alert.alert(
      'Image Upload',
      'Image picker will be implemented here. You can add expo-image-picker library for full functionality.',
      [{ text: 'OK' }]
    );
  };

  const onSubmit = async (data: RegisterFormData) => {
    onRegisterSuccess?.(data);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'basic', label: 'Basic Info' },
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
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
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
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Gender"
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
              <Text style={styles.uploadLabel}>Club Logo</Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleImagePick}
              >
                <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
                <Text style={styles.uploadButtonText}>
                  {selectedImage ? 'Change Image' : 'Upload Image'}
                </Text>
              </TouchableOpacity>
              {selectedImage && (
                <Text style={styles.uploadedFileName}>Image selected</Text>
              )}
            </View>

            <Controller
              control={control}
              name="clubName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Club Name"
                  placeholder="Enter club name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.clubName?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Country"
                  placeholder="Enter country"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.country?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="ageGroup"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Age Group"
                  placeholder="e.g., U-18, U-21, Senior"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.ageGroup?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="stadium"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Stadium"
                  placeholder="Enter stadium name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.stadium?.message}
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
  uploadedFileName: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginTop: 8,
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
