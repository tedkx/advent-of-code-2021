import React from 'react';
import Day9View from './Day9View';
import { useInput } from './utils';

const Day9 = () => {
  const [part1, setPart1] = React.useState(false);
  const [part2, setPart2] = React.useState(false);

  const togglePart = React.useCallback(
    part => {
      setPart1(curr => (part === 'part1' ? !curr : false));
      setPart2(curr => (part === 'part2' ? !curr : false));
    },
    [setPart1, setPart2]
  );

  const input = useInput();

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
      {part1 ? (
        <Day9View input={input} />
      ) : part2 ? (
        <Day9View input={input} showBasins />
      ) : null}
    </div>
  );
};

export default Day9;
