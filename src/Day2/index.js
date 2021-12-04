import React from 'react';
import styles from './Day2.module.css';
import Waves from './Waves';
import Day2Part1 from './Part1';
import Day2Part2 from './Part2';

const Day2 = () => {
  const [part1, setPart1] = React.useState(false);
  const [part2, setPart2] = React.useState(false);

  const togglePart = React.useCallback(
    part => {
      setPart1(curr => (part === 'part1' ? !curr : false));
      setPart2(curr => (part === 'part2' ? !curr : false));
    },
    [setPart1, setPart2]
  );

  const seaRef = React.useRef(null);
  const [level, setLevel] = React.useState('bottom'); // bottom|riring|risen

  React.useEffect(() => {
    setLevel('rising');

    setTimeout(() => {
      setLevel('risen');
    }, 1000);
  }, []); // eslint-disable-line

  return (
    <div
      className={`${styles.container} ${level !== 'bottom' ? styles.rise : ''}`}
      ref={seaRef}
    >
      <div className={`part-selector ${level === 'risen' ? 'visible' : ''}`}>
        <span
          className={part1 ? 'bold' : ''}
          onClick={() => togglePart('part1')}
        >
          Part 1
        </span>
        <span
          className={part2 ? 'bold' : ''}
          onClick={() => togglePart('part2')}
        >
          Part 2
        </span>
      </div>
      <Waves />
      <div className={styles.sea} />
      {part1 ? (
        <Day2Part1 parent={seaRef.current} />
      ) : part2 ? (
        <Day2Part2 parent={seaRef.current} />
      ) : null}
    </div>
  );
};

export default Day2;
