import { useCallback } from 'react';
import { LayoutAnimation } from 'react-native';

export const useLayoutAnimation = () => {
  const animate = useCallback(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 100,
    });
  }, []);

  return { animate };
};
