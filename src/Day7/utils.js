import { useMemo } from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const simpleCalculateFuel = (from, position) => Math.abs(from - position);

const additiveCalculateFuel = (from, position) => {
  const distance = Math.abs(from - position);
  let sum = 0;
  for (let i = 0; i <= distance; i++) sum += i;
  return sum;
};

const useOptimalPosition = additive => {
  const inputData = useMemo(() => {
    const crabPositions = getInputLines(input)[0]
      .split(',')
      .map(v => parseInt(v));
    let minPosition = Infinity;
    let maxPosition = 0;

    for (let pos of crabPositions) {
      if (pos > maxPosition) maxPosition = pos;
      if (pos < minPosition) minPosition = pos;
    }

    return {
      crabPositions,
      maxPosition,
      minPosition,
    };
  }, []);

  return useMemo(() => {
    const { crabPositions, minPosition, maxPosition } = inputData;
    let optimalPosition = null;
    let optimalFuel = null;

    const calculateFuel = additive
      ? additiveCalculateFuel
      : simpleCalculateFuel;

    for (let i = minPosition; i <= maxPosition; i++) {
      const totalFuel = crabPositions.reduce(
        (sum, pos) => sum + calculateFuel(i, pos),
        0
      );
      if (optimalFuel === null || optimalFuel > totalFuel) {
        optimalPosition = i;
        optimalFuel = totalFuel;
      }
    }

    return {
      optimalPosition,
      optimalFuel,
    };
  }, [additive, inputData]);
};

export { useOptimalPosition };
