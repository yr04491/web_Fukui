import React from 'react';
import styles from './ContentFrame.module.css';

const ContentFrame = ({ title, children, buttonElement }) => {
  return (
    <div className={styles.contentFrame}>
      <h3 className={styles.contentTitle}>{title}</h3>
      <div className={styles.contentText}>
        {children}
      </div>
      {buttonElement}
    </div>
  );
};

export default ContentFrame;
