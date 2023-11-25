/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

// import { linking } from './LinkingConfiguration';
import { RootStack } from './RootStack';

export function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const theme = React.useMemo((): Theme => {
    const defaultTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        background: 'transparent',
      },
    };
  }, []);

  return (
    <NavigationContainer
      // linking={linking}
      theme={theme}
    >
      <RootStack />
    </NavigationContainer>
  );
}
