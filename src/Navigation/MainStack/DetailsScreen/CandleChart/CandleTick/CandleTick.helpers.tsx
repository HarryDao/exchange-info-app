import { Candle } from 'src/types';

export const analyzePrice = ({ open, close }: Candle) => {
  let upper: number;
  let lower: number;

  if (open > close) {
    upper = open;
    lower = close;
  } else {
    upper = close;
    lower = open;
  }

  return {
    upper,
    lower,
    isIncrease: open < close,
  };
};
