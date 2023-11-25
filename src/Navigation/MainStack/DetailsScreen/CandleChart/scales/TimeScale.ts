import * as d3 from 'd3';
import moment, { Moment } from 'moment';

import { Candle } from 'src/types';
import { CANDLE_CHART_CONFIGS } from 'src/configs';

const {
  TIME_HORIZONTAL_PADDING_TO_SCREEN_WIDTH_RATIO,
  TIME_UNITS_ON_DISPLAY,
  TICK_WIDTH,
} = CANDLE_CHART_CONFIGS;

type TimeInMs = number;

export interface TimeLabel {
  date: Moment;
  position: number;
}

export interface TimeTick extends Candle {
  date: Moment;
}

export class TimeScale {
  private ticks: TimeTick[] = [];

  private labels: TimeLabel[] = [];

  private extent: [Moment, Moment] | null = null;

  private scale: d3.ScaleLinear<number, number> | null = null;

  private paddingInTicks = 0;

  constructor(
    private innerDisplayWidth: number,
    private realWidth: number,
    data: Candle[],
  ) {
    this.init(data);
  }

  private init(data: Candle[]) {
    this.paddingInTicks = Math.floor(
      (this.innerDisplayWidth * TIME_HORIZONTAL_PADDING_TO_SCREEN_WIDTH_RATIO) /
        TICK_WIDTH,
    );

    this.createTicks(data);
    this.createTimeExtent();
    this.createScale();
    this.createLabels();
  }

  private createTicks = (data: Candle[]) => {
    this.ticks = data
      .map((candle) => {
        return {
          ...candle,
          date: moment(candle.time),
        };
      })
      .sort((a, b) => (a.time < b.time ? -1 : 1));
  };

  private createTimeExtent = () => {
    const { ticks, paddingInTicks } = this;
    const [rawMin, rawMax] = d3.extent(ticks.map((tick) => tick.date));

    const min = moment(rawMin).subtract(paddingInTicks, 'day');
    const max = moment(rawMax).add(paddingInTicks, 'day');

    this.extent = [min, max];
  };

  private createScale = () => {
    const { extent, realWidth } = this;

    if (extent) {
      this.scale = d3
        .scaleLinear()
        .domain(extent.map((m) => m.valueOf()))
        .range([0, realWidth]);
    }
  };

  private createLabels = () => {
    const { ticks, scale, innerDisplayWidth, realWidth, paddingInTicks } = this;

    if (!scale) return;

    const totalUnits = (TIME_UNITS_ON_DISPLAY * realWidth) / innerDisplayWidth;
    const tickSpans = ticks.length + 2 * paddingInTicks - 1;
    const spanInTickUnits = Math.floor(tickSpans / totalUnits);

    const labels: TimeLabel[] = [];

    for (let index = ticks.length - 1; index >= 0; index -= 1) {
      if ((ticks.length - 1 - index) % spanInTickUnits === 0) {
        const { date } = ticks[index];
        labels.push({
          date,
          position: scale(date.valueOf()),
        });
      }
    }

    this.labels = labels;
  };

  getExtent = () => this.extent;

  getLabels = () => this.labels;

  getPosition = (input: TimeInMs | Moment) => {
    if (!this.scale) return null;

    if (typeof input === 'number') {
      return this.scale(input);
    }

    return this.scale(input.valueOf());
  };

  getTimeFromPosition = (position: number) => {
    return this.scale ? this.scale.invert(position) : null;
  };

  getTickFromPosition = (position: number) => {
    const timeInMs = this.getTimeFromPosition(position);

    if (timeInMs === null) return null;

    return this.getTickFromTime(timeInMs);
  };

  getTickFromTime = (timeInMs: number) => {
    const { ticks } = this;

    if (!ticks.length) return null;

    const date = moment(timeInMs);
    const earliestTick = ticks[0];
    const latestTick = ticks[ticks.length - 1];

    if (date >= latestTick.date) {
      return latestTick;
    }
    if (date <= earliestTick.date) {
      return earliestTick;
    }

    let startIndex = 0;
    let endIndex = ticks.length - 1;

    while (startIndex <= endIndex) {
      if (startIndex === endIndex) {
        return ticks[startIndex];
      }

      const midIndex = Math.floor((startIndex + endIndex) / 2);
      const mid = ticks[midIndex];

      if (date <= mid.date && date >= ticks[midIndex - 1].date) {
        return mid;
      }
      if (date > mid.date) {
        startIndex = midIndex + 1;
      } else {
        endIndex = midIndex;
      }
    }

    return null;
  };
}
