import React from 'react';
import { getInputLines } from '../utils';
import { input } from './sampleInput'; // sampleInput|input';

const useInput = expanded => {
  const grid = React.useMemo(
    () =>
      getInputLines(input).map(line => Array.from(line).map(v => parseInt(v))),
    []
  );

  const expandedGrid = React.useMemo(() => {
    if (!grid || !expanded) return grid;
    const baseY = grid.length;
    const baseX = grid[0].length;
    return Array.from(Array(baseY * 5)).map((_, y) =>
      Array.from(Array(baseX * 5)).map((_, x) => {
        const additional = Math.floor(y / baseY) + Math.floor(x / baseX);
        const risk = grid[y % grid.length][x % grid[0].length] + additional;
        return risk > 9 ? risk % 9 : risk;
      })
    );
  }, [grid, expanded]);

  return expandedGrid;
};

class Point {
  constructor(x, y, totalRisk) {
    this.x = x;
    this.y = y;
    this.totalRisk = totalRisk;
  }
}

const getPositionTotalRisk = (riskLevels, totalCosts, x, y) => {
  const adjacents = [
    ((totalCosts[y] || [])[x + 1] || {}).totalRisk || null,
    ((totalCosts[y + 1] || [])[x] || {}).totalRisk || null,
  ].filter(a => a !== null);
  const riskLevel = x === 0 && y === 0 ? 0 : riskLevels[y][x];
  return new Point(
    x,
    y,
    riskLevel + (adjacents.length === 0 ? 0 : Math.min(...adjacents))
  );
};

const calculateTotalCostForAxis = ({
  calculationAxis,
  calculationStart,
  riskLevels,
  totalCosts,
}) => {
  const [x, y] = calculationStart;

  if (calculationAxis === 'x')
    for (let i = x; i >= 0; i -= 1)
      totalCosts[y][i] = getPositionTotalRisk(riskLevels, totalCosts, i, y);
  else
    for (let i = y; i >= 0; i -= 1)
      totalCosts[i][x] = getPositionTotalRisk(riskLevels, totalCosts, x, i);

  return totalCosts;
};

const getInitialTotalCostData = input =>
  input
    ? {
        calculationAxis: 'y',
        calculationStart: [(input[0]?.length || 0) - 1, input.length - 1],
        riskLevels: input,
        totalCosts: input.map(arr => arr.map(() => null)),
      }
    : null;

const useMinimumRiskLevel = input => {
  const riskRef = React.useRef({ timeoutId: null });
  const [totalCostData, setTotalCostData] = React.useState(null);
  const [lowestTotalRisk, setLowestTotalRisk] = React.useState(null);

  React.useEffect(() => {
    if (input) setTotalCostData(getInitialTotalCostData(input));
    return () => {
      clearTimeout(riskRef.current.timeoutId);
      riskRef.current.timeoutId = null; //eslint-disable-line
      setLowestTotalRisk(null);
      setTotalCostData(null);
    };
  }, [input]);

  React.useEffect(() => {
    if (totalCostData) {
      const {
        calculationAxis: axis,
        calculationStart: start,
        totalCosts,
      } = totalCostData;

      if (start[0] < 0 || start[1] < 0) {
        console.log(
          'total costs',
          totalCosts.map(arr => arr.map(p => p.totalRisk))
        );
        setLowestTotalRisk(totalCosts[0][0].totalRisk);
      } else {
        const newTotalCosts = calculateTotalCostForAxis(totalCostData);

        const calculationAxis = axis === 'x' ? 'y' : 'x';
        const calculationStart =
          axis === 'x' ? [start[0] - 1, start[1] - 1] : start;

        if (
          (totalCosts.length - calculationStart[0]) % 10 === 0 &&
          axis === 'x'
        )
          console.log('calculating, ', calculationStart[0], 'left ...');

        riskRef.current.timeoutId = setTimeout(() =>
          setTotalCostData({
            ...totalCostData,
            calculationAxis,
            calculationStart,
            totalCosts: newTotalCosts,
          })
        );
      }
    }
  }, [totalCostData]); //eslint-disable-line

  return lowestTotalRisk;
};

export { useInput, useMinimumRiskLevel };
