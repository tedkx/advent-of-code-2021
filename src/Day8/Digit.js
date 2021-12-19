import React from 'react';
import styles from './Day8.module.css';
import { digitSegments } from './utils';

const segments = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const Digit = ({ digit }) => {
  const activeSegments = React.useMemo(
    () =>
      segments.reduce((obj, segment) => {
        obj[segment] = digitSegments[digit].includes(segment.toLowerCase());
        return obj;
      }, {}),
    [digit]
  );

  return (
    <div className={styles.digitContainer}>
      {segments.map(s => (
        <div
          key={s}
          className={`${styles.segment} ${styles[`segment${s}`]} ${
            activeSegments[s] ? styles.active : ''
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Digit;
