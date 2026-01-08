import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts } from './src/hooks/useFonts';
import { Loading } from './src/components/common';
import { queryClient } from './src/api/queryClient';

export default function App() {
  const { fontsLoaded } = useFonts();

  if (!fontsLoaded) {
    return <Loading message="Loading..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
