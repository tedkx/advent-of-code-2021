/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Digit from './Digit';
import styles from './Day8.module.css';
import { useNumberSum, useSequenceTranslation } from './utils';

const Day8Part2 = ({ input }) => {
  const { finished, onFinished, onSequenceChange, sequence, sum } =
    useNumberSum();

  useSequenceTranslation(input, onSequenceChange, onFinished);

  return (
    <div className={styles.container}>
      <div className={styles.digitsContainer}>
        {sequence.map((digit, idx) => (
          <Digit digit={digit} key={idx} />
        ))}
      </div>
      <div>Number: {sequence.join('')}</div>
      <div>Sum: {sum}</div>
      <div>Finished: {finished ? 'true' : 'false'}</div>
    </div>
  );
};

export default Day8Part2;
