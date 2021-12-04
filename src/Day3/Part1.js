import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';
import styles from './Day3.module.css';

const Day3Part2 = () => {
  const list = getInputLines(input);

  const result = React.useMemo(() => {
    let gammaArr = [],
      epsilonArr = [];
    for (let i = 0; i < list[0].length; i++) {
      const occs = list.reduce(
        (obj, line) => {
          obj[line[i] === '1' ? 'ones' : 'zeroes']++;
          return obj;
        },
        { zeroes: 0, ones: 0 }
      );
      gammaArr.push(occs.zeroes > occs.ones ? '0' : '1');
      epsilonArr.push(occs.zeroes < occs.ones ? '0' : '1');
    }
    const gamma = gammaArr.join('');
    const epsilon = epsilonArr.join('');

    const obj = {
      gamma,
      gammaDec: parseInt(gamma, 2),
      epsilon,
      epsilonDec: parseInt(epsilon, 2),
    };
    obj.powerConsumption = obj.gammaDec * obj.epsilonDec;
    return obj;
  }, [list]);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {list.map(line => (
          <div>{Array.from(line).join(' ')}</div>
        ))}
      </div>
      {result && (
        <>
          <div className={styles.result}>
            {result.gamma} = {result.gammaDec}
          </div>
          <div className={styles.result}>
            {result.epsilon} = {result.epsilonDec}
          </div>
          <div className={styles.result}>
            <strong>{result.powerConsumption}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Day3Part2;
