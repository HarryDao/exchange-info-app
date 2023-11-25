import { Text, makeStyles } from '@rneui/base';
import { ScreenWrapper } from 'src/components/ScreenWrapper';
import { COLORS, TYPOS } from 'src/constants';
import { Header } from './Header';
import { DetailScreenNavProps } from 'src/types';
import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  longHistoricalActions,
  longHistoricalSelectors,
} from 'src/redux/longHistorical';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppDispatch, AppState } from 'src/redux/store';
import { CandleChart } from './CandleChart';
import { currentPricesSelectors } from 'src/redux/currentPrices';
import { Info } from './Info';
import { moreInfoActions, moreInfoSelectors } from 'src/redux/moreInfo';

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: COLORS.black,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    ...TYPOS.normal,
    marginTop: 8,
  },
});

export const DetailsScreen: React.FC<DetailScreenNavProps> = ({
  route,
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { symbolConfig, dataType } = route.params;

  const currentData = useSelector(
    (state: AppState) =>
      currentPricesSelectors.getCurrentPriceFor1Symbol(
        state,
        symbolConfig.symbol,
      ),
    shallowEqual,
  );

  const rawHistoricalState = useSelector(
    (state: AppState) =>
      longHistoricalSelectors.selectLongHistoricalDataFor1Symbol(
        state,
        symbolConfig.symbol,
      ),
    shallowEqual,
  );
  const historicalState = useMemo(
    () => rawHistoricalState || { data: [], loading: true, error: null },
    [rawHistoricalState],
  );

  const rawMoreInfoState = useSelector(
    (state: AppState) =>
      moreInfoSelectors.selectMoreInfoDataFor1Symbol(
        state,
        symbolConfig.symbol,
      ),
    shallowEqual,
  );
  const moreInfoState = useMemo(
    () => rawMoreInfoState || { data: {}, loading: true, error: null },
    [rawMoreInfoState],
  );

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    (async () => {
      await Promise.all([
        dispatch(
          longHistoricalActions.fetchLongHistoricalData(symbolConfig.symbol),
        ),
        dispatch(moreInfoActions.fetchMoreInfoData(symbolConfig.symbol)),
      ]);
    })();
  }, [symbolConfig.symbol]);

  const loading = historicalState.loading || moreInfoState.loading;

  return (
    <ScreenWrapper safeViewStyle={styles.safeView}>
      <Header
        symbolConfig={symbolConfig}
        dataType={dataType}
        onBackPress={handleBackPress}
      />

      {loading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size='large' color={COLORS.white} />
          <Text style={styles.loadingText}>Loading data ...</Text>
        </View>
      )}

      {!loading && (
        <CandleChart
          data={historicalState.data}
          currentPrice={currentData.price}
        />
      )}

      {!loading && (
        <Info currentData={currentData} moreInfo={moreInfoState.data} />
      )}
    </ScreenWrapper>
  );
};
