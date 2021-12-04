import React from 'react';
import { input } from './input'; // sampleInput|input';
import { getInputLines } from '../utils';

const createCommandObj = commandText => {
  const [direction, number] = commandText.split(' ');
  return { direction, number: parseInt(number) };
};

const formatCommands = input => getInputLines(input).map(createCommandObj);

const useInitialization = setCommands => {
  const [uiState, setUiState] = React.useState(null);
  React.useEffect(() => {
    setUiState('initialized');
    setCommands(formatCommands(input));
    setTimeout(() => setUiState('started'), 1000);
  }, []); //eslint-disable-line

  return uiState;
};

const useSubmarineTracking = (started, subRef, position) => {
  const scrollRef = React.useRef({
    scrolling: false,
    parentOffset: null,
  });

  // Scroll submarine into view if it moves vertically outside of viewport
  React.useEffect(() => {
    if (!started || scrollRef.current.scrolling) return;

    if (typeof scrollRef.current.parentOffset !== 'number')
      scrollRef.current.parentOffset =
        subRef.parentElement.getBoundingClientRect().top;

    const minY = document.documentElement.scrollTop;
    const maxY =
      minY +
      document.documentElement.clientHeight -
      scrollRef.current.parentOffset;

    // check if submarine outside of view and scroll to it
    if (position.top < minY || position.top > maxY) {
      scrollRef.current.scrolling = true;
      setTimeout(() => {
        scrollRef.current.scrolling = false;
      }, 1000);
      subRef.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [started, position]); //eslint-disable-line
};

export {
  createCommandObj,
  formatCommands,
  useInitialization,
  useSubmarineTracking,
};
