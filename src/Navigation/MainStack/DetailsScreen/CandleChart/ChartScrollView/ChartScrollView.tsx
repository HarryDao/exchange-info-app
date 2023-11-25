import * as d3 from 'd3';
import { Animated, PanResponder, View } from 'react-native';
import {
  DimensionSizes,
  ScrollPosition,
  TouchPosition,
} from '../CandleChart.types';
import { useEffect, useMemo, useRef } from 'react';

const getContrainedValue = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

interface Props {
  children?: React.ReactNode;
  style?: any;
  realDimensions: DimensionSizes;
  innerDisplayDimensions: DimensionSizes;
  initialScrollPosition: ScrollPosition;
  onNewScrollPosition: (position: ScrollPosition) => any;
  onNewTouchPosition: (position: TouchPosition) => any;
}

export const ChartScrollView: React.FC<Props> = ({
  children,
  style,
  onNewScrollPosition,
  onNewTouchPosition,
  innerDisplayDimensions,
  realDimensions,
  initialScrollPosition,
}) => {
  const { minScrollX, minScrollY } = useMemo(() => {
    return {
      minScrollX: innerDisplayDimensions.width - realDimensions.width,
      minScrollY: innerDisplayDimensions.height - realDimensions.height,
    };
  }, [innerDisplayDimensions, realDimensions]);
  const pan = useRef(new Animated.ValueXY(initialScrollPosition)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant(e) {
        onNewTouchPosition({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
        });
        pan.setOffset({
          x: getContrainedValue((pan.x as any).__getValue(), minScrollX, 0),
          y: getContrainedValue((pan.y as any).__getValue(), minScrollY, 0),
        });
        pan.setValue({
          x: 0,
          y: 0,
        });
        return true;
      },
      onPanResponderMove(e, gestureState) {
        onNewTouchPosition({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
        });

        return Animated.event(
          [
            null,
            {
              dx: pan.x,
              dy: pan.y,
            },
          ],
          {
            useNativeDriver: false,
          },
        )(e, gestureState);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  useEffect(() => {
    pan.addListener(({ x, y }) => {
      onNewScrollPosition({
        x: getContrainedValue(x, minScrollX, 0),
        y: getContrainedValue(y, minScrollY, 0),
      });
    });

    return () => {
      pan.removeAllListeners();
    };
  }, [onNewScrollPosition, pan, minScrollX, minScrollY]);

  return (
    <Animated.View style={style} {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};
