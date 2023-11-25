import { useNavigation } from '@react-navigation/native';

import { ListTabNavigation, DetailScreenNavigationProp } from 'src/types';

export const useListTabNavigation = () => {
  return {
    navigation: useNavigation<ListTabNavigation>(),
  };
};

export const useDetailScreenNavigation = () => {
  return {
    navigation: useNavigation<DetailScreenNavigationProp>(),
  };
};
