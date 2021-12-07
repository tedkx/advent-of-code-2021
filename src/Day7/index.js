import React from 'react';
import Day7View from './Day7View';

const Day7 = () => {
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
      {part1 ? <Day7View /> : part2 ? <Day7View additive /> : null}
    </div>
  );
};

export default Day7;
