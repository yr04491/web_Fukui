import React from 'react';
import styles from './Overlay.module.css';

const Overlay = ({ isVisible, onClick }) => {
  return (
    <div 
      className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} 
      onClick={onClick} 
    />
  );
};

export default Overlay;
