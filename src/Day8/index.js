import React from 'react';
import Part1 from './Part1';
import Part2 from './Part2';
import { useInput } from './utils';

const Day8 = () => {
  const [part1, setPart1] = React.useState(false);
  const [part2, setPart2] = React.useState(false);

  const togglePart = React.useCallback(
    part => {
      setPart1(curr => (part === 'part1' ? !curr : false));
      setPart2(curr => (part === 'part2' ? !curr : false));
    },
    [setPart1, setPart2]
  );

  const inputData = useInput();

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
        <Part1 input={inputData} />
      ) : part2 ? (
        <Part2 input={inputData} />
      ) : null}
    </div>
  );
};

export default Day8;
