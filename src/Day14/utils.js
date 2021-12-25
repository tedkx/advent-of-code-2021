import React from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

const useInput = () =>
  React.useMemo(() => {
    // eslint-disable-next-line
    const [template, _, ...insertionRules] = getInputLines(input);
    const insertionRulesMap = new Map();
    insertionRules.forEach(rule => {
      const [pair, inserted] = rule.split(' -> ');
      insertionRulesMap.set(pair, inserted);
    });
    return {
      template,
      insertionRules: insertionRulesMap,
    };
  }, []);

const polymerize = (pairsMap, polymerOccurences, insertionRules) => {
  const newMap = new Map();

  for (let [pair, pairOccurences] of pairsMap) {
    const letter = insertionRules.get(pair);
    if (letter) {
      const prevKey = `${pair[0]}${letter}`;
      const nextKey = `${letter}${pair[1]}`;
      newMap.set(prevKey, (newMap.get(prevKey) || 0) + pairOccurences);
      newMap.set(nextKey, (newMap.get(nextKey) || 0) + pairOccurences);
      polymerOccurences[letter] =
        (polymerOccurences[letter] || 0) + pairOccurences;
    }
  }

  return newMap;
};

const getMostLeastCommonQuantities = occurences => {
  const ordered = Object.values(occurences).sort((a, b) =>
    a > b ? 1 : a < b ? -1 : 0
  );
  return { least: ordered[0], most: ordered[ordered.length - 1] };
};

const ruleDelay = 500;

const initializePolymerizationData = input => {
  if (!input) return {};
  const { template, insertionRules } = input;

  const occurences = {};
  const pairsMap = new Map();
  const templateArr = Array.from(template);
  templateArr.forEach((polymer, idx) => {
    occurences[polymer] = (occurences[polymer] || 0) + 1;
    if (idx > 0) pairsMap.set(`${templateArr[idx - 1]}${polymer}`, 1);
  });

  return {
    insertionRules,
    occurences,
    pairsMap,
    step: 0,
  };
};

const usePolymerization = (input, maxStep) => {
  const polyRef = React.useRef({ timeoutId: null });
  const [polymerizationStatus, setPolymerizationStatus] = React.useState(null);
  const [commonElements, setCommonElements] = React.useState(null);

  React.useEffect(() => {
    setPolymerizationStatus(initializePolymerizationData(input));
  }, [input, maxStep]);

  React.useEffect(() => {
    const { insertionRules, length, occurences, pairsMap, step } =
      polymerizationStatus || {};

    if (!pairsMap) return;

    if (step && step >= maxStep) {
      // max steps reached, get most/least common elements
      setCommonElements(getMostLeastCommonQuantities(occurences));
    } else {
      console.time('polymerization');
      const newPairsMap = polymerize(
        pairsMap,
        occurences,
        insertionRules,
        length
      );
      console.timeEnd('polymerization');

      setTimeout(
        () =>
          setPolymerizationStatus({
            insertionRules,
            step: (step || 0) + 1,
            occurences,
            pairsMap: newPairsMap,
          }),
        ruleDelay
      );
    }
  }, [polymerizationStatus]); //eslint-disable-line

  React.useEffect(() => {
    return () => {
      clearTimeout(polyRef.current.timeoutId);
      polyRef.current.timeoutId = null; //eslint-disable-line
      setPolymerizationStatus(initializePolymerizationData(input));
    };
  }, [maxStep]); //eslint-disable-line

  return {
    template: polymerizationStatus?.template,
    leastCommon: commonElements?.least,
    length: polymerizationStatus?.length,
    mostCommon: commonElements?.most,
    step: polymerizationStatus?.step,
  };
};

export { useInput, usePolymerization };
