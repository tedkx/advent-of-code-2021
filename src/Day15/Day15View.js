/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day15.module.css';
import { useInput, useMinimumRiskLevel } from './utils';

const Day15View = ({ expanded }) => {
  const input = useInput(expanded);

  const lowestTotalRisk = useMinimumRiskLevel(input);

  return (
    <div className={styles.container}>Lowest Total Risk: {lowestTotalRisk}</div>
  );
};

export default Day15View;
