import { Icon, makeStyles } from '@rneui/base';
import { Button } from '@rneui/themed';
import { useCallback } from 'react';
import { TYPOS, COLORS } from 'src/constants';
import { joinStyles } from 'src/helpers';

const getScreenName = (routeName: string): string => {
  return routeName.replace(/screen/i, '');
};

const getIcon = (routeName: string): { type: string; name: string } => {
  if (/forex/i.test(routeName)) {
    return {
      type: 'font-awesome-5',
      name: 'dollar-sign',
    };
  }
  if (/crypto/i.test(routeName)) {
    return {
      type: 'font-awesome-5',
      name: 'btc',
    };
  }
  if (/stock/i.test(routeName)) {
    return {
      type: 'material-community',
      name: 'finance',
    };
  }

  return {
    type: 'font-awesome-5',
    name: '',
  };
};

const useStyles = makeStyles(() => {
  return {
    buttonContainer: {
      flex: 1,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    button: {
      backgroundColor: 'transparent',
    },
    buttonText: {
      ...TYPOS.small,
    },
    buttonIcon: {
      ...TYPOS.smedium,
      marginRight: 4,
    },
    isActive: {
      color: COLORS.white,
    },
    isInactive: {
      color: COLORS.aqua,
      opacity: 0.4,
    },
  };
});

interface Props {
  isActive: boolean;
  routeName: string;
  onButtonPress: (routeName: string) => void;
}

export const ListTabBarButton: React.FC<Props> = ({
  isActive,
  routeName,
  onButtonPress,
}) => {
  const onPress = useCallback(() => {
    onButtonPress(routeName);
  }, [onButtonPress, routeName]);

  const styles = useStyles();

  return (
    <Button
      containerStyle={styles.buttonContainer}
      buttonStyle={joinStyles(
        styles.button,
        isActive ? styles.isActive : styles.isInactive,
      )}
      onPress={onPress}
    >
      <Icon
        {...getIcon(routeName)}
        iconStyle={joinStyles(
          styles.buttonIcon,
          isActive ? styles.isActive : styles.isInactive,
        )}
      />
      {getScreenName(routeName)}
    </Button>
  );
};
