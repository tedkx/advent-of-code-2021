import React from 'react';
import Day6View from './Day6View';

const baseBreakpoint = 10000;

const Day6 = () => {
  const [part1, setPart1] = React.useState(false);
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
      {part1 ? (
        <Day6View days={80} fishRowBreakpoint={10000} />
      ) : part2 ? (
        <Day6View
          days={256}
          fishRowBreakpoint={Math.pow(baseBreakpoint, 2) * 200}
        />
      ) : null}
    </div>
  );
};

export default Day6;
