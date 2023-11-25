import { makeStyles } from '@rneui/base';
import { Button, Icon, Header as RNHeader, Text } from '@rneui/themed';
import { useMemo } from 'react';
import { View } from 'react-native';
import { COLORS, TYPOS } from 'src/constants';
import { DataTypeEnum, SymbolConfig } from 'src/types';

const useStyles = makeStyles(() => ({
  container: {
    flexDirection: 'row',
    zIndex: 100,
  },
  backButton: {
    backgroundColor: 'transparent',
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
    flex: 1,
  },
  description: {
    color: COLORS.aqua,
    ...TYPOS.medium,
    fontWeight: '600',
  },
  symbol: {
    color: COLORS.white,
    ...TYPOS.normal,
  },
}));

interface Props {
  symbolConfig: SymbolConfig;
  dataType: DataTypeEnum;
  onBackPress: () => any;
}

export const Header: React.FC<Props> = ({
  symbolConfig,
  dataType,
  onBackPress,
}) => {
  const styles = useStyles();

  const renderButton = (hide?: boolean) => {
    return (
      <Button
        buttonStyle={hide ? { opacity: 0 } : styles.backButton}
        disabled={hide}
        onPress={hide ? undefined : onBackPress}
      >
        <Icon type='ionicon' name='chevron-back' color='white' size={30} />
      </Button>
    );
  };

  const { description, symbol } = useMemo(() => {
    const description = symbolConfig.description;
    const symbol = symbolConfig.displaySymbol || symbolConfig.symbol;
    const isForex = dataType === DataTypeEnum.FOREX;
    return {
      description: isForex ? symbol : description,
      symbol: isForex ? description : symbol,
    };
  }, []);

  return (
    <View style={styles.container}>
      {renderButton()}
      <View style={styles.center}>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      {renderButton(true)}
    </View>
  );
};
