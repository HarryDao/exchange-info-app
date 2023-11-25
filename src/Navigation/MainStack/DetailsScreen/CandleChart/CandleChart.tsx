import { Text, makeStyles } from '@rneui/base';
import { View, useWindowDimensions } from 'react-native';
import { G, Rect, Svg } from 'react-native-svg';
import { CANDLE_CHART_CONFIGS } from 'src/configs';
import { Candle, Current } from 'src/types';
import {
  calculateDisplayDimensions,
  calculateRealDimensions,
  constrainTouchPosition,
  findYPosition,
} from './CandleChart.helpers';
import { useCallback, useMemo, useState } from 'react';
import { PriceScale, TimeScale } from './scales';
import { ScrollPosition, TouchPosition } from './CandleChart.types';
import { ChartScrollView } from './ChartScrollView';
import { GridLayout } from './GridLayout';
import { Axes } from './Axes';
import { MemoCandleTick } from './CandleTick';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
    paddingTop: `${100 / CANDLE_CHART_CONFIGS.PORTRAIT_DISPLAY_ASPECT_RATIO}%`,
    position: 'relative',
    borderWidth: 2,
    borderStyle: 'solid',
    zIndex: 1,
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
}));

interface Props {
  data: Candle[];
  currentPrice: number;
}

export const CandleChart: React.FC<Props> = ({ data, currentPrice }) => {
  const windowDimensions = useWindowDimensions();
  const { innerDisplayDimensions } = useMemo(
    () => calculateDisplayDimensions(windowDimensions),
    [windowDimensions],
  );
  const realDimensions = useMemo(
    () => calculateRealDimensions(innerDisplayDimensions, data.length),
    [innerDisplayDimensions, data.length],
  );

  const timeScale = useMemo(
    () =>
      new TimeScale(innerDisplayDimensions.width, realDimensions.width, data),
    [innerDisplayDimensions.width, realDimensions.width, data],
  );
  const priceScale = useMemo(
    () =>
      new PriceScale(
        innerDisplayDimensions.height,
        realDimensions.height,
        data,
      ),
    [innerDisplayDimensions.height, realDimensions.height, data],
  );

  const initialScrollPosition = useMemo(() => {
    const x = innerDisplayDimensions.width - realDimensions.width;
    const y = findYPosition(
      x,
      timeScale,
      priceScale,
      realDimensions,
      innerDisplayDimensions,
    );
    return { x, y };
  }, []);

  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>(
    initialScrollPosition,
  );
  const [touchPosition, setTouchPosition] = useState<TouchPosition>({
    x: null,
    y: null,
  });

  const handleNewScrollPosition = useCallback(
    (newScroll: ScrollPosition) => {
      setScrollPosition(newScroll);
    },
    [innerDisplayDimensions, realDimensions, timeScale, priceScale],
  );

  const handleNewTouchPosition = useCallback((newTouch: TouchPosition) => {
    setTouchPosition(newTouch);
  }, []);

  const constrainedTouch = useMemo(
    () => constrainTouchPosition(touchPosition, scrollPosition, realDimensions),
    [touchPosition, scrollPosition, realDimensions],
  );

  const styles = useStyles();

  return (
    <View style={styles.wrapper}>
      <ChartScrollView
        style={[styles.scrollView]}
        onNewScrollPosition={handleNewScrollPosition}
        onNewTouchPosition={handleNewTouchPosition}
        realDimensions={realDimensions}
        innerDisplayDimensions={innerDisplayDimensions}
        initialScrollPosition={initialScrollPosition}
      >
        <Svg style={styles.svg}>
          <G x={scrollPosition.x} y={scrollPosition.y}>
            <GridLayout
              timeScale={timeScale}
              priceScale={priceScale}
              realDimensions={realDimensions}
              constrainedTouch={constrainedTouch}
            />

            <G>
              {data.map((data) => {
                return (
                  <MemoCandleTick
                    key={data.time}
                    data={data}
                    priceScale={priceScale}
                    timeScale={timeScale}
                  />
                );
              })}
            </G>

            <Axes
              innerDisplayDimensions={innerDisplayDimensions}
              realDimensions={realDimensions}
              scrollPosition={scrollPosition}
              timeScale={timeScale}
              priceScale={priceScale}
              constrainedTouch={constrainedTouch}
              currentPrice={currentPrice}
            />
          </G>
        </Svg>
      </ChartScrollView>
    </View>
  );
};
