export * from './style';

export const formatPrice = (number: number) => {
  if (number >= 1) {
    return number.toPrecision(5);
  } else {
    return number.toPrecision(4);
  }
};
