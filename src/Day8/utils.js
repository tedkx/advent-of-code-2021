import React, { useMemo } from 'react';
import { getInputLines } from '../utils';
import { input } from './input'; // sampleInput|input';

class Sequence {
  constructor(original, ordered = false) {
    this.original = original;
    this.ordered = ordered ? original : Array.from(original).sort().join('');
    this.length = original.length;
  }

  matches(permutation) {
    if (
      typeof permutation !== 'string' ||
      typeof this.original !== 'string' ||
      permutation.length !== this.original.length
    )
      return false;

    return Array.from(permutation).sort().join('') === this.ordered;
  }

  toString() {
    return this.original;
  }

  translate(dictionary) {
    return new Sequence(
      Array.from(this.original)
        .map(letter => dictionary[letter])
        .join('')
    );
  }
}

const segmentsPerDigit = [
  { digit: 0, segments: ['a', 'b', 'c', 'e', 'f', 'g'] },
  { digit: 1, segments: ['c', 'f'] },
  { digit: 2, segments: ['a', 'c', 'd', 'e', 'g'] },
  { digit: 3, segments: ['a', 'c', 'd', 'f', 'g'] },
  { digit: 4, segments: ['b', 'c', 'd', 'f'] },
  { digit: 5, segments: ['a', 'b', 'd', 'f', 'g'] },
  { digit: 6, segments: ['a', 'b', 'd', 'e', 'f', 'g'] },
  { digit: 7, segments: ['a', 'c', 'f'] },
  { digit: 8, segments: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] },
  { digit: 9, segments: ['a', 'b', 'c', 'd', 'f', 'g'] },
].sort((a, b) =>
  a.segments.length > b.segments.length
    ? 1
    : a.segments.length < b.segments.length
    ? -1
    : a.digit > b.digit
    ? 1
    : a.digit < b.digit
    ? -1
    : 0
);

const digitSegments = segmentsPerDigit.reduce((obj, { digit, segments }) => {
  obj[String(digit)] = segments;
  return obj;
}, {});

const getSameLengthDigits = sequence =>
  segmentsPerDigit
    .filter(({ segments }) => segments.length === sequence.length)
    .map(({ digit }) => digit);

const useInput = () =>
  useMemo(() => {
    const split = (str, delim = ' ') => str.split(delim).map(s => s.trim());

    return getInputLines(input).map(line => {
      const [digitsStr, outputStr] = split(line, '|');
      const digits = split(digitsStr);

      const candidateDigits = digits.reduce((obj, sequence) => {
        const sameLengthDigits = getSameLengthDigits(sequence);
        for (let sameLengthDigit of sameLengthDigits) {
          const seq = new Sequence(sequence);
          if (!obj[sameLengthDigit]) obj[sameLengthDigit] = [seq];
          else obj[sameLengthDigit].push(seq);
        }
        return obj;
      }, {});

      return {
        candidateDigits,
        digits,
        output: split(outputStr),
      };
    });
  }, []);

/* Part1 */

const useUniqueSequences = inputData =>
  useMemo(() => {
    const uniques = [];
    for (let { candidateDigits, output } of inputData) {
      for (let sequence of output) {
        const sameLengthDigits = getSameLengthDigits(sequence);
        if (sameLengthDigits.length === 1) {
          for (let digitSequences of sameLengthDigits.map(
            d => candidateDigits[parseInt(d)]
          )) {
            for (let digitSequence of digitSequences)
              if (digitSequence.matches(sequence)) {
                uniques.push(sequence);
                break;
              }
          }
        }
      }
    }
    return uniques;
  }, [inputData]);

/* Part 2 */
const parseDelay = 50;
const segmentNamesArr = Array.from('abcdefg');

const intersect = (array1, array2) =>
  array1.filter(value => array2.includes(value));

const eliminateSegmentsFromWires = (wireToSegment, segments, exceptWires) => {
  const segmentsArr = Array.isArray(segments) ? segments : Array.from(segments);
  const wiresToEliminate = Object.keys(wireToSegment).filter(
    wire => !exceptWires.includes(wire)
  );
  for (let wire of wiresToEliminate) {
    wireToSegment[wire] = wireToSegment[wire].filter(
      s => !segmentsArr.includes(s)
    );
  }
};

// "groups" array by string, returning an array [{ combination (string), length }]
const groupBySegmentCombination = (wireToSegment, lengthMatchWires) => {
  const byString = lengthMatchWires.reduce((obj, str) => {
    const segmentCombination = wireToSegment[str];
    if (!obj[segmentCombination]) obj[segmentCombination] = [];
    obj[segmentCombination].push(str);
    return obj;
  }, {});
  return Object.keys(byString).map(combination => ({
    combination,
    foundOnWires: byString[combination],
  }));
};

const solveWireToSegments = wireToSegment => {
  let sequenceLength = 1;
  const replacedStrings = {};

  while (true) {
    // find wires that have candidate segments of `sequence length`
    // i.e. 2 wires have exactly the same 2 segments means
    // that the segments can be eliminated from other wires
    const lengthMatchWires = Object.keys(wireToSegment).filter(
      key => wireToSegment[key].length === sequenceLength
    );
    const groups = groupBySegmentCombination(wireToSegment, lengthMatchWires);

    let eliminated = 0;
    if (groups.length > 0) {
      for (let { combination, foundOnWires } of groups) {
        if (!replacedStrings[combination]) {
          eliminateSegmentsFromWires(wireToSegment, combination, foundOnWires);
          eliminated++;
          replacedStrings[combination] = true;
        }
      }
    }
    if (eliminated > 0) sequenceLength = 0;

    const solved = Object.values(wireToSegment).every(v => v.length === 1);
    if (solved) break;

    sequenceLength++;
    if (sequenceLength > segmentNamesArr.length) {
      if (eliminated > 0) sequenceLength = 0;
      else break;
    }
  }
};

const getUniqueWireMappings = (orderedCandidates, wireToSegment) => {
  for (let candidate of orderedCandidates.filter(
    c => c.sequences.length === 1
  )) {
    const { sequences } = candidate;

    const s = new Set();
    for (let seq of sequences) for (let char of seq.ordered) s.add(char);
    const sequence = Array.from(s);

    const { segments } = segmentsPerDigit.find(
      ({ segments }) => segments.length === sequence.length
    );

    for (let wire of Object.keys(wireToSegment)) {
      if (sequence.includes(wire))
        wireToSegment[wire] = intersect(wireToSegment[wire], segments);
    }
  }

  solveWireToSegments(wireToSegment);

  return wireToSegment;
};

function getPermuatations(wireToSegment, unsolvedWires, permutationsArr = []) {
  const [{ segments, wires }, ...restUnsolvedWires] = unsolvedWires;

  let segmentIdx = 0,
    wireIdx = 0;
  while (segmentIdx < segments.length) {
    wireIdx = 0;
    const tempWireToSegment = { ...wireToSegment };

    while (wireIdx < wires.length) {
      const wire = wires[wireIdx];
      const segment = segments[segmentIdx % segments.length];
      tempWireToSegment[wire] = [segment];
      eliminateSegmentsFromWires(tempWireToSegment, [segment], [wire]);
      wireIdx++;
      wireIdx++;
    }

    if (restUnsolvedWires.length > 0)
      getPermuatations(tempWireToSegment, restUnsolvedWires, permutationsArr);
    else {
      Object.keys(tempWireToSegment).forEach(key => {
        if (tempWireToSegment[key].length > 1)
          throw new Error(
            `invalid permuatation item ${tempWireToSegment[key]} for ${key}`
          );
        tempWireToSegment[key] = tempWireToSegment[key][0];
      });
      permutationsArr.push(tempWireToSegment);
    }

    segmentIdx++;
  }

  return permutationsArr;
}

const translateWiresToSegments = candidateDigits => {
  let wireToSegment = segmentNamesArr.reduce((obj, seg) => {
    obj[seg] = [...segmentNamesArr];
    return obj;
  }, {});

  let orderedCandidates = Object.keys(candidateDigits)
    .map(digit => ({
      digit,
      sequences: candidateDigits[digit],
    }))
    .sort((a, b) =>
      a.sequences.length > b.sequences.length
        ? 1
        : a.sequences.length < b.sequences.length
        ? -1
        : 0
    );

  // 1. do what you can with uniques
  wireToSegment = getUniqueWireMappings(orderedCandidates, wireToSegment);

  // 2. try with wire assumptions
  // organize by candidate pairs
  const unsolvedWires = Object.values(
    Object.keys(wireToSegment).reduce((obj, wire) => {
      const key = wireToSegment[wire].join('');
      if (key.length > 1) {
        if (!obj[key]) obj[key] = { segments: wireToSegment[wire], wires: [] };
        obj[key].wires.push(wire);
      }
      return obj;
    }, {})
  );

  const permutations = getPermuatations(wireToSegment, unsolvedWires);

  const segmentActualSequences = segmentsPerDigit.map(
    ({ digit, segments }) => ({
      digit,
      sequence: new Sequence(segments.join('')),
    })
  );

  for (let permutation of permutations) {
    let digitSequences = [];
    for (let { digit, sequences } of orderedCandidates) {
      const { sequence: actualSequence } = segmentActualSequences.find(
        s => String(s.digit) === digit
      );

      for (let sequence of sequences) {
        const translated = sequence.translate(permutation);
        if (translated.matches(actualSequence.toString()))
          digitSequences.push({ digit, sequence });
      }
    }

    if (digitSequences.length === 10) return digitSequences;
  }

  return null;
};

const useSequenceTranslation = (inputData, onSequenceChange, onFinished) => {
  const [inputItemsToParse, setInputItemsToParse] = React.useState(null);

  React.useEffect(() => {
    if (inputData) setInputItemsToParse(inputData);
  }, [inputData, setInputItemsToParse]); //eslint-disable-line

  React.useEffect(() => {
    return () => {
      setInputItemsToParse(null);
    };
  }, []);

  React.useEffect(() => {
    if (!inputItemsToParse) return;
    const [{ candidateDigits, output } = {}, ...restItems] = inputItemsToParse;
    if (!candidateDigits) return;

    // translate wires to digit segments
    const translatedDigits = translateWiresToSegments(candidateDigits);

    // transate output to digits using the previous dictionary
    const numbers = [];
    for (let outputSequence of output)
      for (let { sequence, digit } of translatedDigits)
        if (sequence.matches(outputSequence)) numbers.push(digit);

    onSequenceChange(numbers);
    // conitnue or finish
    if (restItems.length === 0) onFinished();
    else setTimeout(() => setInputItemsToParse(restItems), parseDelay);
  }, [inputItemsToParse, onSequenceChange, onFinished]); // [, setInputItemsToParse, onSequenceChange, onFinished]);
};

const useNumberSum = () => {
  const [sum, setSum] = React.useState(0);
  const [sequence, setSequence] = React.useState([]);
  const [finished, setFinished] = React.useState(false);

  const onSequenceChange = React.useCallback(sequence => {
    setSequence(sequence);
    const number = parseInt(sequence.join(''));
    setSum(cur => cur + number);
  }, []);

  const onFinished = React.useCallback(() => setFinished(true), [setFinished]);

  // cleanup
  React.useEffect(() => {
    return () => {
      setSum(0);
      setFinished(false);
      setSequence([]);
    };
  }, []);

  return {
    finished,
    onFinished,
    onSequenceChange,
    sequence,
    sum,
  };
};

export {
  digitSegments,
  useInput,
  useNumberSum,
  useSequenceTranslation,
  useUniqueSequences,
};
