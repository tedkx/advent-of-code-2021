/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day8.module.css';
import { useUniqueSequences } from './utils';

const Day8Part1 = ({ input }) => {
  const uniques = useUniqueSequences(input);
  return (
    <div className={styles.container}>Unique Sequences: {uniques.length}</div>
  );
};

export default Day8Part1;
