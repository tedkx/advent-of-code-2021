import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';
import styles from './Day3.module.css';
import { ratings, getRatingValue } from './utils';

const Day3Part2 = () => {
  const list = getInputLines(input);

  const result = React.useMemo(() => {
    const oxygenGeneratorRating = getRatingValue(ratings.oxygenGenerator, list);
    const co2ScrubberRating = getRatingValue(ratings.co2Scrubber, list);
    const oxygenGeneratorRatingDec = parseInt(oxygenGeneratorRating, 2);
    const co2ScrubberRatingDec = parseInt(co2ScrubberRating, 2);

    return {
      oxygenGeneratorRating,
      oxygenGeneratorRatingDec,
      co2ScrubberRating,
      co2ScrubberRatingDec,
      lifeSupportRating: oxygenGeneratorRatingDec * co2ScrubberRatingDec,
    };
  }, [list]);

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {list.map((line, idx) => (
          <div key={idx}>{Array.from(line).join(' ')}</div>
        ))}
      </div>
      {result && (
        <>
          <div className={styles.result}>
            {result.oxygenGeneratorRating} = {result.oxygenGeneratorRatingDec}
          </div>
          <div className={styles.result}>
            {result.co2ScrubberRating} = {result.co2ScrubberRatingDec}
          </div>
          <div className={styles.result}>
            <strong>{result.lifeSupportRating}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Day3Part2;
