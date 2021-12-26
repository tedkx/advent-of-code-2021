import React from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Day1 from './Day1';
import Day2 from './Day2';
import Day3 from './Day3';
import Day4 from './Day4';
import Day5 from './Day5';
import Day6 from './Day6';
import Day7 from './Day7';
import Day8 from './Day8';
import Day9 from './Day9';
import Day10 from './Day10';
import Day11 from './Day11';
import Day12 from './Day12';
import Day13 from './Day13';
import Day14 from './Day14';
import Day15 from './Day15';

const routes = [
  Day1,
  Day2,
  Day3,
  Day4,
  Day5,
  Day6,
  Day7,
  Day8,
  Day9,
  Day10,
  Day11,
  Day12,
  Day13,
  Day14,
  Day15,
];

const daysImplemented = routes.length;

const Home = () => {
  const links = React.useMemo(
    () =>
      Array.from(Array(daysImplemented)).map((_, idx) => [
        `Day ${idx + 1}`,
        `/day${idx + 1}`,
      ]),
    []
  );

  return (
    <div style={{ paddingTop: 25 }}>
      {links.map(([title, route]) => (
        <div>
          <Link to={route}>{title}</Link>{' '}
        </div>
      ))}
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/">\&gt; advent of code 2021</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {routes.map((Component, idx) => (
            <Route key={idx} path={`day${idx + 1}`} element={<Component />} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
