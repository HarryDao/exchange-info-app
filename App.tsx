import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { UIManager, Platform } from 'react-native';

import { Root } from 'src/Root';
import { useColorScheme } from 'src/hooks';
import { Navigation } from 'src/Navigation';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <Root>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </Root>
  );
}
