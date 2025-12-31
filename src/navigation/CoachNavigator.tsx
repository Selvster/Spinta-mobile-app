import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COACH_ROUTES } from '../constants/routes';
import { COLORS } from '../constants';

import ClubScreen from '../screens/coach/ClubScreen';
import PlayersScreen from '../screens/coach/PlayersScreen';
import ChatbotScreen from '../screens/coach/ChatbotScreen';
import ProfileScreen from '../screens/coach/ProfileScreen';

const Tab = createBottomTabNavigator();

const CoachNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontFamily: 'FranklinGothic-Book',
          fontSize: 13,
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
            <Ionicons name="shield-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.PLAYERS}
        component={PlayersScreen}
        options={{
          title: 'Players',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.CHATBOT}
        component={ChatbotScreen}
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CoachNavigator;
