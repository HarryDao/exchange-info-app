import { useMemo } from 'react';
import * as d3 from 'd3';
import { Candle } from 'src/types';
import { HISTORICAL_LINE_CHART } from 'src/configs';
import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { COLORS } from 'src/constants';

interface Props {
  candles: Candle[];
  current: number;
}

export const LineChart: React.FC<Props> = ({ candles, current }) => {
  const line = useMemo(() => {
    const timeDomain = d3.extent(candles.map((c) => c.time)) as [
      number,
      number,
    ];
    const priceDomain = d3.extent(candles.map((c) => c.close)) as [
      number,
      number,
    ];

    const scaleX = d3
      .scaleTime()
      .domain(timeDomain)
      .range([0, HISTORICAL_LINE_CHART.width]);
    const scaleY = d3
      .scaleLinear()
      .domain(priceDomain)
      .range([HISTORICAL_LINE_CHART.height, 0]);

    return (
      d3
        .line<Candle>()
        .x((d) => scaleX(d.time))
        .y((d) => scaleY(d.close))
        .curve(d3.curveBasis)(candles) || undefined
    );
  }, [candles]);

  const strokeColor = useMemo(() => {
    const lastPrice = candles.length ? candles[0].close : null;
    if (lastPrice === null || current === lastPrice) return COLORS.white;
    return current > lastPrice ? COLORS.greenBright : COLORS.redBright;
  }, [candles, current]);

  return (
    <View>
      <Svg
        width={HISTORICAL_LINE_CHART.width}
        height={HISTORICAL_LINE_CHART.height}
      >
        <Path
          d={line}
          stroke={strokeColor}
          fill='transparent'
          strokeWidth={HISTORICAL_LINE_CHART.strokeWidth}
        />
      </Svg>
    </View>
  );
};
