/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day10.module.css';
import {
  useLineCompletionScore,
  useLineParsing,
  useSyntaxErrorScore,
} from './utils';

const Day10View = ({ input, showIncomplete }) => {
  const lines = useLineParsing(input);
  const score = useSyntaxErrorScore(lines);

  const lineCompletionScore = useLineCompletionScore(
    showIncomplete ? lines : {}
  );

  return (
    <div className={styles.container}>
      <div>Syntax Error Score: {score}</div>
      <div>Line Completion Score: {lineCompletionScore}</div>
    </div>
  );
};

export default Day10View;
