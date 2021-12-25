/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day14.module.css';
import { usePolymerization } from './utils';

const Day14View = ({ input, maxStep }) => {
  const { leastCommon, length, mostCommon, step } = usePolymerization(
    input,
    maxStep
  );

  return (
    <div className={styles.container}>
      <div>Length: {length}</div>
      <div>Step: {step}</div>
      {leastCommon && mostCommon && (
        <div>
          Commom Elements: {leastCommon}/{mostCommon} -]{' '}
          {mostCommon - leastCommon}
        </div>
      )}
      <br />
    </div>
  );
};

export default Day14View;
