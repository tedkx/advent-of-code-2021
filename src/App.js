import React from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Day1 from './Day1';

const daysImplemented = 1;

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
    <>
      {links.map(([title, route]) => (
        <div>
          <Link to={route}>{title}</Link>{' '}
        </div>
      ))}
    </>
  );
};

function App() {
  return (
    <div className="app">
      <header className="app-header">\&gt; advent of code 2021</header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="day1" element={<Day1 />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

