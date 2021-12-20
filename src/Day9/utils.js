import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

class Point {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
  }

  isIn(x, y) {
    return this.x === x && this.y === y;
  }

  equals(otherPoint) {
    return otherPoint && this.x === otherPoint.x && this.y === otherPoint.y;
  }
}

const useInput = () =>
  React.useMemo(
    () =>
      getInputLines(input).map(str =>
        Array.from(str).map(char => parseInt(char))
      ),
    []
  );

const getAdjacentPoints = (input, x, y) =>
  [
    [y - 1, x],
    [y, x - 1],
    [y + 1, x],
    [y, x + 1],
  ]
    .filter(
      ([ay, ax]) =>
        ax >= 0 && ax < input[0].length && ay >= 0 && ay < input.length
    )
    .map(([ay, ax]) => new Point(ax, ay, input[ay][ax]));

const useLowPointCalculation = input => {
  const lowPoints = React.useMemo(() => {
    if (!input) return null;

    const lowPointsArr = [];
    const length = input[0].length;

    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < length; x++) {
        const point = new Point(x, y, input[y][x]);

        const adjacentValues = getAdjacentPoints(input, x, y).map(
          point => point.value
        );

        const isLowPoint = Math.min(...adjacentValues) > point.value;

        if (isLowPoint) lowPointsArr.push(point);
      }
    }

    return lowPointsArr;
  }, [input]);

  const riskLevelSum = React.useMemo(
    () =>
      lowPoints ? lowPoints.reduce((sum, p) => sum + p.value + 1, 0) : null,
    [lowPoints]
  );

  return {
    lowPoints,
    riskLevelSum,
  };
};

const walkThroughBasin = (input, allBasinPoints, point, basinPoints = []) => {
  basinPoints.push(point);
  allBasinPoints.push(point);

  const incrementingPoints = getAdjacentPoints(input, point.x, point.y).filter(
    p => p.value > point.value && p.value < 9
  );

  for (let nextPoint of incrementingPoints)
    if (!allBasinPoints.some(bp => bp.equals(nextPoint)))
      walkThroughBasin(input, allBasinPoints, nextPoint, basinPoints);

  return basinPoints.length;
};

const useBasins = (input, lowPoints) => {
  const basins = React.useMemo(() => {
    if (!lowPoints || !input) return null;
    const allBasinPoints = [];
    return lowPoints && input
      ? lowPoints.map(p => walkThroughBasin(input, allBasinPoints, p))
      : //[walkThroughBasin(input, allBasinPoints, lowPoints[0])]
        null;
  }, [lowPoints, input]);

  const basinProduct = React.useMemo(() => {
    if (!basins) return null;
    const largest = [...basins]
      .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
      .filter((_, idx) => idx < 3);
    console.log(basins, 'largest', largest);
    return largest.reduce((product, basin) => basin * product, 1);
  }, [basins]);

  return {
    basins,
    basinProduct,
  };
};

export { useBasins, useInput, useLowPointCalculation };
