import React from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import Day1 from './Day1';
import Day2 from './Day2';
import Day3 from './Day3';
import Day4 from './Day4';

const routes = [Day1, Day2, Day3, Day4];

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
