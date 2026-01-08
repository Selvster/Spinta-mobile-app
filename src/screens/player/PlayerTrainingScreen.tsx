import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants';
import { PLAYER_ROUTES } from '../../constants/routes';
import { usePlayerTraining } from '../../api/queries/player.queries';

type PlayerStackParamList = {
  [PLAYER_ROUTES.TRAINING_PLAN_DETAIL]: { planId: string };
};

const PlayerTrainingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<PlayerStackParamList>>();
  const { data, isLoading, error } = usePlayerTraining();

  // Helper to map training plan status
  const mapPlanStatus = (status: string): 'Completed' | 'In Progress' | 'Not Started' => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading training plans...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to load training plans</Text>
      </View>
    );
  }

  const trainingPlans = data?.training_plans || [];

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
            {trainingPlans.map((plan) => {
              const status = mapPlanStatus(plan.status);
              return (
                <TouchableOpacity
                  key={plan.plan_id}
                  style={styles.trainingPlanCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(PLAYER_ROUTES.TRAINING_PLAN_DETAIL, { planId: plan.plan_id })}
                >
                  <View style={styles.trainingPlanContent}>
                    <Text style={styles.trainingPlanTitle}>{plan.plan_name}</Text>
                    <Text style={styles.trainingPlanDate}>{formatDate(plan.created_at)}</Text>
                  </View>
                  <View style={styles.trainingPlanRight}>
                    <View
                      style={[
                        styles.trainingStatusBadge,
                        { backgroundColor: getStatusColor(status) },
                      ]}
                    >
                      <Text style={styles.trainingStatusText}>{status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                  </View>
                </TouchableOpacity>
              );
            })}
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
