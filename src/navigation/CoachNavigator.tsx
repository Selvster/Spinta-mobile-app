import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COACH_ROUTES } from '../constants/routes';

import CoachHomeScreen from '../screens/coach/CoachHomeScreen';
import CoachTeamScreen from '../screens/coach/CoachTeamScreen';
import CoachProfileScreen from '../screens/coach/CoachProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Tab = createBottomTabNavigator();

const CoachNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name={COACH_ROUTES.HOME}
        component={CoachHomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.TEAM}
        component={CoachTeamScreen}
        options={{
          title: 'Teams',
          tabBarLabel: 'Teams',
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.PROFILE}
        component={CoachProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name={COACH_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default CoachNavigator;
