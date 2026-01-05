import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  minutes: string;
}

const CreateTrainingPlanScreen: React.FC = () => {
  const navigation = useNavigation();

  // Mock player data - would come from navigation params
  const playerName = 'Marcus Silva';
  const playerNumber = '#10';

  const [planName, setPlanName] = useState('Shooting Accuracy Improvement');
  const [duration, setDuration] = useState('4 weeks');
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Target Shooting Drill',
      description: 'Practice shooting at designated target zones in the goal from various positions',
      sets: '3',
      reps: '10',
      minutes: '20',
    },
    {
      id: '2',
      name: 'First Touch & Finish',
      description: 'Receive passes and shoot on goal with maximum 2 touches',
      sets: '4',
      reps: '8',
      minutes: '15',
    },
    {
      id: '3',
      name: 'Power Shot Training',
      description: 'Work on generating shot power while maintaining accuracy',
      sets: '3',
      reps: '12',
      minutes: '18',
    },
  ]);

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    description: '',
    sets: '',
    reps: '',
    minutes: '',
  });
  const [additionalNotes, setAdditionalNotes] = useState('');

  const durationOptions = [
    '1 week',
    '2 weeks',
    '3 weeks',
    '4 weeks',
    '6 weeks',
    '8 weeks',
    '12 weeks',
    '16 weeks',
  ];

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleEditExercise = (id: string) => {
    // Navigate to edit or open modal
    console.log('Edit exercise:', id);
  };

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.description) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        ...newExercise,
      };
      setExercises([...exercises, exercise]);
      setNewExercise({ name: '', description: '', sets: '', reps: '', minutes: '' });
      setShowAddExercise(false);
    }
  };

  const handleAssignPlan = () => {
    // Submit the training plan
    console.log('Assign plan');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Training Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Create a personalized training plan for {playerName}
        </Text>

        {/* Assigning To */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Assigning to</Text>
          <View style={styles.playerCard}>
            <View style={styles.playerAvatar}>
              <Ionicons name="person" size={20} color={COLORS.textSecondary} />
            </View>
            <View>
              <Text style={styles.playerName}>{playerName}</Text>
              <Text style={styles.playerNumber}>{playerNumber}</Text>
            </View>
          </View>
        </View>

        {/* Training Plan Name */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>
            Training Plan Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={planName}
            onChangeText={setPlanName}
            placeholder="Enter plan name"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>
            Duration <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownContainer}
            onPress={() => setShowDurationDropdown(!showDurationDropdown)}
          >
            <Text style={styles.dropdownText}>{duration}</Text>
            <Ionicons
              name={showDurationDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
          {showDurationDropdown && (
            <View style={styles.dropdownOptions}>
              {durationOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.dropdownOption,
                    duration === option && styles.dropdownOptionSelected,
                  ]}
                  onPress={() => {
                    setDuration(option);
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownOptionText,
                      duration === option && styles.dropdownOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {duration === option && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Exercises</Text>
          {exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseActions}>
                  <TouchableOpacity onPress={() => handleEditExercise(exercise.id)}>
                    <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id)}>
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <View style={styles.exerciseStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sets</Text>
                  <Text style={styles.statValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Reps</Text>
                  <Text style={styles.statValue}>{exercise.reps}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Minutes</Text>
                  <Text style={styles.statValue}>{exercise.minutes}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Add New Exercise Button */}
          {!showAddExercise && (
            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => setShowAddExercise(true)}
            >
              <Text style={styles.addExerciseButtonText}>+ Add New Exercise</Text>
            </TouchableOpacity>
          )}

          {/* Add Exercise Form */}
          {showAddExercise && (
            <View style={styles.addExerciseForm}>
              <Text style={styles.inputLabel}>
                Exercise Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={newExercise.name}
                onChangeText={(text) => setNewExercise({ ...newExercise, name: text })}
                placeholder="Enter exercise name"
                placeholderTextColor={COLORS.textSecondary}
              />

              <Text style={styles.inputLabel}>
                Exercise Description <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newExercise.description}
                onChangeText={(text) =>
                  setNewExercise({ ...newExercise, description: text })
                }
                placeholder="Enter exercise description"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
              />

              <View style={styles.exerciseInputRow}>
                <View style={styles.exerciseInputItem}>
                  <Text style={styles.inputLabel}>Sets</Text>
                  <TextInput
                    style={styles.input}
                    value={newExercise.sets}
                    onChangeText={(text) => setNewExercise({ ...newExercise, sets: text })}
                    placeholder="0"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.exerciseInputItem}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.input}
                    value={newExercise.reps}
                    onChangeText={(text) => setNewExercise({ ...newExercise, reps: text })}
                    placeholder="0"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.exerciseInputItem}>
                  <Text style={styles.inputLabel}>Minutes</Text>
                  <TextInput
                    style={styles.input}
                    value={newExercise.minutes}
                    onChangeText={(text) =>
                      setNewExercise({ ...newExercise, minutes: text })
                    }
                    placeholder="0"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.addAnotherButtonContainer}
                onPress={handleAddExercise}
              >
                <LinearGradient
                  colors={['#FFB800', '#FF6B00', '#FF3000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addAnotherButton}
                >
                  <Ionicons name="add" size={20} color={COLORS.textOnPrimary} />
                  <Text style={styles.addAnotherButtonText}>Add Another Exercise</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Additional Notes */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Additional Notes from Coach (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            placeholder="Add any additional instructions or notes..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.assignButtonContainer}
            onPress={handleAssignPlan}
          >
            <LinearGradient
              colors={['#FFB800', '#FF6B00', '#FF3000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.assignButton}
            >
              <Text style={styles.assignButtonText}>Assign Plan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  playerNumber: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  dropdownOptions: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 250,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownOptionSelected: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  dropdownOptionText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
  dropdownOptionTextSelected: {
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
  exerciseCard: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    flex: 1,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  exerciseDescription: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  exerciseStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  addExerciseButton: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addExerciseButtonText: {
    fontSize: 15,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textSecondary,
  },
  addExerciseForm: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  exerciseInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exerciseInputItem: {
    flex: 1,
  },
  addAnotherButtonContainer: {
    marginTop: 8,
  },
  addAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  addAnotherButtonText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 40,
  },
  assignButtonContainer: {
    marginBottom: 12,
  },
  assignButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignButtonText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
  },
});

export default CreateTrainingPlanScreen;
