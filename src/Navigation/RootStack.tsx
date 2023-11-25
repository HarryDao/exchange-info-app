import React, { memo, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from 'src/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import { getSocket } from 'src/services';
import { currentPricesActions } from 'src/redux/currentPrices';
import { dataConfigsActions } from 'src/redux/dataConfigs';
import { MainStack } from './MainStack';
import { LoadingModal } from './LoadingModal';
import { View } from 'react-native';
import { Text } from '@rneui/base';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    Promise.all([
      getSocket(),
      dispatch(dataConfigsActions.fetchDataConfigs()),
      dispatch(currentPricesActions.fetchCurrentPrices()),
    ]);
  }, [dispatch]);

  return (
    <Stack.Navigator initialRouteName='MainStack'>
      <Stack.Screen
        name='MainStack'
        component={MainStack}
        options={{
          header: () => null,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name='LoadingModal'
        component={LoadingModal}
        options={{
          presentation: 'modal',
          header: () => null,
          cardStyle: {
            backgroundColor: 'transparent',
          },
        }}
      />
    </Stack.Navigator>
  );
};
