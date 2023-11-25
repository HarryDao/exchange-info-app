import * as d3 from 'd3';

import { Candle } from 'src/types';
import { CANDLE_CHART_CONFIGS } from 'src/configs';

import type { TimeTick } from './TimeScale';

const { PRICE_UNITS_ON_SCREEN, PRICE_PADDING_IN_PERCENTAGES } =
  CANDLE_CHART_CONFIGS;

export interface PriceLabel {
  price: number;
  position: number;
}

export class PriceScale {
  private unit = 0;

  private extent: [number, number] | null = null;

  private scale: d3.ScaleLinear<number, number> | null = null;

  private labels: PriceLabel[] = [];

  constructor(
    private innerDisplayHeight: number,
    private realHeight: number,
    data: Candle[],
  ) {
    this.init(data);
  }

  private init(data: Candle[]) {
    this.calcExtentAndUnit(data);
    this.createScale();
    this.createLabels();
  }

  private calcExtentAndUnit = (data: Candle[]) => {
    const { innerDisplayHeight, realHeight } = this;
    const totalSteps =
      (PRICE_UNITS_ON_SCREEN * realHeight) / innerDisplayHeight;

    const flatted = data.reduce((arr: number[], d) => {
      arr.push(d.high, d.low);
      return arr;
    }, []);

    const [rawMin, rawMax] = d3.extent(flatted) as [number, number];
    const difference = rawMax - rawMin;
    const min = rawMin - (difference * PRICE_PADDING_IN_PERCENTAGES) / 100;
    const max = rawMax + (difference * PRICE_PADDING_IN_PERCENTAGES) / 100;
    const increment = (max - min) / totalSteps;

    let base = 1;
    let number = increment;
    while (number > 10 || number < 1) {
      if (number > 10) {
        base *= 10;
        number /= 10;
      } else if (number < 1) {
        base /= 10;
        number *= 10;
      }
    }

    const unit = Math.floor(number * 2) * (base / 2);

    this.unit = unit;
    this.extent = [Math.floor(min / unit) * unit, Math.ceil(max / unit) * unit];
  };

  private createScale = () => {
    const { realHeight, extent } = this;

    if (!extent) return;

    this.scale = d3.scaleLinear().domain(extent).range([realHeight, 0]);
  };

  private createLabels = () => {
    const { unit, extent, scale } = this;

    if (!extent || !scale) return;

    const [min, max] = extent;
    const labels: PriceLabel[] = [];

    if (min >= max) {
      this.labels = [];
      return;
    }

    for (let add = 0, total = (max - min) / unit; add < total; add += 1) {
      const price = min + unit * add;
      labels.push({
        price,
        position: scale(price),
      });
    }

    this.labels = labels;
  };

  getLabels = () => this.labels;

  getPositionFromPrice = (price: number) => {
    return this.scale ? this.scale(price) : null;
  };

  getPriceFromPosition = (position: number) => {
    return this.scale ? this.scale.invert(position) : null;
  };

  getPositionFromTimeTick = (tick: TimeTick) => {
    const { high, low } = tick;
    const midPrice = (high + low) / 2;

    return this.getPositionFromPrice(midPrice);
  };
}
