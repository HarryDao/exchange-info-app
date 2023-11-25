import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';

import { dataConfigsSelectors } from 'src/redux/dataConfigs';
import { ActivityIndicator, Text, View } from 'react-native';
import { makeStyles } from '@rneui/base';
import { COLORS, TYPOS } from 'src/constants';
import { useIsInitialSetupReady } from 'src/hooks';

const useStyles = makeStyles(() => ({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.black_transparent,
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...TYPOS.medium,
    width: '80%',
    marginTop: 10,
    color: COLORS.white,
    textAlign: 'center',
  },
}));

export const LoadingModal = () => {
  const {
    isSocketReady,
    isSocketError,
    dataConfigsError,
    dataConfigsLoading,
    currentPricesLoading,
    currentPricesError,
  } = useIsInitialSetupReady();

  const message = useMemo(() => {
    if (!isSocketReady) {
      if (isSocketError) {
        return 'Unable to Establish Secure Connection';
      }
      return 'Establishling Secure Connection...';
    }
    if (dataConfigsLoading || currentPricesLoading) {
      return 'Fetching data...';
    }
    if (dataConfigsError || currentPricesError) {
      return 'Unable to fetch data!';
    }
    return '';
  }, [
    isSocketReady,
    isSocketError,
    dataConfigsError,
    dataConfigsSelectors,
    currentPricesError,
    currentPricesLoading,
  ]);

  const styles = useStyles();

  return (
    <View style={styles.wrapper}>
      <StatusBar style='light' />
      <View style={styles.inner}>
        <ActivityIndicator size={'large'} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};
