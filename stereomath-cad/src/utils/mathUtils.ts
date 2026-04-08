export const EPSILON = 1e-5;

export const isZero = (val: number): boolean => {
  return Math.abs(val) < EPSILON;
};

export const isEqual = (a: number, b: number): boolean => {
  return isZero(a - b);
};
