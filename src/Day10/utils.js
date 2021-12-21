import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const chunkOpeners = ['(', '[', '{', '<'];
const chunkClosers = [')', ']', '}', '>'];
const illegalCloserPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const incompleteCloserPoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const useInput = () => React.useMemo(() => getInputLines(input), []);

const parseLine = line => {
  let stack = [];
  for (let char of Array.from(line)) {
    if (chunkOpeners.includes(char)) {
      stack.push(char);
    } else {
      const opener = stack.pop();
      const chunkCloserIndex = chunkClosers.findIndex(c => c === char);
      if (chunkOpeners[chunkCloserIndex] !== opener)
        return { type: 'corrupted', illegalChar: char };
    }
  }

  return {
    line,
    stack,
    type: stack.length > 0 ? 'incomplete' : 'complete',
  };
};

const useLineParsing = input =>
  React.useMemo(
    () =>
      input.reduce(
        (obj, inputItem) => {
          const { type, ...rest } = parseLine(inputItem);
          obj[type].push({ line: inputItem, ...rest });
          return obj;
        },
        { corrupted: [], incomplete: [], complete: [] }
      ),
    [input]
  );

const useSyntaxErrorScore = ({ corrupted }) =>
  React.useMemo(
    () =>
      (corrupted || []).reduce(
        (sum, { illegalChar }) => sum + illegalCloserPoints[illegalChar],
        0
      ),
    [corrupted]
  );

const useLineCompletionScore = ({ incomplete }) => {
  const lineCompletionChunks = React.useMemo(
    () =>
      (incomplete || []).map(({ stack }) =>
        stack
          .map(opener => {
            const chunkOpenerIndex = chunkOpeners.findIndex(c => c === opener);
            return chunkClosers[chunkOpenerIndex];
          })
          .reverse()
      ),
    [incomplete]
  );

  const lineCompletionScores = React.useMemo(
    () =>
      (lineCompletionChunks || [])
        .reduce(
          (arr, closers) => [
            ...arr,
            closers.reduce(
              (sum, closer) => sum * 5 + incompleteCloserPoints[closer],
              0
            ),
          ],
          []
        )
        .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0)),
    [lineCompletionChunks]
  );

  return lineCompletionScores[Math.floor(lineCompletionScores.length / 2)];
};

export {
  useInput,
  useLineCompletionScore,
  useLineParsing,
  useSyntaxErrorScore,
};
