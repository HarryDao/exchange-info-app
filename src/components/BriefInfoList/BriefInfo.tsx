import { Button, makeStyles } from '@rneui/base';
import { Text } from '@rneui/themed';
import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { COLORS, TYPOS } from 'src/constants';
import { currentPricesSelectors } from 'src/redux/currentPrices';
import { shortHistoricalSelectors } from 'src/redux/shortHistorical';
import { DataTypeEnum, SymbolConfig } from 'src/types';
import { PriceDifference } from '../PriceDifference';
import { LineChart } from '../LineChart';
import { useDetailScreenNavigation } from 'src/hooks/useNavigation';
import { AppState } from 'src/redux/store';

const useStyles = makeStyles(() => ({
  wrapper: {
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  increase: {
    backgroundColor: COLORS.green,
  },
  decrease: {
    backgroundColor: COLORS.red,
  },
  button: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 'auto',
    alignItems: 'stretch',
  },
  left: {
    width: '50%',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  description: {
    color: COLORS.aqua,
    fontWeight: '600',
    textAlign: 'center',
    ...TYPOS.normal,
  },
  symbol: {
    color: COLORS.aqua,
    ...TYPOS.small,
  },
  price: {
    color: COLORS.white,
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    ...TYPOS.smedium,
  },
  right: {
    width: '50%',
    minHeight: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

interface Props {
  symbolConfig: SymbolConfig;
  dataType: DataTypeEnum;
}

export const BriefInfo: React.FC<Props> = ({ symbolConfig, dataType }) => {
  const shortHistoricalLoading = useSelector(
    shortHistoricalSelectors.getShortHistoricalLoading,
  );
  const shortHistoricalData = useSelector(
    (state: AppState) =>
      shortHistoricalSelectors.getShortHistoricalFor1Symbol(
        state,
        symbolConfig.symbol,
      ),
    shallowEqual,
  );
  const lastPrice = useMemo(() => {
    if (!shortHistoricalData || !shortHistoricalData.length) return null;
    return shortHistoricalData[0].close;
  }, [shortHistoricalData]);

  const currentPrice = useSelector(
    (state: AppState) =>
      currentPricesSelectors.getCurrentPriceFor1Symbol(
        state,
        symbolConfig.symbol,
      ),
    shallowEqual,
  );

  const currentPriceValue = currentPrice.price;
  const previousCurrentPriceValue = useRef(currentPrice.price);

  const [wrapperBackground, setWrapperBackground] = useState<any>({});
  const backgroundResetTimeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    clearTimeout(backgroundResetTimeout.current);
    if (currentPriceValue === previousCurrentPriceValue.current) return;
    if (currentPriceValue > previousCurrentPriceValue.current)
      setWrapperBackground(styles.increase);
    if (currentPriceValue < previousCurrentPriceValue.current)
      setWrapperBackground(styles.decrease);

    previousCurrentPriceValue.current = currentPriceValue;
    backgroundResetTimeout.current = setTimeout(() => {
      setWrapperBackground({});
    }, 300);
  }, [currentPriceValue]);

  const styles = useStyles();
  const isForex = dataType === DataTypeEnum.FOREX;

  const { navigation } = useDetailScreenNavigation();

  const handleButtonPress = useCallback(() => {
    navigation.push('DetailScreen', {
      symbolConfig,
      dataType,
    });
  }, [symbolConfig, dataType]);

  return (
    <BlurView
      style={[styles.wrapper, wrapperBackground]}
      tint='light'
      intensity={20}
    >
      <Button buttonStyle={styles.button} onPress={handleButtonPress}>
        <View style={styles.left}>
          <Text style={styles.description}>
            {isForex ? symbolConfig.symbol : symbolConfig.description}
          </Text>
          <Text style={styles.symbol}>
            {isForex
              ? symbolConfig.description
              : symbolConfig.displaySymbol || symbolConfig.symbol}
          </Text>
          <Text style={styles.price}>{currentPrice.price.toPrecision(8)}</Text>
        </View>
        <View style={styles.right}>
          {shortHistoricalLoading && (
            <ActivityIndicator size='small' color={COLORS.aqua} />
          )}

          {!shortHistoricalLoading && !!shortHistoricalData?.length && (
            <>
              <PriceDifference last={lastPrice} current={currentPrice.price} />
              <LineChart
                candles={shortHistoricalData}
                current={currentPrice.price}
              />
            </>
          )}
        </View>
      </Button>
    </BlurView>
  );
};
