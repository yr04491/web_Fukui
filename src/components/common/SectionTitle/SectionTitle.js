import React from 'react';
import styles from './SectionTitle.module.css';
import dotlineImage from '../../../assets/images/dotline.png';

/**
 * セクションタイトルコンポーネント
 * ROAD番号とタイトルを表示する共通コンポーネント
 * 
 * @param {string} roadNumber - ROAD番号 (例: "00", "01", "02")
 * @param {string} title - セクションタイトル (例: "まずどうする")
 * @param {string} roadNumberImage - ROAD番号画像のパス
 */
const SectionTitle = ({ roadNumber, title, roadNumberImage }) => {
  return (
    <div className={styles.titleWrapper}>
      <div className={styles.logoContainer}>
        <span className={styles.roadText}>ROAD</span>
        <img src={roadNumberImage} alt={roadNumber} className={styles.logoChar} />
      </div>
      <h2 className={styles.mainTitle}>{title}</h2>
      <div 
        className={styles.dotline} 
        style={{ backgroundImage: `url(${dotlineImage})` }}
      ></div>
    </div>
  );
};

export default SectionTitle;
