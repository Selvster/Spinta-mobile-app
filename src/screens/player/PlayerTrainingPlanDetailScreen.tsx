import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { usePlayerTrainingDetail } from '../../api/queries/player.queries';
import { useToggleExercise } from '../../api/mutations/player.mutations';

type TrainingPlanDetailRouteParams = {
  TrainingPlanDetail: { planId: string };
};

const PlayerTrainingPlanDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<TrainingPlanDetailRouteParams, 'TrainingPlanDetail'>>();
  const planId = route.params?.planId;

  const { data, isLoading, error } = usePlayerTrainingDetail(planId || '');
  const toggleExerciseMutation = useToggleExercise();

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return COLORS.success;
    if (percentage >= 50) return COLORS.warning;
    return COLORS.primary;
  };

  const handleToggleExercise = (exerciseId: string, currentCompleted: boolean) => {
    toggleExerciseMutation.mutate({
      exerciseId,
      completed: !currentCompleted,
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading training plan...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load training plan</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonError}>
          <Text style={styles.backButtonErrorText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { plan, progress, exercises, coach_notes } = data;

  const progressColor = getProgressColor(progress.percentage);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Plan Info Section */}
        <View style={styles.planInfoSection}>
          <Text style={styles.planTitle}>{plan.plan_name}</Text>
          <Text style={styles.planMeta}>{formatDate(plan.created_at)}</Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Text style={[styles.progressPercentage, { color: progressColor }]}>
              {progress.percentage}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progress.percentage}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {progress.completed_exercises} of {progress.total_exercises} exercises completed
          </Text>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          {exercises.map((exercise, index) => (
            <View key={exercise.exercise_id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.exercise_name}</Text>
                  {exercise.description && (
                    <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                  )}
                </View>
                {/* Toggleable checkbox */}
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    exercise.completed && styles.checkboxCompleted,
                  ]}
                  onPress={() => handleToggleExercise(exercise.exercise_id, exercise.completed)}
                  activeOpacity={0.7}
                  disabled={toggleExerciseMutation.isPending}
                >
                  {exercise.completed && (
                    <Ionicons name="checkmark" size={16} color={COLORS.textOnPrimary} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.exerciseStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sets</Text>
                  <Text style={styles.statValue}>{exercise.sets || '-'}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Reps</Text>
                  <Text style={styles.statValue}>{exercise.reps || '-'}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Minutes</Text>
                  <Text style={styles.statValue}>{exercise.duration_minutes || '-'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Coach Notes Section */}
        {coach_notes && (
          <View style={styles.coachNotesSection}>
            <Text style={styles.sectionTitle}>Coach Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{coach_notes}</Text>
            </View>
          </View>
        )}

        {/* Completion Message */}
        {progress.percentage === 100 && (
          <View style={styles.completionMessage}>
            <Ionicons name="trophy" size={24} color={COLORS.success} />
            <Text style={styles.completionText}>
              Great job! You've completed all exercises!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.error,
  },
  backButtonError: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  backButtonErrorText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
  header: {
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    marginLeft: 4,
  },
  scrollContent: {
    flex: 1,
  },
  // Plan Info Section
  planInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  planTitle: {
    fontSize: 22,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 8,
  },
  planMeta: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  // Progress Section
  progressSection: {
    padding: 20,
    backgroundColor: COLORS.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  // Exercises Section
  exercisesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.textOnPrimary,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  exerciseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
  },
  // Coach Notes Section
  coachNotesSection: {
    padding: 20,
    paddingTop: 0,
  },
  notesCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.text,
    lineHeight: 22,
  },
  // Completion Message
  completionMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  completionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.success,
  },
});

export default PlayerTrainingPlanDetailScreen;
