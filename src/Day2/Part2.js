import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './Day2.module.css';
import { useInitialization, useSubmarineTracking } from './utils';

const positionFactors = { x: 10, y: 0.008 };
const commandInterval = 30;

const Day2Part2 = ({ parent }) => {
  const subRef = React.useRef(null);

  const { commands, setCommands, uiState } = useInitialization();

  const [position, setPosition] = React.useState({
    aim: 0,
    left: 25,
    top: 300,
    x: 0,
    y: 0,
  });

  // Dequeue and parse commands until none left
  React.useEffect(() => {
    if (uiState === 'started' && commands && commands.length > 0) {
      const [{ direction, number }, ...restCommands] = commands;

      setPosition(pos =>
        direction === 'forward'
          ? {
              ...pos,
              left: pos.left + number * positionFactors.x,
              x: pos.x + number,
              top: pos.top + number * pos.aim * positionFactors.y,
              y: pos.y + number * pos.aim,
            }
          : direction === 'up'
          ? { ...pos, aim: pos.aim - number }
          : direction === 'down'
          ? { ...pos, aim: pos.aim + number }
          : pos
      );

      setTimeout(() => setCommands(restCommands), commandInterval);
    }
  }, [uiState, commands, setCommands]);

  // when all commands done, show result
  const result = React.useMemo(
    () => (commands && commands.length === 0 ? position.x * position.y : null),
    [commands, position]
  );

  useSubmarineTracking(uiState === 'started', subRef.current, position);

  return (
    <>
      <div
        ref={subRef}
        className={`${styles.submarine} ${
          uiState !== null ? styles.visible : ''
        }`}
        style={{
          left: position.left % parent.clientWidth,
          top: position.top,
        }}
      ></div>
      <TransitionGroup>
        {result && (
          <CSSTransition key="part1" classNames="fade-up" timeout={250}>
            <div className={styles.result} style={{ top: position.top }}>
              Result: <strong>{result}</strong>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </>
  );
};

export default Day2Part2;
