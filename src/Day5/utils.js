import { useCallback, useEffect, useState } from 'react';
import { getInputLines } from '../utils';
import { input } from './sampleInput'; // sampleInput|input';

const commandInterval = 30;

const fillArrayUpToIdx = (arr, idx, fillValue) => {
  for (let i = 0; i <= idx; i++)
    if (!arr[i]) arr[i] = fillValue === 'array' ? [] : fillValue;
};

const registerSegment = (arr, x, y) => {
  if (!arr[y]) arr[y] = [];
  arr[y][x] = (arr[y][x] || 0) + 1;
  return arr;
};

const useVentParsing = allowDiagonal => {
  const [ventLines, setVentLines] = useState(null);
  const [gridData, setGridData] = useState(null);

  // command/ventline and grid/maxX/maxY initialization
  useEffect(() => {
    setTimeout(() => {
      const ventLines = [];
      let maxX = 0,
        maxY = 0;
      for (let line of getInputLines(input)) {
        const ventLine = line.split(' -> ').reduce((obj, item, idx) => {
          const [x, y] = item.split(',').map(value => parseInt(value));
          obj[idx === 0 ? 'from' : 'to'] = { x, y };
          return obj;
        }, {});

        const { from, to } = ventLine;

        if (from.x > maxX) maxX = from.x;
        else if (to.x > maxX) maxX = to.x;
        if (from.y > maxY) maxY = from.y;
        else if (to.y > maxY) maxY = to.y;
        ventLines.push(ventLine);
      }
      const grid = [];
      fillArrayUpToIdx(grid, maxY, 'array');
      for (let i = 0; i < grid.length; i++) fillArrayUpToIdx(grid[i], maxX, 0);

      setGridData({ grid, ventLines, maxX, maxY });
      setVentLines(ventLines);
    }, commandInterval);
  }, [allowDiagonal]);

  // modify grid according to vent line coordinates
  const parseVentLine = useCallback(
    ventLine => {
      const { from, to } = ventLine;
      const { grid } = gridData;

      const staticDimension =
        from.x === to.x ? 'x' : from.y === to.y ? 'y' : null;
      if (!staticDimension && !allowDiagonal) return;

      const span = staticDimension === 'x' ? [from.y, to.y] : [from.x, to.x];
      const max = Math.max(...span);
      const min = Math.min(...span);

      if (staticDimension === 'x') {
        // X,y1 -> X,y2
        for (let i = min; i <= max; i++) registerSegment(grid, from.x, i);
      } else if (staticDimension === 'y') {
        // x1,Y -> x2,Y
        for (let i = min; i <= max; i++) registerSegment(grid, i, from.y);
      } else {
        // x1,y1 -> x2,y2
        const stepX = from.x > to.x ? -1 : 1;
        const stepY = from.y > to.y ? -1 : 1;
        const iterations = Math.abs(from.x - to.x);
        let curX = from.x;
        let curY = from.y;
        for (let i = 0; i <= iterations; i++) {
          registerSegment(grid, curX, curY);
          curX += stepX;
          curY += stepY;
        }
      }

      setGridData(current => ({
        ...current,
        grid,
      }));
    },
    [gridData, allowDiagonal]
  );

  // begin parsing vent line coordinates on interval
  useEffect(() => {
    if (ventLines && ventLines.length > 0) {
      const [ventLine, ...restVentLines] = ventLines;
      parseVentLine(ventLine);
      setTimeout(() => setVentLines(restVentLines), commandInterval);
    }
  }, [ventLines]); //eslint-disable-line

  return {
    grid: gridData?.grid || null,
    complete: ventLines && ventLines.length === 0,
    ventLinesLeft: ventLines?.length || null,
  };
};

export { useVentParsing };
