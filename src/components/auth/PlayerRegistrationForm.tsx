import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Button, ImagePickerButton } from '../common';
import { convertDateToISO, playerFormSchema, PlayerFormData } from '../../utils/validators';
import { useVerifyInvite, useRegisterPlayer } from '../../api/mutations/auth.mutations';
import { VerifyInviteResponse } from '../../types';
import { COLORS } from '../../constants';

interface PlayerRegistrationFormProps {
  onRegisterSuccess?: () => void;
}

type PlayerStep = 'invitation' | 'info';

export const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onRegisterSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<PlayerStep>('invitation');
  const [invitationCode, setInvitationCode] = useState('');
  const [verifiedPlayerData, setVerifiedPlayerData] = useState<VerifyInviteResponse['player_data'] | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const verifyInviteMutation = useVerifyInvite();
  const registerPlayerMutation = useRegisterPlayer();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      height: '',
      playerName: '',
      profile_image_url: '',
    },
  });

  const handleNextFromInvitation = async () => {
    if (!invitationCode.trim()) {
      Alert.alert('Error', 'Please enter your invitation code');
      return;
    }

    try {
      const response = await verifyInviteMutation.mutateAsync({
        invite_code: invitationCode.trim(),
      });

      if (response.valid && response.player_data) {
        setVerifiedPlayerData(response.player_data);
        setValue('playerName', response.player_data.player_name);
        setCurrentStep('info');
      } else {
        Alert.alert('Invalid Code', 'This invitation code is not valid. Please check with your coach.');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        'Invalid invite code. Please check with your coach.';
      Alert.alert('Invalid Code', message);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 'info') {
      setCurrentStep('invitation');
    }
  };

  const onSubmit = async (data: PlayerFormData) => {
    if (!verifiedPlayerData) {
      Alert.alert('Error', 'Please verify your invitation code first');
      return;
    }

    const heightNum = parseInt(data.height, 10);
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      Alert.alert('Error', 'Please enter a valid height between 100 and 250 cm');
      return;
    }

    try {
      const birthDate = convertDateToISO(data.dateOfBirth);

      await registerPlayerMutation.mutateAsync({
        invite_code: invitationCode.trim(),
        player_name: data.playerName,
        email: data.email,
        password: data.password,
        birth_date: birthDate,
        height: heightNum,
        profile_image_url: data.profile_image_url || undefined,
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

        {currentStep === 'info' && verifiedPlayerData && (
          <>
            <Controller
              control={control}
              name="profile_image_url"
              render={({ field: { onChange, value } }) => (
                <ImagePickerButton
                  label="Player Photo (Optional)"
                  value={value}
                  onImageUploaded={onChange}
                  onError={(error) => Alert.alert('Upload Error', error)}
                  folder="players"
                  size={100}
                  shape="circle"
                  placeholder="Add Photo"
                />
              )}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Club Information</Text>
              <Text style={styles.sectionSubtitle}>(Pre-filled from invitation)</Text>
            </View>

            <Controller
              control={control}
              name="playerName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Player Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your name"
                />
              )}
            />

            <View style={styles.disabledInputContainer}>
              <Input
                label="Jersey Number"
                value={String(verifiedPlayerData.jersey_number)}
                editable={false}
                style={styles.disabledInput}
              />
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.disabledInputContainer}>
              <Input
                label="Position"
                value={verifiedPlayerData.position}
                editable={false}
                style={styles.disabledInput}
              />
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

            <View style={styles.disabledInputContainer}>
              <Input
                label="Club"
                value={verifiedPlayerData.club_name}
                editable={false}
                style={styles.disabledInput}
              />
              <View style={styles.lockIconContainer}>
                <Ionicons name="lock-closed" size={16} color={COLORS.textSecondary} />
              </View>
            </View>

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
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={[styles.datePickerText, !value && styles.datePickerPlaceholder]}>
                      {value || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                  {errors.dateOfBirth?.message && (
                    <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>
                  )}
                  {showDatePicker && Platform.OS === 'ios' && (
                    <View style={styles.datePickerContainer}>
                      <View style={styles.datePickerHeader}>
                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                          <Text style={styles.datePickerCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          if (selectedDate) {
                            const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
                            onChange(formatted);
                          }
                          setShowDatePicker(false);
                        }}>
                          <Text style={styles.datePickerDone}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display="spinner"
                        onChange={(event, date) => {
                          if (date) setSelectedDate(date);
                        }}
                        maximumDate={new Date()}
                      />
                    </View>
                  )}
                  {showDatePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                          setSelectedDate(date);
                          const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                          onChange(formatted);
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
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
            title={verifyInviteMutation.isPending ? 'Verifying...' : 'Next'}
            onPress={handleNextFromInvitation}
            fullWidth
            disabled={verifyInviteMutation.isPending}
          />
        ) : (
          <>
            <Button
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              style={styles.previousButton}
              disabled={registerPlayerMutation.isPending}
            />
            <Button
              title={registerPlayerMutation.isPending ? 'Creating...' : 'Create Account'}
              onPress={handleSubmit(onSubmit)}
              style={styles.nextButton}
              disabled={registerPlayerMutation.isPending}
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  datePickerButton: {
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
  datePickerText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  datePickerPlaceholder: {
    color: COLORS.textSecondary,
  },
  datePickerContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  datePickerCancel: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  datePickerDone: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.error,
    marginTop: 4,
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
  disabledInputContainer: {
    position: 'relative',
  },
  disabledInput: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  lockIconContainer: {
    position: 'absolute',
    right: 16,
    top: 40,
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
