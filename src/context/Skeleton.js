import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton Komponente für Ladezustände
 */
const Skeleton = ({ width, height, className }) => {
  const style = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div 
      className={`skeleton ${className || ''}`} 
      style={style}
      aria-hidden="true"
    />
  );
};

Skeleton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
};

export default Skeleton;