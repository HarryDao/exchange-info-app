import { ScaledSize } from 'react-native';
import { CANDLE_CHART_CONFIGS } from 'src/configs';
import {
  DimensionSizes,
  ScrollPosition,
  TouchPosition,
} from './CandleChart.types';
import { PriceScale, TimeScale } from './scales';

export const calculateDisplayDimensions = (windows: ScaledSize) => {
  const { width } = windows;
  const outer: DimensionSizes = {
    width,
    height: width / CANDLE_CHART_CONFIGS.PORTRAIT_DISPLAY_ASPECT_RATIO,
  };
  const inner: DimensionSizes = {
    width: width - CANDLE_CHART_CONFIGS.LABEL_Y_WIDTH,
    height: outer.height - CANDLE_CHART_CONFIGS.LABEL_X_HEIGHT,
  };
  return {
    outerDisplayDimensions: outer,
    innerDisplayDimensions: inner,
  };
};

export const calculateRealDimensions = (
  innerDisplayDimensions: DimensionSizes,
  count: number,
): DimensionSizes => {
  const width =
    (count - 1) * CANDLE_CHART_CONFIGS.TICK_WIDTH +
    innerDisplayDimensions.width;
  return {
    width,
    height: width / CANDLE_CHART_CONFIGS.REAL_ASPECT_RATIO,
  };
};

export const constrainTouchPosition = (
  touchPosition: TouchPosition,
  scrollPosition: ScrollPosition,
  realDimensions: DimensionSizes,
): TouchPosition => {
  const touchX =
    touchPosition.x === null ? null : touchPosition.x - scrollPosition.x;
  const touchY =
    touchPosition.y === null ? null : touchPosition.y - scrollPosition.y;
  return {
    x: (() => {
      if (touchX === null) return null;
      if (touchX < 0 || touchX > realDimensions.width) return null;
      return touchX;
    })(),
    y: (() => {
      if (touchY === null) return null;
      if (touchY < 0 || touchY > realDimensions.height) return null;
      return touchY;
    })(),
  };
};

export const findYPosition = (
  scrollX: number,
  timeScale: TimeScale,
  priceScale: PriceScale,
  realDimensions: DimensionSizes,
  innerDisplayDimensions: DimensionSizes,
  scrollY?: number,
) => {
  let result = scrollY || 0;

  const midX = -scrollX + innerDisplayDimensions.width;
  const tick = timeScale.getTickFromPosition(midX);
  if (!tick) return result;

  const midY = priceScale.getPositionFromTimeTick(tick);
  if (midY === null) return result;

  result = Math.min(
    realDimensions.height - innerDisplayDimensions.height,
    Math.max(midY - innerDisplayDimensions.height / 2, 0),
  );

  return result * -1;
};
