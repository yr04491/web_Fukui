import React from 'react';
import styles from './TitleSection.module.css';
import rainbowImage from '../../../assets/icons/rainbow.png';
import adobeStockImage from '../../../assets/images/AdobeStock2.png';

const TitleSection = () => {
  return (
    <div className={styles.titleSection}>
      <p className={styles.mainTitle}>当事者たちでつくる、不登校情報サイト</p>
      <div className={styles.mainLogo}></div>
      <p className={styles.prefectureLabel}>福井県版</p>
      <div className={styles.rainbowImage}>
        <img src={rainbowImage} alt="レインボー" />
      </div>
      <div className={styles.adobeStockImage}>
        <img src={adobeStockImage} alt="AdobeStock" />
      </div>
    </div>
  );
};

export default TitleSection;
