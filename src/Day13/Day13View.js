/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day13.module.css';
import { useFolding } from './utils';

const Day13View = ({ input }) => {
  const { firstFoldVisibleDots, grid } = useFolding(input);

  return grid ? (
    <div className={styles.container}>
      {firstFoldVisibleDots && (
        <div>First Fold Visible Dots: {firstFoldVisibleDots}</div>
      )}
      <br />
      {grid.map(arr => (
        <div>{arr.map(x => (x === 1 ? '#' : '.'))}</div>
      ))}
    </div>
  ) : null;
};

export default Day13View;
