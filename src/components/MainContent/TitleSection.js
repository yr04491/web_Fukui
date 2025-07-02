import React from 'react';
import styles from './TitleSection.module.css';

const TitleSection = () => {
  return (
    <div className={styles.titleSection}>
      <p className={styles.mainTitle}>当事者たちでつくる、不登校情報サイト</p>
      <div className={styles.mainLogo}></div>
    </div>
  );
};

export default TitleSection;
