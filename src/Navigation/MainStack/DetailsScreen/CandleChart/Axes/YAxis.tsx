import { useMemo } from 'react';
import { PriceScale } from '../scales';
import { G, Line, Rect, Text } from 'react-native-svg';
import { CANDLE_CHART_CONFIGS } from 'src/configs';
import { COLORS } from 'src/constants';
import { formatPrice } from 'src/helpers';

interface Props {
  x: number;
  y: number;
  realHeight: number;
  priceScale: PriceScale;
  constrainedTouchY: number | null;
  currentPrice: number;
}

export const YAxis: React.FC<Props> = ({
  x,
  y,
  realHeight,
  priceScale,
  constrainedTouchY,
  currentPrice,
}) => {
  const labels = priceScale.getLabels();

  const touchPrice = useMemo(() => {
    if (constrainedTouchY === null) return -1;
    return priceScale.getPriceFromPosition(constrainedTouchY) as number;
  }, [constrainedTouchY, priceScale]);

  const currentPricePosition = useMemo(() => {
    return priceScale.getPositionFromPrice(currentPrice);
  }, [priceScale, currentPrice]);

  return (
    <G x={x} y={y}>
      <Rect
        x={0}
        y={0}
        width={CANDLE_CHART_CONFIGS.LABEL_Y_WIDTH}
        height={realHeight}
        fill={COLORS.black}
      />

      <Line
        x1={0}
        y1={0}
        x2={0}
        y2={realHeight}
        stroke={COLORS.grey}
        strokeWidth={2}
      />

      <G>
        {priceScale.getLabels().map(({ price, position }) => {
          return (
            <G key={price} x={0} y={position}>
              <Line
                x1={0}
                y1={0}
                x2={5}
                y2={0}
                stroke={COLORS.grey}
                strokeWidth='2'
              />
              <Text
                x={10}
                fontSize={10}
                stroke={COLORS.grey}
                alignmentBaseline='middle'
                fontWeight='100'
              >
                {formatPrice(price)}
              </Text>
            </G>
          );
        })}
      </G>

      {currentPricePosition !== null && (
        <G x={0} y={currentPricePosition}>
          <Rect x={5} y={-10} width={40} height={20} fill={COLORS.blue} />
          <Line
            x1={0}
            y1={0}
            x2={5}
            y2={0}
            stroke={COLORS.blue}
            strokeWidth='2'
          />
          <Text
            x={10}
            fontSize={10}
            stroke={COLORS.white}
            fontWeight='300'
            alignmentBaseline='middle'
          >
            {formatPrice(currentPrice)}
          </Text>
        </G>
      )}

      {constrainedTouchY !== null && (
        <G x={0} y={constrainedTouchY}>
          <Rect x={5} y={-10} width={40} height={20} fill={COLORS.grey} />
          <Line
            x1={0}
            y1={0}
            x2={5}
            y2={0}
            stroke={COLORS.grey}
            strokeWidth='2'
          />
          <Text
            x={10}
            fontSize={10}
            stroke={COLORS.white}
            fontWeight='300'
            alignmentBaseline='middle'
          >
            {formatPrice(touchPrice)}
          </Text>
        </G>
      )}
    </G>
  );
};
