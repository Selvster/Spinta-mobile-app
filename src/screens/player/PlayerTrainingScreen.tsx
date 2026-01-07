import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { PLAYER_ROUTES } from '../../constants/routes';

interface TrainingPlan {
  id: string;
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

const PlayerTrainingScreen: React.FC = () => {
  const navigation = useNavigation();

  const trainingPlans: TrainingPlan[] = [
    {
      id: '1',
      title: 'Speed & Agility Development',
      date: 'Oct 7, 2025',
      status: 'Completed',
    },
    {
      id: '2',
      title: 'Shooting Accuracy Program',
      date: 'Oct 14, 2025',
      status: 'In Progress',
    },
    {
      id: '3',
      title: 'Defensive Positioning',
      date: 'Oct 21, 2025',
      status: 'Not Started',
    },
  ];

  const getStatusColor = (status: 'Completed' | 'In Progress' | 'Not Started') => {
    switch (status) {
      case 'Completed':
        return COLORS.success;
      case 'In Progress':
        return COLORS.warning;
      case 'Not Started':
        return COLORS.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Training Plans</Text>

        {trainingPlans.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fitness-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>No training plans assigned yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Your coach will assign personalized training plans here
            </Text>
          </View>
        ) : (
          <View style={styles.trainingPlansList}>
            {trainingPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={styles.trainingPlanCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(PLAYER_ROUTES.TRAINING_PLAN_DETAIL as never, { plan } as never)}
              >
                <View style={styles.trainingPlanContent}>
                  <Text style={styles.trainingPlanTitle}>{plan.title}</Text>
                  <Text style={styles.trainingPlanDate}>{plan.date}</Text>
                </View>
                <View style={styles.trainingPlanRight}>
                  <View
                    style={[
                      styles.trainingStatusBadge,
                      { backgroundColor: getStatusColor(plan.status) },
                    ]}
                  >
                    <Text style={styles.trainingStatusText}>{plan.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
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
    paddingTop: 45,
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'FranklinGothic-Heavy',
    color: COLORS.text,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  trainingPlansList: {
    gap: 16,
  },
  trainingPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
  },
  trainingPlanContent: {
    flex: 1,
  },
  trainingPlanTitle: {
    fontSize: 16,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.text,
    marginBottom: 6,
  },
  trainingPlanDate: {
    fontSize: 13,
    fontFamily: 'FranklinGothic-Book',
    color: COLORS.textSecondary,
  },
  trainingPlanRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainingStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trainingStatusText: {
    fontSize: 12,
    fontFamily: 'FranklinGothic-Demi',
    color: COLORS.textOnPrimary,
  },
});

export default PlayerTrainingScreen;
