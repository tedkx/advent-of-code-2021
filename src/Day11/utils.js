import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const maxSteps = 100;
const stepDelay = 150;

class Octopus {
  constructor(x, y, energy) {
    this.x = x;
    this.y = y;
    this.energy = energy;
  }

  flash() {
    this.energy = 0;
  }
}

const getNeighbouringOctopuses = (grid, octopus) => {
  const neighbours = [];
  const minX = Math.max(octopus.x - 1, 0);
  const maxX = Math.min(octopus.x + 1, grid[0].length - 1);
  const minY = Math.max(octopus.y - 1, 0);
  const maxY = Math.min(octopus.y + 1, grid.length - 1);
  for (let x = minX; x <= maxX; x++)
    for (let y = minY; y <= maxY; y++) neighbours.push(grid[y][x]);

  return neighbours;
};

const flashOctopus = (grid, octopus, flashedArr) => {
  if (octopus.energy > 9) {
    flashedArr.push(octopus);
    octopus.flash();

    const neighbours = getNeighbouringOctopuses(grid, octopus);
    for (let neighbour of neighbours) {
      if (neighbour.energy > 0) neighbour.energy++;
      if (neighbour.energy > 9) flashOctopus(grid, neighbour, flashedArr);
    }
  }
};

const useInput = () =>
  React.useMemo(
    () =>
      getInputLines(input).map(line =>
        Array.from(line).map(char => parseInt(char))
      ),
    []
  );

const useOctopusFlashing = (initialGrid, stopCondition) => {
  const flashRef = React.useRef({ grid: null, timeoutId: null });
  const [step, setStep] = React.useState(0);
  const [totalFlashes, setTotalFlashes] = React.useState(0);
  const [currentFlashes, setCurrentFlashes] = React.useState([]);

  const totalOctopuses = React.useMemo(
    () => (initialGrid ? initialGrid.length * initialGrid[0].length : null),
    [initialGrid]
  );

  const onStep = React.useCallback(() => {
    const { grid } = flashRef.current;
    if (!grid) return;

    let flashedOnCurrentStep = [];

    // increase energy
    for (let y = 0; y < grid.length; y++)
      for (let x = 0; x < grid[y].length; x++) grid[y][x].energy++;

    // flash octopuses
    for (let y = 0; y < grid.length; y++)
      for (let x = 0; x < grid[y].length; x++)
        if (grid[y][x].energy > 9)
          flashOctopus(grid, grid[y][x], flashedOnCurrentStep);

    setTotalFlashes(curr => curr + flashedOnCurrentStep.length);
    setCurrentFlashes(flashedOnCurrentStep);
    setStep(curr => curr + 1);
  }, []);

  const finished = React.useMemo(
    () =>
      stopCondition === 'max-steps'
        ? step >= maxSteps
        : stopCondition === 'simultaneous-flash'
        ? totalOctopuses === currentFlashes.length
        : false,
    [stopCondition, step, totalOctopuses, currentFlashes]
  );

  React.useEffect(() => {
    if (initialGrid && !finished) {
      if (!flashRef.current.grid)
        flashRef.current.grid = initialGrid.map((row, y) =>
          row.map((energy, x) => new Octopus(x, y, energy))
        );

      setTimeout(onStep, stepDelay);
    }
  }, [initialGrid, step, finished]); //eslint-disable-line

  React.useEffect(() => {
    return () => {
      setTotalFlashes(0);
      setCurrentFlashes([]);
      setStep(0);
      flashRef.current.grid = null;
      clearTimeout(flashRef.current.timeoutId);
      flashRef.current.timeoutId = null; //eslint-disable-line
    };
  }, [initialGrid, stopCondition]);

  return {
    finished: step >= maxSteps,
    grid: flashRef.current.grid,
    step,
    totalFlashes,
  };
};

export { useInput, useOctopusFlashing };
