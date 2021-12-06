/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day6.module.css';
import { input } from './input';

const dayIntervalMillis = 40;
const defaultFishTimer = 6;
const newBornFishTimer = defaultFishTimer + 2;

const initialFishObj = Array.from(Array(newBornFishTimer)).reduce(
  (obj, _, idx) => {
    obj[idx] = 0;
    return obj;
  },
  {}
);

const Day6View = ({ days, fishRowBreakpoint }) => {
  const [fish, setFish] = React.useState(null);
  const birthsRef = React.useRef({ day: 1, timeoutId: null });

  // fish reproduction process
  const dayPassed = React.useCallback(
    fish => {
      if (!fish || birthsRef.current.day > days) return;

      // advance fish indices by one
      const newFishObj = Object.keys(fish)
        .map(timer => parseInt(timer))
        .reduce(
          (obj, timer) => {
            if (timer === 0) obj[newBornFishTimer] = fish[timer];
            else obj[timer - 1] = fish[timer];
            return obj;
          },
          { ...initialFishObj }
        );

      // number of newbord = number of parents
      // add this to the parent reset timer index
      newFishObj[defaultFishTimer] += newFishObj[newBornFishTimer];

      setFish(newFishObj);
      birthsRef.current.day++;
    },
    [days]
  );

  // trigger fish reproduction process
  React.useEffect(() => {
    if (fish)
      birthsRef.current.timeoutId = setTimeout(
        () => dayPassed(fish),
        dayIntervalMillis
      );
  }, [fish]);

  const fishCount = React.useMemo(
    () =>
      fish ? Object.values(fish).reduce((sum, value) => sum + value, 0) : null,
    [fish]
  );

  // row number and final row width (percent) calculation
  const rowWidths = React.useMemo(() => {
    const rows = Math.floor(fishCount / fishRowBreakpoint);
    const remainder = fishCount % fishRowBreakpoint;

    return Array.from(Array(rows))
      .map(() => '100%')
      .concat(`${(100 * remainder) / fishRowBreakpoint}%`);
  }, [fishCount]);

  // initialization / cleanup effect
  React.useEffect(() => {
    setFish(
      input
        .trim()
        .split(',')
        .reduce(
          (obj, timer) => {
            obj[parseInt(timer)]++;
            return obj;
          },
          { ...initialFishObj }
        )
    );
    return () => {
      setFish(null);
      clearTimeout(birthsRef.current.timeoutId);
      birthsRef.current.timeoutId = null;
      birthsRef.current.day = 1;
    };
  }, [days, fishRowBreakpoint]);

  return fish ? (
    <div className={styles.container}>
      <div>Fish Count: {fishCount}</div>
      <div className={styles.sea}>
        <div className={styles.seaBg}></div>
        {rowWidths.length > 0 &&
          rowWidths.map((width, idx) => (
            <div key={idx} className={styles.seaRow} style={{ width }}>
              {' '}
            </div>
          ))}
      </div>
    </div>
  ) : null;
};

export default Day6View;
