import { G, Rect } from 'react-native-svg';
import { XAxis } from './XAxis';
import {
  DimensionSizes,
  ScrollPosition,
  TouchPosition,
} from '../CandleChart.types';
import { PriceScale, TimeScale } from '../scales';
import { YAxis } from './YAxis';
import { CANDLE_CHART_CONFIGS } from 'src/configs';
import { COLORS } from 'src/constants';

interface Props {
  innerDisplayDimensions: DimensionSizes;
  realDimensions: DimensionSizes;
  scrollPosition: ScrollPosition;
  timeScale: TimeScale;
  priceScale: PriceScale;
  constrainedTouch: TouchPosition;
  currentPrice: number;
}

export const Axes: React.FC<Props> = ({
  innerDisplayDimensions,
  realDimensions,
  scrollPosition,
  timeScale,
  priceScale,
  constrainedTouch,
  currentPrice,
}) => {
  return (
    <G>
      <XAxis
        x={0}
        y={innerDisplayDimensions.height - scrollPosition.y}
        realWidth={realDimensions.width}
        constrainedTouchX={constrainedTouch.x}
        timeScale={timeScale}
      />
      <YAxis
        x={innerDisplayDimensions.width - scrollPosition.x}
        y={0}
        realHeight={realDimensions.height}
        priceScale={priceScale}
        constrainedTouchY={constrainedTouch.y}
        currentPrice={currentPrice}
      />
      <Rect
        x={innerDisplayDimensions.width - scrollPosition.x - 1}
        y={innerDisplayDimensions.height - scrollPosition.y - 1}
        width={CANDLE_CHART_CONFIGS.LABEL_Y_WIDTH + 2}
        height={CANDLE_CHART_CONFIGS.LABEL_X_HEIGHT + 2}
        fill={COLORS.black}
      />
    </G>
  );
};
