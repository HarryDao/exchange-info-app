import { makeStyles } from '@rneui/base';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const useStyles = makeStyles(() => ({
  safeView: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingBottom: 0,
  },
  containerView: {
    flex: 1,
  },
}));

interface Props {
  children?: React.ReactNode;
  safeViewStyle?: any;
  containerStyle?: any;
}

export const ScreenWrapper: React.FC<Props> = ({
  children,
  safeViewStyle,
  containerStyle,
}) => {
  const styles = useStyles();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeView, safeViewStyle]}
    >
      <View style={[styles.containerView, containerStyle]}>{children}</View>
    </SafeAreaView>
  );
};
