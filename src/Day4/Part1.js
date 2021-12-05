import React from 'react';
import styles from './Day4.module.css';
import { useBoardWinning, useInput, useNumberDrawing } from './utils';
import BingoBoard from './BingoBoard';

const Day4Part1 = () => {
  const input = useInput();

  const [winningBoardScore, setWinningBoardScore] = useBoardWinning();

  const drawnNumbers = useNumberDrawing(input, winningBoardScore);

  return (
    <div className={styles.container}>
      <div className={styles.drawnNumbers}>
        Drawn Numbers: <strong>{drawnNumbers.join(',')}</strong>
      </div>
      {winningBoardScore > 0 && (
        <>
          WinningBoardScore: <strong>{winningBoardScore}</strong>
        </>
      )}
      <div className={styles.boardsContainer}>
        {input.grids.map((g, idx) => (
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

export default Day4Part1;
