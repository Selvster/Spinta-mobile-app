import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_ROUTES } from '../constants/routes';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AUTH_ROUTES.WELCOME}
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.LOGIN}
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.REGISTER}
        component={RegisterScreen}
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.ROLE_SELECTION}
        component={RoleSelectionScreen}
        options={{ title: 'Select Your Role' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
