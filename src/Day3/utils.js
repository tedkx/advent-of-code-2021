const ratings = {
  oxygenGenerator: 'oxygen-generator',
  co2Scrubber: 'CO2-scrubber',
};

const getRatingValue = (rating, numbers, idx = 0) => {
  if (numbers.length === 0) throw new Error("Now that's something");

  if (numbers.length === 1) return numbers[0];

  const { zeroes, ones } = numbers.reduce(
    (obj, number) => {
      obj[number[idx] === '1' ? 'ones' : 'zeroes'].push(number);
      return obj;
    },
    { zeroes: [], ones: [] }
  );

  const most = zeroes.length > ones.length ? zeroes : ones;
  const least = zeroes.length < ones.length ? zeroes : ones;
  const tieBreaker = rating === ratings.oxygenGenerator ? '1' : '0';
  const newNumbers =
    most.length === least.length
      ? numbers.filter(number => number[idx] === tieBreaker)
      : rating === ratings.oxygenGenerator
      ? most
      : least;

  return getRatingValue(rating, newNumbers, idx + 1);
};

export { ratings, getRatingValue };
