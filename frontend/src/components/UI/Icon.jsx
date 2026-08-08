import React from 'react';

/**
 * Material Design 3 Symbol Icon
 */
const MdIcon = ({ name, className = '', style = {} }) => (
  <span
    className={`material-symbols-rounded ${className}`}
    style={{ fontSize: '20px', userSelect: 'none', ...style }}
  >
    {name}
  </span>
);

export default MdIcon;
