import React from 'react';
import styles from './Day4.module.css';

const formatColumnValue = number => (number < 10 ? ' ' + number : number);
const getMarkKey = (rowIdx, colIdx) => `${rowIdx}_${colIdx}`;
const isMarked = (markData, rowIdx, colIdx) =>
  markData.markedPoints[getMarkKey(rowIdx, colIdx)] === true;

const defaultMarkData = {
  markedPoints: {},
  columns: Array.from(Array(5)).map(() => 5),
  rows: Array.from(Array(5)).map(() => 5),
};

const BingoBoard = ({ grid, numbers, onWin }) => {
  const [markData, setMarkData] = React.useState(defaultMarkData);
  const [winningScore, setWinningScore] = React.useState(0);

  React.useEffect(() => {
    if (winningScore > 0) onWin(winningScore);
  }, [winningScore, onWin]);

  // mark drawn numbers when numbers changed
  React.useEffect(() => {
    if (winningScore === 0 && numbers.length > 0) {
      const number = numbers[numbers.length - 1];
      for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
        for (let colIdx = 0; colIdx < grid[rowIdx].length; colIdx++) {
          if (grid[rowIdx][colIdx] === number) {
            setMarkData(curr => ({
              markedPoints: {
                ...curr.markedPoints,
                [getMarkKey(rowIdx, colIdx)]: true,
              },
              columns: curr.columns.map((value, idx) =>
                idx === colIdx ? value - 1 : value
              ),
              rows: curr.rows.map((value, idx) =>
                idx === rowIdx ? value - 1 : value
              ),
            }));
            return;
          }
        }
      }
    }
  }, [numbers, grid, winningScore]);

  // check if any row or column is complete and call onmWin with score
  React.useEffect(() => {
    if (winningScore) return;
    const won =
      markData.columns.some(count => count === 0) ||
      markData.rows.some(count => count === 0);

    if (won) {
      const unmarkedSum = grid.reduce((sum, row, rowIdx) => {
        const colSum = row.reduce(
          (innerSum, col, colIdx) =>
            markData.markedPoints[getMarkKey(rowIdx, colIdx)]
              ? innerSum + 0
              : innerSum + col,
          0
        );
        return sum + colSum;
      }, 0);
      setWinningScore(unmarkedSum * numbers[numbers.length - 1]);
    }
  }, [winningScore, numbers, markData, setWinningScore, grid]);

  return grid ? (
    <div className={styles.board}>
      {grid.map((arr, rowIdx) => (
        <div className={styles.gridRow} key={rowIdx}>
          {arr.map((value, colIdx) => (
            <div
              key={colIdx}
              className={`${styles.gridValue} ${
                isMarked(markData, rowIdx, colIdx) ? styles.marked : ''
              }`}
            >
              {formatColumnValue(value)}
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : null;
};

export default BingoBoard;
