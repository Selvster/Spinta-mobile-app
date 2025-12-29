import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PLAYER_ROUTES } from '../constants/routes';

import PlayerHomeScreen from '../screens/player/PlayerHomeScreen';
import PlayerTrainingScreen from '../screens/player/PlayerTrainingScreen';
import PlayerProfileScreen from '../screens/player/PlayerProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

const Tab = createBottomTabNavigator();

const PlayerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name={PLAYER_ROUTES.HOME}
        component={PlayerHomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.TRAINING}
        component={PlayerTrainingScreen}
        options={{
          title: 'Training',
          tabBarLabel: 'Training',
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.PROFILE}
        component={PlayerProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name={PLAYER_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default PlayerNavigator;
