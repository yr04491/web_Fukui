import React from 'react';
import styles from './Banner.module.css';
import BannerItem from './BannerItem';

const Banner = () => {
  return (
    <div className={styles.bannerArea}>
      <BannerItem>バナーエリア</BannerItem>
      <BannerItem>バナーエリア</BannerItem>
      {/* GirlImageコンポーネントを統合 */}
      <div className={styles.girlImage}></div>
    </div>
  );
};

export default Banner;