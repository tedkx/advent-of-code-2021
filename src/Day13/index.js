import React from 'react';
import Day13View from './Day13View';
import { useInput } from './utils';

const Day13 = () => {
  const [start, setStart] = React.useState(false);

  const toggleStart = React.useCallback(
    () => setStart(curr => !curr),
    [setStart]
  );

  const input = useInput();

  return (
    <div>
      <div className={`part-selector visible`}>
        <span
          className={start ? 'bold' : ''}
          onClick={() => toggleStart('part1')}
        >
          Start
        </span>
      </div>
      {start ? <Day13View input={input} /> : null}
    </div>
  );
};

export default Day13;
