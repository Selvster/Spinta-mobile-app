import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { PLAYER_ROUTES } from '../constants/routes';
import { COLORS } from '../constants';

import PlayerHomeScreen from '../screens/player/PlayerHomeScreen';
import PlayerMatchesScreen from '../screens/player/PlayerMatchesScreen';
import PlayerTrainingScreen from '../screens/player/PlayerTrainingScreen';
import PlayerProfileScreen from '../screens/player/PlayerProfileScreen';
import PlayerMatchDetailScreen from '../screens/shared/PlayerMatchDetailScreen';
import PlayerTrainingPlanDetailScreen from '../screens/player/PlayerTrainingPlanDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PlayerTabs = () => {
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
        name={PLAYER_ROUTES.HOME}
        component={PlayerHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.MATCHES}
        component={PlayerMatchesScreen}
        options={{
          title: 'Matches',
          tabBarIcon: ({ color }) => (
            <Ionicons name="football-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.TRAINING}
        component={PlayerTrainingScreen}
        options={{
          title: 'Training',
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness-outline" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.PROFILE}
        component={PlayerProfileScreen}
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

const PlayerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PlayerTabs" component={PlayerTabs} />
      <Stack.Screen name={PLAYER_ROUTES.MATCH_DETAIL} component={PlayerMatchDetailScreen} />
      <Stack.Screen name={PLAYER_ROUTES.TRAINING_PLAN_DETAIL} component={PlayerTrainingPlanDetailScreen} />
    </Stack.Navigator>
  );
};

export default PlayerNavigator;
