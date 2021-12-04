import React from 'react';
import styles from './Day2.module.css';

const dimension = 50 - 2 * 5; // div width - 2 * negative margin

const getWavesNum = elem =>
  !elem ? 0 : Math.round((elem.clientWidth || elem.offsetWidth) / dimension);

const Waves = () => {
  const divRef = React.useRef(null);
  const [wavesNum, setWavesNum] = React.useState(getWavesNum(divRef.current));

  const handleResize = React.useCallback(
    e => setWavesNum(Math.round(getWavesNum(divRef.current))),
    []
  );

  React.useEffect(() => {
    handleResize(divRef.current);
  }, [divRef.current]); // eslint-disable-line

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // eslint-disable-line

  return (
    <div ref={divRef} className={styles.waves} id="">
      {Array.from(Array(wavesNum)).map((_, idx) => (
        <div key={idx}></div>
      ))}
    </div>
  );
};

export default Waves;
