/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day7.module.css';
import { useOptimalPosition } from './utils';

const Day7View = ({ additive }) => {
  const { optimalPosition, optimalFuel } = useOptimalPosition(additive);

  return (
    <div className={styles.container}>
      Optimal Position, {optimalPosition}, Total Fuel: {optimalFuel}
    </div>
  );
};

export default Day7View;
