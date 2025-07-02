import React from 'react';
import styles from '../styles/Main.module.css';

const Banner = () => {
  return (
    <div className={styles.bannerArea}>
      {/* バナー1 */}
      <div className={styles.banner}>
        バナーエリア
      </div>
      
      {/* バナー2 */}
      <div className={styles.banner}>
        バナーエリア
      </div>
      
      {/* ガール画像 */}
      <div className={styles.girlImage}></div>
    </div>
  );
};

export default Banner;
