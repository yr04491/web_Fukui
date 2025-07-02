import React from 'react';

const Overlay = ({ isVisible, onClick }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
    display: isVisible ? 'block' : 'none',
  };

  return <div style={overlayStyle} onClick={onClick} />;
};

export default Overlay;
