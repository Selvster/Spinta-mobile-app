import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../constants';

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  minutes: string;
  completed: boolean;
}

interface TrainingPlanData {
  id: string;
  title: string;
  date: string;
  playerName: string;
  playerNumber: number;
  exercises: Exercise[];
}

type TrainingPlanDetailRouteParams = {
  plan?: TrainingPlanData;
};

const TrainingPlanDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: TrainingPlanDetailRouteParams }, 'params'>>();

  // Get plan data from navigation params or use mock data
  const planFromParams = route.params?.plan;

  // Mock exercises data - in real app this would come from API based on plan id
  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Target Shooting Drill',
      description: 'Practice shooting at designated target zones in the goal from various positions',
      sets: '3',
      reps: '10',
      minutes: '20',
      completed: true,
    },
    {
      id: '2',
      name: 'First Touch & Finish',
      description: 'Receive passes and shoot on goal with maximum 2 touches',
      sets: '4',
      reps: '8',
      minutes: '15',
      completed: true,
    },
    {
      id: '3',
      name: 'Power Shot Training',
      description: 'Work on generating shot power while maintaining accuracy',
      sets: '3',
      reps: '12',
      minutes: '18',
      completed: false,
    },
  ];

  const planData: TrainingPlanData = {
    id: planFromParams?.id || '1',
    title: planFromParams?.title || 'Shooting Accuracy Program',
    date: planFromParams?.date || 'Oct 14, 2025',
    playerName: 'Marcus Silva',
    playerNumber: 10,
    exercises: mockExercises,
  };

  // Calculate progress
  const completedCount = planData.exercises.filter((ex) => ex.completed).length;
  const totalCount = planData.exercises.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getProgressColor = () => {
    if (progressPercentage === 100) return COLORS.success;
    if (progressPercentage >= 50) return COLORS.warning;
    return COLORS.primary;
  };

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
          <Text style={styles.planTitle}>{planData.title}</Text>
          <Text style={styles.planMeta}>{planData.date}</Text>
          <Text style={styles.playerLabel}>
            Assigned to: <Text style={styles.playerName}>{planData.playerName}</Text> <Text style={styles.playerNumber}>#{planData.playerNumber}</Text>
          </Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={[styles.progressPercentage, { color: getProgressColor() }]}>
              {progressPercentage}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {completedCount} of {totalCount} exercises completed
          </Text>
        </View>

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          {planData.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                </View>
                {/* Read-only checkbox */}
                <View
                  style={[
                    styles.checkbox,
                    exercise.completed && styles.checkboxCompleted,
                  ]}
                >
                  {exercise.completed && (
                    <Ionicons name="checkmark" size={16} color={COLORS.textOnPrimary} />
                  )}
                </View>
              </View>

              <View style={styles.exerciseStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sets</Text>
                  <Text style={styles.statValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Reps</Text>
                  <Text style={styles.statValue}>{exercise.reps}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Minutes</Text>
                  <Text style={styles.statValue}>{exercise.minutes}</Text>
                </View>
              </View>

              {exercise.completed && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.completedText}>Completed by player</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Coach Notes Section */}
        <View style={styles.coachNotesSection}>
          <Text style={styles.sectionTitle}>Coach Notes</Text>
          <View style={styles.notesCard}>
            <Text style={styles.notesText}>
              Focus on keeping your head down during the shot and follow through with your kicking foot.
              Remember to plant your standing foot next to the ball for better accuracy.
              Great improvement on your weak foot shots last session!
            </Text>
          </View>
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
    marginBottom: 12,
  },
  playerLabel: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  playerName: {
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.primary,
  },
  playerNumber: {
    fontFamily: 'FranklinGothic-Demi',
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
    width: 24,
    height: 24,
    borderRadius: 6,
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
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  completedText: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.success,
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
});

export default TrainingPlanDetailScreen;
