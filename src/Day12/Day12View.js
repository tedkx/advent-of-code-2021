/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import styles from './Day12.module.css';
import { usePathDiscovery } from './utils';

const maxPaths = 30;
const Day12View = ({ canRevisit, input }) => {
  const paths = usePathDiscovery(input, canRevisit);
  return (
    <div className={styles.container}>
      <div>
        Total Paths: <strong>{paths?.length}</strong>
      </div>
      <br />
      {(paths || [])
        .filter((_, idx) => idx < maxPaths)
        .map(p => (
          <div>{p.toString()}</div>
        ))}
      {(paths || []).length > maxPaths && `${paths.length - maxPaths} more...`}
    </div>
  );
};

export default Day12View;
