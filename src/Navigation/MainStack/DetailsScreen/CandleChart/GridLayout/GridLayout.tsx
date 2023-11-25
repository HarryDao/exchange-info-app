import React, { useMemo } from 'react';
import { G, Line } from 'react-native-svg';

import { COLORS } from 'src/constants';

import type { PriceScale, TimeScale } from '../scales';
import { DimensionSizes, TouchPosition } from '../CandleChart.types';

interface GridLayoutProps {
  realDimensions: DimensionSizes;
  timeScale: TimeScale | null;
  priceScale: PriceScale | null;
  constrainedTouch: TouchPosition;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  realDimensions,
  timeScale,
  priceScale,
  constrainedTouch,
}) => {
  const priceLabels = useMemo(
    () => priceScale?.getLabels() ?? [],
    [priceScale],
  );
  const timeLabels = useMemo(() => timeScale?.getLabels() ?? [], [timeScale]);

  return (
    <G>
      <G>
        {timeLabels.map(({ position }) => {
          return (
            <Line
              key={position}
              x1={position}
              y1={0}
              x2={position}
              y2={realDimensions.height}
              stroke={COLORS.grey}
              strokeWidth='0.5'
              strokeDasharray='1 1'
            />
          );
        })}
      </G>

      <G>
        {priceLabels.map(({ position }) => {
          return (
            <Line
              key={position}
              x1={0}
              y1={position}
              x2={realDimensions.width}
              y2={position}
              stroke={COLORS.grey}
              strokeWidth='0.5'
              strokeDasharray='1 1'
            />
          );
        })}
      </G>

      <G>
        {constrainedTouch.x !== null && (
          <Line
            x1={constrainedTouch.x}
            x2={constrainedTouch.x}
            y1={0}
            y2={realDimensions.height}
            stroke={COLORS.white}
            strokeWidth='0.7'
            strokeDasharray='5 5'
          />
        )}

        {constrainedTouch.y !== null && (
          <Line
            x1={0}
            x2={realDimensions.width}
            y1={constrainedTouch.y}
            y2={constrainedTouch.y}
            stroke={COLORS.aqua}
            strokeWidth='0.7'
            strokeDasharray='5 5'
          />
        )}
      </G>
    </G>
  );
};
