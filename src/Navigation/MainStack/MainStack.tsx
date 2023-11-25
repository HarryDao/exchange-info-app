import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useIsInitialSetupReady } from 'src/hooks';
import { MainStackNavProps, MainStackParamList } from 'src/types';
import { ListTab } from './ListTab';
import { DetailsScreen } from './DetailsScreen/DetailsScreen';

const Stack = createStackNavigator<MainStackParamList>();

export const MainStack: React.FC<MainStackNavProps> = ({ navigation }) => {
  const { isReady } = useIsInitialSetupReady();

  useEffect(() => {
    if (!isReady) {
      navigation.navigate('LoadingModal');
    } else {
      navigation.navigate('MainStack');
    }
  }, [isReady, navigation]);

  return (
    <Stack.Navigator
      initialRouteName='ListTab'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='ListTab' component={ListTab} />
      <Stack.Screen
        name='DetailScreen'
        component={DetailsScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
