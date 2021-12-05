import React from 'react';
//import styles from './Day4.module.css';
import Day4Part1 from './Part1';
import Day4Part2 from './Part2';

const Day4 = () => {
  const [part1, setPart1] = React.useState(true);
  const [part2, setPart2] = React.useState(false);

  const togglePart = React.useCallback(
    part => {
      setPart1(curr => (part === 'part1' ? !curr : false));
      setPart2(curr => (part === 'part2' ? !curr : false));
    },
    [setPart1, setPart2]
  );

  return (
    <div>
      <div className={`part-selector visible`}>
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
      {part1 ? <Day4Part1 /> : part2 ? <Day4Part2 /> : null}
    </div>
  );
};

export default Day4;
