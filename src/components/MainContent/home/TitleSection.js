import React from 'react';
import styles from './TitleSection.module.css';
import adobeStockImage from '../../../assets/images/main_img2.png';

const TitleSection = () => {
  return (
    <div className={styles.titleSection}>
      <p className={styles.mainTitle}>当事者たちでつくる、不登校情報サイト</p>
      <div className={styles.mainLogo}></div>
      <p className={styles.prefectureLabel}>福井県版</p>
      <div className={styles.adobeStockImage}>
        <img src={adobeStockImage} alt="AdobeStock" />
      </div>

      {/* --- ▼ 修正後のコード (Figmaデザイン) ▼ --- */}

      {/* Frame 17: このサイトは (div) */}
      <div className={styles.frame17}>
        このサイトは
      </div>

      {/* Frame 18: 当事者たちによる... (h1 -> div に変更) */}
      <div className={styles.frame18}>
        当事者たちによる当事者たちのための
      </div>
      
      {/* Frame 19: 白い枠 (内側の p タグを削除し、div に直接テキストを配置) */}
      <div className={styles.frame19}>
        本当に欲しい情報を集めたサイトです
      </div>
      
      {/* --- ▲ 修正後のコード 終了 ▲ --- */}

    </div>
  );
};

export default TitleSection;
