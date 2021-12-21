import React from 'react';

const OctopusIcon = ({ className, color }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <g transform="translate(0, 0)">
      <path
        fill={color}
        d="M22,20c-0.6,0-1,0.4-1,1c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1v-4h2c0.6,0,1-0.4,1-1v-6c0-5.5-4.5-10-10-10 C6.5,0,2,4.5,2,10v6c0,0.6,0.4,1,1,1h2v4c0,0.6-0.4,1-1,1c-0.6,0-1-0.4-1-1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,1.7,1.3,3,3,3 c1.7,0,3-1.3,3-3v-4h1v3c0,0.6,0.4,1,1,1c0.6,0,1-0.4,1-1v-3h1v6c0,0.6,0.4,1,1,1c0.6,0,1-0.4,1-1v-6h1v3c0,0.6,0.4,1,1,1 c0.6,0,1-0.4,1-1v-3h1v4c0,1.7,1.3,3,3,3c1.7,0,3-1.3,3-3C23,20.4,22.6,20,22,20z M10,9H7V7h3V9z M17,9h-3V7h3V9z"
      ></path>
    </g>
  </svg>
);

export default OctopusIcon;
