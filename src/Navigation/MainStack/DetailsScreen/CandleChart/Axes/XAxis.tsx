import { useMemo } from 'react';
import { TimeScale } from '../scales';
import moment from 'moment';
import { G, Line, Rect, Text } from 'react-native-svg';
import { COLORS } from 'src/constants';
import { CANDLE_CHART_CONFIGS } from 'src/configs';

interface Props {
  x: number;
  y: number;
  timeScale: TimeScale;
  constrainedTouchX: number | null;
  realWidth: number;
}

export const XAxis: React.FC<Props> = ({
  x,
  y,
  timeScale,
  constrainedTouchX,
  realWidth,
}) => {
  const labels = timeScale.getLabels();
  const touchTime = useMemo(() => {
    const touchTimeValue =
      constrainedTouchX === null
        ? 0
        : (timeScale.getTimeFromPosition(constrainedTouchX) as number);
    return moment(touchTimeValue);
  }, [constrainedTouchX, timeScale]);

  return (
    <G x={x} y={y}>
      <Rect
        x={0}
        y={0}
        width={realWidth}
        height={CANDLE_CHART_CONFIGS.LABEL_X_HEIGHT}
        fill={COLORS.black}
      />
      <Line
        x1={0}
        y1={0}
        x2={realWidth}
        y2={0}
        stroke={'grey'}
        strokeWidth='2'
      />

      <G>
        {labels.map(({ date, position }) => {
          return (
            <G key={date.valueOf()} x={position} y={0}>
              <Line
                x1={0}
                y1={0}
                x2={0}
                y2={5}
                stroke={COLORS.grey}
                strokeWidth='2'
              />
              <Text
                x={0}
                y={20}
                fontSize={10}
                stroke={COLORS.grey}
                textAnchor='middle'
                fontWeight='100'
              >
                {date.format('DD MMM')}
              </Text>
            </G>
          );
        })}
      </G>

      {constrainedTouchX !== null && (
        <G x={constrainedTouchX} y={0}>
          <Line
            x1={0}
            y1={0}
            x2={0}
            y2={5}
            stroke={COLORS.white}
            strokeWidth='3'
          />
          <Rect x={-60} y={8} width={120} height={18} fill={COLORS.grey} />
          <Text
            x={0}
            y={20}
            fontSize={10}
            stroke={COLORS.white}
            textAnchor='middle'
            fill={'blue'}
            fontWeight='300'
          >
            {touchTime.format('DD MMM, YYYY HH:mm')}
          </Text>
        </G>
      )}
    </G>
  );
};
