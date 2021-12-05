import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const numberDrawInterval = 100;

const useInput = () => {
  const inputObj = React.useMemo(() => {
    const [numbers, ...lines] = getInputLines(input);

    const grids = [];
    let currentGrid = null;
    for (let line of lines) {
      if (line.replace(/ /g, '').length === 0) {
        if (currentGrid) grids.push(currentGrid);
        currentGrid = null;
      } else {
        if (!currentGrid) currentGrid = [];
        currentGrid.push(
          Array.from(Array(5)).map((_, idx) =>
            parseInt(line.substr(idx * 3, 2))
          )
        );
      }
    }

    if (currentGrid) grids.push(currentGrid);

    return {
      grids,
      numbers: numbers.split(',').map(num => parseInt(num)),
    };
  }, []);

  return inputObj;
};

const useNumberDrawing = ({ numbers }, winningBoardScore) => {
  const [remainingNumbers, setRemainingNumbers] = React.useState([]);
  const [drawnNumbers, setDrawnNumbers] = React.useState([]);
  React.useEffect(() => {
    if (numbers) setRemainingNumbers(numbers);
  }, [numbers]);

  // Dequeue effect every `numberDrawInterval` millis
  React.useEffect(() => {
    if (remainingNumbers.length > 0 && !winningBoardScore) {
      const [drawnNumber, ...newRemainingNumbers] = remainingNumbers;
      setDrawnNumbers(curr => [...curr, drawnNumber]);
      setTimeout(
        () => setRemainingNumbers(newRemainingNumbers),
        numberDrawInterval
      );
    }
  }, [remainingNumbers, winningBoardScore]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      setRemainingNumbers([]);
      setDrawnNumbers([]);
    };
  }, []);

  return drawnNumbers;
};

const useBoardWinning = () => {
  const [winningBoardScore, setWinningBoardScore] = React.useState(0);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      setWinningBoardScore(0);
    };
  }, []);

  return [winningBoardScore, setWinningBoardScore];
};

export { useBoardWinning, useInput, useNumberDrawing };
