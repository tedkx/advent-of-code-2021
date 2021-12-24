import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const useInput = () =>
  React.useMemo(() => {
    const grid = [];
    const instructions = [];
    const points = [];
    let maxX = 0;
    let maxY = 0;
    let emptyLineReached = false;

    getInputLines(input).forEach(line => {
      if (line.trim() === '') {
        emptyLineReached = true;
      } else if (emptyLineReached) {
        const foldData = line.replace('fold along ', '').split('=');
        instructions.push({
          axis: foldData[0] === 'x' ? 'y' : 'x',
          foldIndex: parseInt(foldData[1]),
        });
      } else {
        const [x, y] = line.split(',').map(value => parseInt(value));
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        points.push(new Point(x, y));
      }
    });

    for (let y = 0; y <= maxY; y++)
      grid[y] = Array.from(Array(maxX + 1)).map(() => 0);

    for (let p of points) grid[p.y][p.x] = 1;

    return {
      grid,
      instructions,
      points,
    };
  }, []);

const foldDelay = 1000;

const fold = (grid, { axis, foldIndex }) => {
  const newGrid = [];
  if (axis === 'x') {
    for (let y = 0; y < foldIndex; y++) {
      newGrid[y] = [];
      for (let x = 0; x < grid[0].length; x++) {
        newGrid[y][x] = Math.max(grid[y][x], grid[2 * foldIndex - y][x]);
      }
    }
  } else if (axis === 'y') {
    for (let y = 0; y < grid.length; y++) {
      newGrid[y] = [];
      for (let x = 0; x < foldIndex; x++)
        newGrid[y][x] = Math.max(grid[y][x], grid[y][2 * foldIndex - x]);
    }
  }

  return newGrid;
};

const useFolding = ({ grid, instructions }) => {
  const foldRef = React.useRef({ firstFoldVisibleDots: null });
  const [foldData, setFoldData] = React.useState(null);

  React.useEffect(() => {
    if (instructions && grid)
      setFoldData({ instructionsLeft: instructions, foldedGrid: grid });
  }, [instructions, grid]); //eslint-disable-line

  React.useEffect(() => {
    const { instructionsLeft, foldedGrid } = foldData || {};
    if (instructionsLeft?.length) {
      const [instruction, ...restInstructions] = instructionsLeft;

      const newGrid = fold(foldedGrid, instruction);

      setTimeout(
        () =>
          setFoldData({
            instructionsLeft: restInstructions,
            foldedGrid: newGrid,
          }),
        foldDelay
      );
    }
  }, [foldData]); //eslint-disable-line

  React.useEffect(() => {
    if (
      foldData &&
      foldData.instructionsLeft.length === instructions.length - 1
    )
      foldRef.current.firstFoldVisibleDots = foldData?.foldedGrid.reduce(
        (sum, arr) => sum + arr.reduce((innerSum, num) => innerSum + num, 0),
        0
      );
  }, [foldData, instructions]);

  return {
    firstFoldVisibleDots: foldRef.current.firstFoldVisibleDots,
    grid: foldData?.foldedGrid,
  };
};

export { useFolding, useInput };
