import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Day1.module.css';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const measurementWindowSize = 3;

const getIncreases = measurements =>
  measurements.reduce(
    (obj, item) => {
      var num = parseInt(item);
      if (obj.last !== null && obj.last < num) obj.increases++;
      obj.last = num;
      return obj;
    },
    { last: null, increases: 0 }
  ).increases;

const Day1Part1 = () => {
  const increases = React.useMemo(
    () => getIncreases(getInputLines(input).map(line => parseInt(line))),
    []
  );

  return <div className={styles.container}>INCREASES: {increases}</div>;
};

const Day1Part2 = () => {
  const measurementWindowSums = React.useMemo(() => {
    const lines = getInputLines(input).map(line => parseInt(line));
    const sums = [];

    for (let i = 0; i <= lines.length - measurementWindowSize; i++)
      sums.push(lines.slice(i, i + 3).reduce((sum, item) => sum + item, 0));

    return sums;
  }, []);

  const increases = React.useMemo(
    () => (measurementWindowSums ? getIncreases(measurementWindowSums) : null),
    [measurementWindowSums]
  );

  return <div className={styles.container}>INCREASES: {increases}</div>;
};

const Day1 = () => {
  const [part1, setPart1] = React.useState(false);
  const [part2, setPart2] = React.useState(false);

  const togglePart1 = React.useCallback(() => setPart1(curr => !curr), [
    setPart1,
  ]);
  const togglePart2 = React.useCallback(() => setPart2(curr => !curr), [
    setPart2,
  ]);

  return (
    <div className={styles.container}>
      <h2>Day1 </h2>
      <div className={styles.partContainer}>
        <h3>
          Part 1{' '}
          <button onClick={togglePart1}>{part1 ? 'Hide' : 'Show'}</button>
        </h3>
        <TransitionGroup>
          {part1 && (
            <CSSTransition key="part1" classNames="fade-down" timeout={250}>
              <Day1Part1 />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
      <div className={styles.partContainer}>
        <h3>
          Part 2{' '}
          <button onClick={togglePart2}>{part2 ? 'Hide' : 'Show'}</button>
        </h3>
        <TransitionGroup>
          {part2 && (
            <CSSTransition key="part2" classNames="fade-down" timeout={250}>
              <Day1Part2 />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default Day1;
