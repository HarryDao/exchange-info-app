import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Text } from '@rneui/base';
import { ListTabParamList } from 'src/types';
import { StockScreen } from './StockScreen';
import { ForexScreen } from './ForexScreen';
import { CryptoScreen } from './CryptoScreen';
import { useCallback } from 'react';
import { ListTabBar } from './ListTab.Bar';
import { useIsInitialSetupReady } from 'src/hooks';

const Tab = createBottomTabNavigator<ListTabParamList>();

export const ListTab = () => {
  const { isReady } = useIsInitialSetupReady();

  const renderTabBar = useCallback((props: BottomTabBarProps) => {
    return <ListTabBar {...props} />;
  }, []);

  if (!isReady) return;

  return (
    <Tab.Navigator
      initialRouteName='StockScreen'
      tabBar={renderTabBar}
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent' },
        headerShown: false,
      }}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tab.Screen name='StockScreen' component={StockScreen} />
      <Tab.Screen name='ForexScreen' component={ForexScreen} />
      <Tab.Screen name='CryptoScreen' component={CryptoScreen} />
    </Tab.Navigator>
  );
};
