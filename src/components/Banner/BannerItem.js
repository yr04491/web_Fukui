import React from 'react';
import styles from './BannerItem.module.css';

const BannerItem = ({ children }) => {
  return (
    <div className={styles.banner}>
      {children}
    </div>
  );
};

export default BannerItem;
