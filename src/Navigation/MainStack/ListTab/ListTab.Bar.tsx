import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useCallback } from 'react';
import { ListTabBarButton } from './ListTab.Bar.Button';
import { makeStyles } from '@rneui/base';

const useStyles = makeStyles(() => ({
  wrapper: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    // marginTop: 0,
  },
}));

export const ListTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const { routes, index: currentIndex } = state;

  const onButtonPress = useCallback(
    (routeName: string) => {
      navigation.navigate(routeName);
    },
    [navigation],
  );

  const styles = useStyles();

  return (
    <BlurView style={styles.wrapper} intensity={100} tint='dark'>
      {routes.map((route, index) => {
        return (
          <ListTabBarButton
            key={route.key}
            isActive={index === currentIndex}
            routeName={route.name}
            onButtonPress={onButtonPress}
          />
        );
      })}
    </BlurView>
  );
};
