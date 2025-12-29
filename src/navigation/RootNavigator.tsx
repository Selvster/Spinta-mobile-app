import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

import AuthNavigator from './AuthNavigator';
import PlayerNavigator from './PlayerNavigator';
import CoachNavigator from './CoachNavigator';
import { Loading } from '../components/common';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user, setLoading } = useAuth();

  useEffect(() => {
    // Simulate checking authentication state on mount
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === UserRole.PLAYER ? (
          <Stack.Screen name="PlayerApp" component={PlayerNavigator} />
        ) : (
          <Stack.Screen name="CoachApp" component={CoachNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
