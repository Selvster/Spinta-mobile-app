import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COACH_ROUTES } from '../constants/routes';
import { COLORS } from '../constants';

import ClubScreen from '../screens/coach/ClubScreen';
import PlayersScreen from '../screens/coach/PlayersScreen';
import ChatbotScreen from '../screens/coach/ChatbotScreen';
import ProfileScreen from '../screens/coach/ProfileScreen';
import MatchDetailScreen from '../screens/coach/MatchDetailScreen';
import PlayerDetailScreen from '../screens/coach/PlayerDetailScreen';
import CreateTrainingPlanScreen from '../screens/coach/CreateTrainingPlanScreen';
import TrainingPlanDetailScreen from '../screens/coach/TrainingPlanDetailScreen';
import PlayerMatchDetailScreen from '../screens/shared/PlayerMatchDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CoachTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          height: 80,
        },
        tabBarLabelStyle: {
          fontFamily: 'FranklinGothic-Book',
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name={COACH_ROUTES.CLUB}
        component={ClubScreen}
        options={{
          title: 'Club',
          tabBarIcon: ({ color }) => (
            <Ionicons name="shield-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.PLAYERS}
        component={PlayersScreen}
        options={{
          title: 'Players',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.CHATBOT}
        component={ChatbotScreen}
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const CoachNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CoachTabs" component={CoachTabs} />
      <Stack.Screen name={COACH_ROUTES.MATCH_DETAIL} component={MatchDetailScreen} />
      <Stack.Screen name={COACH_ROUTES.PLAYER_DETAIL} component={PlayerDetailScreen} />
      <Stack.Screen name={COACH_ROUTES.PLAYER_MATCH_DETAIL} component={PlayerMatchDetailScreen} />
      <Stack.Screen name={COACH_ROUTES.CREATE_TRAINING_PLAN} component={CreateTrainingPlanScreen} />
      <Stack.Screen name={COACH_ROUTES.TRAINING_PLAN_DETAIL} component={TrainingPlanDetailScreen} />
    </Stack.Navigator>
  );
};

export default CoachNavigator;
