/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day9.module.css';
import { useBasins, useLowPointCalculation } from './utils';

const Day9View = ({ input, showBasins }) => {
  const { lowPoints, riskLevelSum } = useLowPointCalculation(input);

  const { basinProduct } = useBasins(showBasins ? input : null, lowPoints);

  return (
    <div className={styles.container}>
      <div>Risk Level Sum: {riskLevelSum}</div>
      {showBasins && <div>Basins: {basinProduct}</div>}
    </div>
  );
};

export default Day9View;
