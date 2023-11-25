import { useSelector } from 'react-redux';
import { currentPricesSelectors } from 'src/redux/currentPrices';
import { dataConfigsSelectors } from 'src/redux/dataConfigs';
import { socketSelectors } from 'src/redux/socket';

export const useIsInitialSetupReady = () => {
  const isSocketReady = useSelector(socketSelectors.isSocketReady);
  const isSocketError = useSelector(socketSelectors.isSocketError);

  const dataConfigsLoading = useSelector(dataConfigsSelectors.getLoading);
  const dataConfigsError = useSelector(dataConfigsSelectors.getError);

  const currentPricesLoading = useSelector(currentPricesSelectors.getLoading);
  const currentPricesError = useSelector(currentPricesSelectors.getError);

  const isReady =
    isSocketReady &&
    !dataConfigsLoading &&
    !dataConfigsError &&
    !currentPricesLoading &&
    !currentPricesError;

  return {
    isReady,
    isSocketReady,
    isSocketError,
    dataConfigsError,
    dataConfigsLoading,
    currentPricesError,
    currentPricesLoading,
  };
};
