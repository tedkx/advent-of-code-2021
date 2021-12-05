import React from 'react';
import styles from './Day5.module.css';
import { useVentParsing } from './utils';
import VentSegment from './VentSegment';

const Day5View = ({ allowDiagonal }) => {
  const { grid, complete, ventLinesLeft } = useVentParsing(allowDiagonal);
  const [result, setResult] = React.useState(null);

  // when parsing complete, sum the overlapping nodes
  React.useEffect(() => {
    if (complete)
      setResult(
        grid.reduce((sum, row) => {
          const rowSum = row.reduce(
            (innerSum, value) => innerSum + (value >= 2 ? 1 : 0),
            0
          );
          return sum + rowSum;
        }, 0)
      );
  }, [grid, complete]);

  // cleanup effect
  React.useEffect(() => {
    return () => setResult(null);
  }, []);

  return grid ? (
    <div className={styles.container}>
      {ventLinesLeft !== null && ventLinesLeft > 0 && (
        <div>
          Vent Lines Left: <strong>{ventLinesLeft}</strong>
        </div>
      )}
      {result ? (
        <div>
          Result: <strong>{result}</strong>
        </div>
      ) : null}
      {grid.length < 100 ? (
        <div className={styles.gridContainer}>
          {grid.map(arr => (
            <div className={styles.gridRow}>
              {arr.map(value => (
                <VentSegment value={value} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <br />
          GRID TOO LARGE, SORRY, NOT SORRY
        </>
      )}
    </div>
  ) : null;
};

export default Day5View;
