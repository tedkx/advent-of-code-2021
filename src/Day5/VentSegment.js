import React from 'react';
import styles from './Day5.module.css';

const VentSegment = ({ value }) => {
  const className = React.useMemo(
    () =>
      [
        styles.gridValue,
        value === 1
          ? styles.vent1
          : value === 2
          ? styles.vent2
          : value === 3
          ? styles.vent3
          : value > 3
          ? styles.vent4
          : null,
      ]
        .filter(c => !!c)
        .join(' '),
    [value]
  );

  return <div className={className}>{value}</div>;
};

export default VentSegment;
