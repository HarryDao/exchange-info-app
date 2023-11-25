import React, { memo, useMemo } from 'react';
import { G, Rect } from 'react-native-svg';

import { Candle } from 'src/types';
import { CANDLE_CHART_CONFIGS } from 'src/configs';
import { COLORS } from 'src/constants';

import type { PriceScale, TimeScale } from '../scales';
import { analyzePrice } from './CandleTick.helpers';

const { TICK_WIDTH } = CANDLE_CHART_CONFIGS;
const PADDING = TICK_WIDTH * 0.2;
const CLOSE_OPEN_WIDTH = TICK_WIDTH - 2 * PADDING;
const HIGH_LOW_WIDTH = CLOSE_OPEN_WIDTH / 4;

interface CandleTickProps {
  data: Candle;
  priceScale: PriceScale;
  timeScale: TimeScale;
}

export const CandleTick: React.FC<CandleTickProps> = ({
  data,
  priceScale,
  timeScale,
}) => {
  const { high, low, time } = data;
  const { upper, lower, isIncrease } = useMemo(
    () => analyzePrice(data),
    [data],
  );

  const HighLow = useMemo(
    () => () => {
      const y1 = priceScale.getPositionFromPrice(high);
      const y2 = priceScale.getPositionFromPrice(low);

      if (y1 === null || y2 === null) return null;

      return (
        <Rect
          x={-HIGH_LOW_WIDTH / 2}
          width={HIGH_LOW_WIDTH}
          y={y1}
          height={y2 - y1}
          fill={isIncrease ? COLORS.greenBright : COLORS.redBright}
        />
      );
    },
    [high, isIncrease, low, priceScale],
  );

  const CloseOpen = useMemo(
    () => () => {
      const y1 = priceScale.getPositionFromPrice(upper);
      const y2 = priceScale.getPositionFromPrice(lower);

      if (y1 === null || y2 === null) return null;

      return (
        <Rect
          x={-CLOSE_OPEN_WIDTH / 2}
          width={CLOSE_OPEN_WIDTH}
          y={y1}
          height={y2 - y1}
          fill={isIncrease ? COLORS.greenBright : COLORS.redBright}
        />
      );
    },
    [isIncrease, lower, upper, priceScale],
  );

  const x = useMemo(() => timeScale.getPosition(time) || 0, [timeScale, time]);

  return (
    <G x={x}>
      <CloseOpen />
      <HighLow />
    </G>
  );
};

export const MemoCandleTick = memo(CandleTick);
