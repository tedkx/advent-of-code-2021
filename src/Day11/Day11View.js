/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day11.module.css';
import { useOctopusFlashing } from './utils';
import OctopusIcon from './octopusIcon';

const Day11View = ({ input, stopCondition }) => {
  const { finished, grid, step, totalFlashes } = useOctopusFlashing(
    input,
    stopCondition
  );

  return (
    <div className={`${styles.container} ${finished ? styles.finished : ''}`}>
      <div>Step: {step}</div>
      <div>Total Flashes: {totalFlashes}</div>
      <br />
      {(grid || []).map(row => (
        <div className={styles.octopusRow}>
          {row.map(({ energy }) => (
            <div className={`${styles.octopus} ${styles[`energy${energy}`]}`}>
              <OctopusIcon className={styles.octopusIcon}>{energy}</OctopusIcon>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Day11View;
