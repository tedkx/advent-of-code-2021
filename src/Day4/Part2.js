import React from 'react';
import styles from './Day4.module.css';
import { useBoardWinning, useInput, useNumberDrawing } from './utils';
import BingoBoard from './BingoBoard';

const Day4Part2 = () => {
  const input = useInput();

  const [winningBoardScore, setWinningBoardScore] = useBoardWinning();

  // always send 0 as `winningBoardScore` so that drawing doesn't stop on win
  const drawnNumbers = useNumberDrawing(input, 0);

  const { grids, numbers } = input;

  return (
    <div className={styles.container}>
      <div className={styles.drawnNumbers}>
        Drawn Numbers: <strong>{drawnNumbers.join(', ')}</strong>
      </div>
      {drawnNumbers.length === numbers.length && (
        <>
          WinningBoardScore: <strong>{winningBoardScore}</strong>
        </>
      )}
      <div className={styles.boardsContainer}>
        {grids.map((g, idx) => (
          <BingoBoard
            key={idx}
            grid={g}
            numbers={drawnNumbers}
            onWin={setWinningBoardScore}
          />
        ))}
      </div>
    </div>
  );
};

export default Day4Part2;
